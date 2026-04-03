import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, sector, primaryColor, secondaryColor, apiKey, count = 20 } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);

        // We'll generate logos individually for maximum reliability
        const variations: any[] = [];
        const targetCount = 12; // 12 is enough for a good selection and more reliable than 20

        const styles = [
            "Minimalist Icon", "Modern Typographic", "Geometric/Abstract",
            "Vintage badge", "Tech Futuristic", "Luxury Minimal",
            "Organic/Natural", "Modular/Clean", "Brand Emblem",
            "Line Art", "Creative Mascot", "Bold Square"
        ];

        const modelNames = [
            "gemini-3.1-flash-image-preview",
            "imagen-3.0-generate-001",
            "gemini-1.5-flash"
        ];

        for (let i = 0; i < targetCount; i++) {
            const currentStyle = styles[i % styles.length];
            const prompt = `
                Generate ONE High-end Professional Brand Logo.
                BUSINESS NAME: "${businessName}"
                SECTOR: "${sector}"
                PRIMARY COLOR: "${primaryColor}"
                SECONDARY COLOR: "${secondaryColor}"
                STYLE: "${currentStyle}"
                Background: Solid white. No text except "${businessName}". Style: Clean Vector.
                Dimensions: 1080x1080 pixels (Square).
            `;

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
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                        } as any
                    }, { apiVersion: "v1beta" });

                    const result = await currentModel.generateContent(prompt);
                    const response = await result.response;
                    const candidates = response.candidates?.[0]?.content?.parts || [];
                    const part = candidates.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            style: currentStyle
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    console.error(`Error in var ${i} with ${mName}:`, err.message);
                }
            }

            // Small delay to protect quota
            if (i < targetCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudierón generar las variaciones. Revisa tu cuota o API Key.");
        }

        return NextResponse.json({ success: true, variations: variations });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
