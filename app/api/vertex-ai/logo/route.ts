import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, sector, primaryColor, secondaryColor, likedLogos, positiveFeedback, negativeFeedback, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Gemini no configurada. Ve a Configuración y agrega tu API Key." }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const parts: any[] = [];
        if (likedLogos && Array.isArray(likedLogos)) {
            const selection = likedLogos.slice(0, 6);
            for (const logoUrl of selection) {
                try {
                    if (logoUrl.startsWith('data:')) {
                        const dataParts = logoUrl.split(',');
                        if (dataParts.length > 1) {
                            const header = dataParts[0];
                            const base64 = dataParts[1];
                            const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
                            parts.push({
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
                        parts.push({
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

        const feedbackContext = (positiveFeedback || negativeFeedback) ? `
            USER FEEDBACK FOR THIS ITERATION:
            The user likes: "${positiveFeedback || 'no specific likes provided'}"
            The user wants to CHANGE or remove: "${negativeFeedback || 'no specific dislikes provided'}"
            Please incorporate this feedback strictly in the new generation.
        ` : "";

        const prompt = `
            TASK: Generate a high-end, professional brand logo.
            BUSINESS NAME: "${businessName}"
            SECTOR: "${sector}"
            PRIMARY COLOR: "${primaryColor}"
            SECONDARY COLOR: "${secondaryColor}"
            ${feedbackContext}
            
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

        parts.push({ text: prompt });

        const response: any = await ai.models.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: [{ role: "user", parts }],
            config: {
                responseModalities: ["IMAGE"]
            }
        } as any);

        const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

        if (!part || !part.inlineData) {
            throw new Error("No se pudo generar el logo.");
        }

        const finalLogo = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return NextResponse.json({ success: true, logo: finalLogo });

    } catch (error: any) {
        console.error("Logo Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
