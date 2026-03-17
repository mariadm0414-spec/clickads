import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, logoBase64, userPrompt, apiKey, specificAngle, count, primaryColor, secondaryColor, font, aspectRatio } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        if (!productBase64) {
            return NextResponse.json({ error: "No se recibió la imagen del producto." }, { status: 400 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);
        const base64Data = productBase64.includes(",") ? productBase64.split(",")[1] : productBase64;
        const mimeType = productBase64.includes("image/png") ? "image/png" : "image/jpeg";

        const logoInstruction = logoBase64 ? " INTEGRATE LOGO: Use the provided secondary image as the brand logo. Place it naturally where it fits best (e.g. corner of the ad, or on a business card/background element) to make it look like a real professional advertisement. DO NOT write the word 'logo'." : "";
        const brandingContext = ` ${logoInstruction} BRANDING: Use ${primaryColor || "luxury"} as the primary color and ${secondaryColor || "white"} as the secondary color theme for buttons, shapes, and accents. Apply the ${font || "modern sans-serif"} font style for any text elements. IMPORTANT: DO NOT WRITE the names of the colors or fonts, such as "${font}", "${primaryColor}", or hex codes, as actual visible text in the image. Only apply them visually to the design elements.`;

        const allAdTypes = [
            { id: "TESTIMONIAL", name: "TESTIMONIAL", style: "luxury studio setting with a clean background", goal: "Añadir un testimonio de cliente en ESPAÑOL dentro de un rectángulo con bordes redondeados. Incluir icono de 5 estrellas." },
            { id: "SALES_CTA", name: "SALES_CTA", style: "urban premium lifestyle setting", goal: "Incluir el nombre del producto y un botón 'COMPRAR AHORA' en ESPAÑOL. Estética de alta conversión." },
            { id: "BENEFITS", name: "BENEFITS", style: "clean minimalist showroom", goal: "Resaltar 3 beneficios clave en ESPAÑOL (ej: 'Alta Calidad', 'Envío Gratis')." },
            { id: "INFOGRAPHIC", name: "INFOGRAPHIC", style: "flat-lay professional photography", goal: "Crear un diseño tipo infografía en ESPAÑOL con descriptores de texto modernos." },
            { id: "BEFORE_AFTER", name: "BEFORE_AFTER", style: "split screen comparison layout", goal: "Diseño comparativo en ESPAÑOL. A la izquierda etiquetar como 'SIN EL PRODUCTO' mostrando el problema, y a la derecha etiquetar como 'CON EL PRODUCTO' mostrando el resultado perfecto." },
            { id: "COMPARISON", name: "COMPARISON", style: "side-by-side product duel", goal: "Comparativa en ESPAÑOL. A un lado 'Otros' (genérico, mala calidad) y al otro 'Nuestro Producto' (premium, solución ideal)." },
            { id: "ZOOM_DETAIL", name: "ZOOM_DETAIL", style: "editorial photography layout", goal: "Doble composición: producto en escenario de lujo y un zoom resaltando texturas." }
        ];

        let targets = [];
        if (specificAngle) {
            const angle = allAdTypes.find(a => a.id === specificAngle) || allAdTypes[0];
            const num = count || 1;
            for (let i = 0; i < num; i++) targets.push(angle);
        } else {
            targets = allAdTypes;
        }

        const variations = [];
        let lastError = "";
        const modelNames = ["gemini-3.1-flash-image-preview", "imagen-3.0-generate-001"];

        for (let i = 0; i < targets.length; i++) {
            const type = targets[i];
            const basePrompt = `Identify the product in the primary image. Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE in SPANISH: ${type.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} Relación ${aspectRatio || '4:5'} vertical. Output: ONE high-quality image. Variation ${i + 1}`;

            let success = false;
            for (const mName of modelNames) {
                try {
                    const currentModel = userGenAI.getGenerativeModel({
                        model: mName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ],
                    });

                    const mediaParts = [
                        { inlineData: { data: base64Data, mimeType: mimeType } }
                    ];

                    if (logoBase64) {
                        const lData = logoBase64.includes(",") ? logoBase64.split(",")[1] : logoBase64;
                        const lMime = logoBase64.includes("image/png") ? "image/png" : "image/jpeg";
                        mediaParts.push({ inlineData: { data: lData, mimeType: lMime } });
                    }

                    const result = await currentModel.generateContent([
                        ...mediaParts,
                        finalPrompt,
                    ]);

                    const response = await result.response;
                    const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            title: type.name
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    lastError = err.message;
                    if (err.message.includes("429") || err.message.includes("Quota exceeded")) {
                        throw err;
                    }
                }
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2500));
            }
        }

        if (variations.length === 0) {
            throw new Error(lastError || "Error en la generación.");
        }

        return NextResponse.json({ success: true, variations: variations });

    } catch (error: any) {
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
            return NextResponse.json({ error: "CUOTA EXCEDIDA. Intenta en unos minutos." }, { status: 429 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}