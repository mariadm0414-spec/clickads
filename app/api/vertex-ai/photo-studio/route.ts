import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, logoBase64, mode, apiKey, gender, customBackground, aspectRatio } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const logoInstruction = logoBase64 ? " INTEGRATE LOGO: Use the provided secondary image as the brand logo. Place it naturally where it fits best (e.g. on the product, in the corner, or in the background) to look like a real commercial shoot. DO NOT write the word 'logo'." : "";
        let finalPrompt = "";

        if (mode === "white_3d") {
            finalPrompt = `Place this product on a perfectly clean, professional 3D studio white background with subtle soft shadows. ${logoInstruction} ACHIEVE HYPER-REALISM. High-end product photography style. The product must have realistic textures, reflections, and cinematic lighting. PRODUCT SCALE: Must be perfectly realistic. TEN ESTO MUY PRESENTE: TODO EL TEXTO EN LA IMAGEN (si hay alguno) DEBIT SER EN ESPAÑOL. Aspect ratio ${aspectRatio || '4:5'}.`;
        } else if (mode === "model") {
            const backgroundType = customBackground ? `in a ${customBackground} setting` : "on a professional studio white background";
            finalPrompt = `Show a professional ${gender === 'male' ? 'male' : 'female'} model holding or interacting with this product ${backgroundType}. ${logoInstruction}
            TEN ESTO MUY PRESENTE: TODO EL TEXTO EN LA IMAGEN DEBE SER EN ESPAÑOL. NO EXCEPTIONS.
            CRITICAL: ACHIEVE ULTRA-REALISM AND HYPER-DETAIL. People must have visible skin textures, pores, and natural skin details. No AI-smoothing. 
            PRODUCT SIZE & SCALE: The product size relative to the model must be perfect and realistic. 
            The product MUST NOT look like a sticker; it must integrate with natural shadows and physical contact (e.g., skin pressing against it). 
            Captured with professional 85mm lens, high-end commercial style. Aspect ratio ${aspectRatio || '4:5'}.`;
        }

        const modelNames = ["imagen-3.0-generate-001"];
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
                }, { apiVersion: "v1beta" });

                const result = await model.generateContent([
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