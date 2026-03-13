import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, mode, apiKey, gender, customBackground } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        if (!productBase64) {
            return NextResponse.json({ error: "No se recibió la imagen del producto." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const base64Data = productBase64.includes(",") ? productBase64.split(",")[1] : productBase64;
        const mimeType = productBase64.includes("image/png") ? "image/png" : "image/jpeg";

        let finalPrompt = "";

        if (mode === "white_3d") {
            finalPrompt = "Place this product on a perfectly clean, professional 3D studio white background with subtle soft shadows. High-end product photography style. The product should be the central focus. Realistic textures and lighting. Aspect ratio 4:5.";
        } else if (mode === "model") {
            const backgroundType = customBackground ? `in a ${customBackground} setting` : "on a professional studio white background";
            finalPrompt = `Show a professional ${gender === 'male' ? 'male' : 'female'} model holding or interacting with this product ${backgroundType}. High-end commercial fashion photography style. Realistic lighting and details. Focus on the product being integrated naturally with the model. Aspect ratio 4:5.`;
        }

        const modelNames = ["gemini-3.1-flash-image-preview", "imagen-3.0-generate-001"];
        let lastError = "";
        let generatedImage = null;

        for (const mName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({
                    model: mName,
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    ],
                });

                const result = await model.generateContent([
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    finalPrompt,
                ]);

                const response = await result.response;
                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            } catch (err: any) {
                lastError = err.message;
                if (err.message.includes("429") || err.message.includes("Quota exceeded")) {
                    throw err;
                }
            }
        }

        if (!generatedImage) {
            throw new Error(lastError || "Error en la generación de la imagen.");
        }

        return NextResponse.json({ success: true, image: generatedImage });

    } catch (error: any) {
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
            return NextResponse.json({ error: "CUOTA EXCEDIDA. Intenta en unos minutos." }, { status: 429 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
