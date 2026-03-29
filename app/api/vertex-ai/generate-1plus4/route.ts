import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Configuración de estabilidad para Next.js (App Router)
export const maxDuration = 300;

// Configuración de la API Key

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, userPrompt, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar. Por favor, ingrésala en la configuración." }, { status: 401 });
        }

        if (!productBase64) {
            return NextResponse.json({ error: "No se recibió la imagen del producto (productBase64)." }, { status: 400 });
        }

        // Inicializamos con la API Key del usuario
        const userGenAI = new GoogleGenerativeAI(apiKey);
        const model = userGenAI.getGenerativeModel({
            model: "gemini-3.1-flash-image-preview",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

        const base64Data = productBase64.includes(",") ? productBase64.split(",")[1] : productBase64;
        const mimeType = productBase64.includes("image/png") ? "image/png" : "image/jpeg";

        // Configuraciones específicas para cada tipo de anuncio solicitado (En Español)
        const adTypes = [
            {
                name: "TESTIMONIAL",
                style: "luxury studio setting with a clean background",
                goal: "Añadir un testimonio de cliente en ESPAÑOL dentro de un rectángulo con bordes redondeados (estilo burbuja premium). Incluir el nombre de una persona ficticia debajo de la cita y un icono de 5 estrellas de satisfacción."
            },
            {
                name: "SALES_CTA",
                style: "urban premium lifestyle setting",
                goal: "Incluir el nombre del producto en tipografía moderna y un botón claro de 'COMPRAR AHORA' en ESPAÑOL. Estética de venta directa de alta conversión."
            },
            {
                name: "BENEFITS",
                style: "clean minimalist showroom",
                goal: "Resaltar 3 beneficios clave en ESPAÑOL usando puntos o iconos minimalistas (ej: 'Alta Calidad', 'Diseño Exclusivo', 'Envío Gratis')."
            },
            {
                name: "INFOGRAPHIC",
                style: "flat-lay professional photography",
                goal: "Crear un diseño tipo infografía en ESPAÑOL. Señalar partes del producto con líneas finas y descriptores de texto modernos que expliquen su tecnología."
            },
            {
                name: "ZOOM_DETAIL",
                style: "editorial photography layout",
                goal: "Crear un diseño de doble composición. En un lado, el producto en su escenario de lujo. Al lado, dentro de un CUADRO BLANCO elegante, mostrar un ZOOM (macro detail) del producto resaltando su textura y acabados premium."
            }
        ];

        console.log("[ENGINE] Iniciando generación de 5 anuncios especializados en ESPAÑOL...");

        console.log("[ENGINE] Ejecutando 5 anuncios en MODO SECUENCIAL para evitar límites de cuota (429)...");

        const variations = [];
        let lastError = "";

        // Modelos a probar en orden de preferencia para BYOK
        const modelNames = ["gemini-3.1-flash-image-preview", "imagen-3.0-generate-001"];

        for (let i = 0; i < adTypes.length; i++) {
            const type = adTypes[i];
            console.log(`[ENGINE] Procesando variación ${i + 1}/5: ${type.name}...`);

            const basePrompt = `Identify the product. Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE in SPANISH: ${type.goal}.`;
            const customContext = userPrompt ? ` CONTEXTO: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} Relación 4:5 vertical. Output: ONE high-quality image.`;

            let success = false;
            for (const mName of modelNames) {
                try {
                    const currentModel = userGenAI.getGenerativeModel({ model: mName });
                    const result = await currentModel.generateContent([
                        { inlineData: { data: base64Data, mimeType: mimeType } },
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
                        break; // Éxito, saltar al siguiente tipo de anuncio
                    }
                } catch (err: any) {
                    console.error(`[ENGINE] Error con ${mName}:`, err.message);
                    lastError = err.message;
                    if (err.message.includes("429") || err.message.includes("Quota exceeded")) {
                        throw err; // Forzar error de cuota global
                    }
                }
            }

            // Delay de 5 segundos para resguardar la cuota del Free Tier
            if (i < adTypes.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (variations.length === 0) {
            throw new Error(lastError || "No se pudo generar ninguna imagen. Verifica que tu API Key de Google tenga activado el acceso a Gemini Imagen.");
        }

        console.log(`[ENGINE] Éxito: ${variations.length} imágenes generadas.`);

        return NextResponse.json({
            success: true,
            variations: variations,
            model: "Gemini Engine Ultra (vBYOK Sequential)",
            total: variations.length
        });

    } catch (error: any) {
        console.error("Error crítico en el backend:", error.message);

        // Manejo amigable de errores de cuota (429)
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
            return NextResponse.json({
                error: "¡CUOTA EXCEDIDA! Tu API Key de Google ha llegado al límite gratuito. \n\nSOLUCIÓN: \n1. Espera unos minutos e intenta de nuevo. \n2. Entra en Google AI Studio y verifica tu cuota. \n3. Activa el 'Pay-as-you-go' en Google Cloud si necesitas uso ilimitado."
            }, { status: 429 });
        }

        return NextResponse.json({ error: `[GOOGLE AI ERROR]: ${error.message}` }, { status: 500 });
    }
}
