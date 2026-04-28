import { NextRequest, NextResponse } from "next/server";

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;

// Utilidad para subir imagen a Leonardo
async function uploadToLeonardo(imageBase64: string, extension: string = "jpg") {
    // 1. Obtener URL pre-firmada
    const initResponse = await fetch("https://cloud.leonardo.ai/api/rest/v1/init-image", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${LEONARDO_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ extension })
    });

    if (!initResponse.ok) {
        throw new Error(`Error init-image: ${initResponse.statusText}`);
    }

    const initData = await initResponse.json();
    const { uploadInitImage } = initData;

    // 2. Subir el binario a S3
    const imageBuffer = Buffer.from(imageBase64, "base64");

    // Si hay fields, es una subida compleja a S3 (POST form)
    if (uploadInitImage.fields) {
        const formData = new FormData();
        const fields = JSON.parse(uploadInitImage.fields);
        Object.keys(fields).forEach(key => formData.append(key, fields[key]));
        formData.append("file", new Blob([imageBuffer], { type: "image/jpeg" }));

        const uploadResponse = await fetch(uploadInitImage.url, {
            method: "POST",
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error("Fallo al subir imagen a S3 (fields)");
        }
    } else {
        // Subida directa PUT
        const uploadResponse = await fetch(uploadInitImage.url, {
            method: "PUT",
            body: imageBuffer,
            headers: { "Content-Type": "image/jpeg" } // Asumimos jpg
        });

        if (!uploadResponse.ok) {
            throw new Error("Fallo al subir imagen a S3 (PUT)");
        }
    }

    return uploadInitImage.id;
}

export async function POST(request: NextRequest) {
    const correlationId = Math.random().toString(36).substring(7);
    console.log(`[${correlationId}] === FACTORY API STARTED (LEONARDO.AI - IMAGE GUIDANCE) ===`);

    try {
        if (!LEONARDO_API_KEY) {
            return NextResponse.json({
                error: "Falta la API Key de Leonardo.ai en .env.local",
                details: "Añade LEONARDO_API_KEY=... en tu archivo de variables de entorno."
            }, { status: 500 });
        }

        const body = await request.json();
        const { descripcion, imageBase64, businessContext } = body;

        if (!descripcion) {
            return NextResponse.json({ error: "Descripción requerida." }, { status: 400 });
        }

        let initImageId = null;

        // Construct Final Prompt
        let finalPrompt = descripcion;
        if (businessContext) {
            finalPrompt = `${businessContext}\n\nINSTRUCCIÓN CREATIVA: ${descripcion}`;
        }

        // 1. SUBIR IMAGEN DE REFERENCIA (Si existe)
        if (imageBase64) {
            console.log(`[${correlationId}] Subiendo imagen de referencia a Leonardo...`);
            try {
                initImageId = await uploadToLeonardo(imageBase64, "jpg");
                console.log(`[${correlationId}] Imagen subida con ID: ${initImageId}`);
            } catch (uploadError: any) {
                console.error(`[${correlationId}] Error subiendo imagen:`, uploadError);
                return NextResponse.json({ error: "Fallo al subir imagen de referencia a Leonardo." }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Se requiere una imagen de referencia para este modo." }, { status: 400 });
        }

        // 2. GENERAR CON LEONARDO (Model: Leonardo Phoenix Realismo)
        // Phoenix ID Especifico: 7b592283-e8a7-4c5a-9ba6-d18c31f258b9
        const MODEL_ID = "7b592283-e8a7-4c5a-9ba6-d18c31f258b9";

        console.log(`[${correlationId}] Iniciando generación con Phoenix + Content Ref (Strength 0.70)...`);

        const generationPayload = {
            prompt: finalPrompt, // Prompt enriquecido con Contexto de Negocio
            modelId: MODEL_ID,
            width: 1024,
            height: 1024,
            num_images: 1,
            guidance_scale: 7,
            init_generation_image_id: null,
            init_image_id: initImageId, // Image-to-Image base (Color/Texture)
            init_strength: 0.70, // Balance entre fidelidad y creatividad
            controlnets: [
                {
                    initImageId: initImageId,
                    initImageType: "DEPTH", // Usamos DEPTH como base estructural
                    preprocessorId: 133, // ID 133 = Content Reference (clave para calcar productos)
                    strengthType: "High"
                }
            ],
            public: false
        };

        const genResponse = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${LEONARDO_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(generationPayload)
        });

        if (!genResponse.ok) {
            const errorText = await genResponse.text();
            throw new Error(`Error generando imagen: ${genResponse.statusText} - ${errorText}`);
        }

        const genData = await genResponse.json();
        const generationId = genData.sdGenerationJob?.generationId;

        if (!generationId) {
            throw new Error("No se recibió generationId de Leonardo.");
        }

        console.log(`[${correlationId}] Job ID: ${generationId}. Esperando resultados...`);

        // 3. POLLING FOR RESULTS
        let generatedImageUrl = null;
        let attempts = 0;
        const maxAttempts = 30; // 30 * 2s = 60s timeout

        while (!generatedImageUrl && attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000)); // Esperar 2s
            attempts++;

            const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                headers: { "Authorization": `Bearer ${LEONARDO_API_KEY}` }
            });

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                const generation = statusData.generations_by_pk;

                if (generation && generation.status === "COMPLETE") {
                    generatedImageUrl = generation.generated_images[0]?.url;
                } else if (generation && generation.status === "FAILED") {
                    throw new Error("La generación falló en Leonardo.");
                }
            }
        }

        if (!generatedImageUrl) {
            throw new Error("Tiempo de espera agotado para la generación.");
        }

        console.log(`[${correlationId}] Imagen generada: ${generatedImageUrl}`);

        // 4. DESCARGAR Y CONVERTIR A BASE64 (Para compatibilidad con frontend)
        const imageFetch = await fetch(generatedImageUrl);
        const imageBuffer = await imageFetch.arrayBuffer();
        const responseBase64 = Buffer.from(imageBuffer).toString("base64");

        return NextResponse.json({
            success: true,
            images: [{
                imageBase64: responseBase64,
                mimeType: "image/jpeg", // Leonardo suele devolver JPG/WEBP
                variationType: "Leonardo Phoenix (Image Guidance)",
                revisedPrompt: descripcion
            }]
        });

    } catch (error: any) {
        console.error(`[${correlationId}] SERVER ERROR:`, error);
        return NextResponse.json({
            error: error.message || "Error interno del servidor",
            details: error
        }, { status: 500 });
    }
}
