import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, sector, primaryColor, secondaryColor, likedLogos, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);

        // Process liked logos for multimodal input
        const mediaParts = [];
        if (likedLogos && Array.isArray(likedLogos)) {
            // Take up to 6 examples to keep it manageable
            const selection = likedLogos.slice(0, 6);
            for (const logoUrl of selection) {
                try {
                    if (logoUrl.startsWith('data:')) {
                        const parts = logoUrl.split(',');
                        if (parts.length > 1) {
                            const header = parts[0];
                            const base64 = parts[1];
                            const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
                            mediaParts.push({
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64
                                }
                            });
                        }
                    } else if (logoUrl.startsWith('http')) {
                        const response = await fetch(logoUrl);
                        const buffer = await response.arrayBuffer();
                        const base64 = Buffer.from(buffer).toString('base64');
                        mediaParts.push({
                            inlineData: {
                                mimeType: "image/png",
                                data: base64
                            }
                        });
                    }
                } catch (e) {
                    console.error("Error processing example logo:", e);
                }
            }
        }

        const prompt = `
            TASK: Generate a high-end, professional brand logo.
            BUSINESS NAME: "${businessName}"
            SECTOR: "${sector}"
            PRIMARY COLOR: "${primaryColor}"
            SECONDARY COLOR: "${secondaryColor}"
            
            STYLE GUIDELINES:
            1. MODERN & MINIMALIST: Use clean lines and balanced proportions.
            2. VECTOR STYLE: The final result should look like a professional vector logo on a clean background.
            3. COLOR HARMONY: Primarily use ${primaryColor} and ${secondaryColor}. No neon unless specified.
            4. LEGIBILITY: The name "${businessName}" must be clearly legible if text is included.
            5. SYMBOLISM: Incorporate a subtle icon or symbol relevant to the ${sector} sector.
            6. BACKGROUND: Use a solid, clean neutral background (e.g., white or light grey) to make the logo pop.
            7. REFERENCE: Synthesize the aesthetic of the provided example images while making it unique and superior.
            8. DIMENSIONS: 1080x1080 pixels (Square).
            
            NO TECHNICAL LABELS: Do not include words like "Logo", "Design", "Concept", color names as text.
        `;

        const modelNames = [
            "gemini-3.1-flash-image-preview",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro-latest",
            "imagen-3.0-generate-001"
        ];

        let finalLogo = null;

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

                const result = await currentModel.generateContent({
                    contents: [{
                        role: "user",
                        parts: [
                            ...mediaParts,
                            { text: prompt }
                        ]
                    }]
                });

                const response = await result.response;
                const parts = response.candidates?.[0]?.content?.parts || [];
                const part = parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    finalLogo = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            } catch (err: any) {
                console.error(`Error with model ${mName}:`, err.message);
            }
        }

        if (!finalLogo) {
            throw new Error("No se pudo generar el logo. Por favor, revisa tu API Key o intenta más tarde.");
        }

        return NextResponse.json({ success: true, logo: finalLogo });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
