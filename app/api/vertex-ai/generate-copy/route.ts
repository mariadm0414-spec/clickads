import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, userPrompt, apiKey, brandName, productName, targetAudience } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        if (!image) {
            return NextResponse.json({ error: "No se recibió la imagen para el análisis." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Probamos una lista extensa de modelos, incluyendo los que ya funcionan en tu generador de imágenes
        const modelNames = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-3.1-flash-image-preview" // Este parece estar habilitado en tu proyecto
        ];

        let lastError = "";

        for (const modelName of modelNames) {
            try {
                console.log(`Intentando generar copy con modelo: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    ],
                });

                const base64Data = image.includes(",") ? image.split(",")[1] : image;
                const mimeType = image.includes("image/png") ? "image/png" : "image/jpeg";

                const productCtx = productName ? `PRODUCTO: ${productName}. ` : "";
                const audienceCtx = targetAudience ? `AVATAR/PÚBLICO: ${targetAudience}. ` : "";

                const prompt = `Analiza la imagen adjunta de un anuncio publicitario. ${productCtx}${audienceCtx}Genera UN solo "Ad Copy" de alto impacto (texto persuasivo para Facebook/Instagram Ads) en ESPAÑOL.
                
                Marca: ${brandName || "ClickAds"}
                Contexto Adicional del Usuario: ${userPrompt || "Ninguno"}
                
                Estructura del copy:
                - Gancho (Hook) intrigante.
                - Propuesta de valor clara.
                - CTA persuasivo.
                - Emojis relevantes.
                
                Responde ÚNICAMENTE con el texto del anuncio, sin preámbulos ni despedidas.`;

                const result = await model.generateContent([
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType
                        }
                    },
                    prompt
                ]);

                const response = await result.response;
                const text = response.text();

                if (text) {
                    return NextResponse.json({ success: true, copy: text });
                }
            } catch (err: any) {
                console.error(`Error con el modelo ${modelName}:`, err.message);
                lastError = err.message;
            }
        }

        throw new Error(`Error de API: Ninguno de los modelos seleccionados (incluyendo gemini-1.5-flash) está disponible con tu API Key actual. Revisa los permisos de tu API Key en Google AI Studio.`);

    } catch (error: any) {
        console.error("Critical Copy Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
