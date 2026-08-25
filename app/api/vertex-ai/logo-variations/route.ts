import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, sector, primaryColor, secondaryColor, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Gemini no configurada. Ve a Configuración y agrega tu API Key." }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const variations: any[] = [];
        const targetCount = 12;

        const styles = [
            "Minimalist Icon", "Modern Typographic", "Geometric/Abstract",
            "Vintage badge", "Tech Futuristic", "Luxury Minimal",
            "Organic/Natural", "Modular/Clean", "Brand Emblem",
            "Line Art", "Creative Mascot", "Bold Square"
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

            try {
                const response: any = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    config: {
                        responseModalities: ["IMAGE"]
                    }
                } as any);

                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    variations.push({
                        image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        style: currentStyle
                    });
                }
            } catch (err: any) {
                console.error(`Error in logo variation ${i}:`, err.message);
            }

            if (i < targetCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudierón generar las variaciones.");
        }

        return NextResponse.json({ success: true, variations: variations });

    } catch (error: any) {
        console.error("Logo Variations Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
