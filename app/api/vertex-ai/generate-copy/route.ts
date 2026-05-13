import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

export async function GET() {
    return NextResponse.json({ message: "Copy Generation API is reachable" });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productName, targetAudience, angle, apiKey, imageBase64, mimeType } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        
        // Try OpenAI first if key is present
        if (openAIKey) {
            try {
                let systemMsg = `Eres un Copywriter de Respuesta Directa de élite. 
                Genera un copy publicitario PERSUASIVO, AGRESIVO y de ALTA CONVERSIÓN para el producto: "${productName || 'este producto'}".
                Público objetivo: "${targetAudience || 'personas interesadas'}".
                Ángulo de venta: "${angle || 'general'}".
                
                REGLAS:
                1. Usa el método AIDA o PAS.
                2. Incluye emojis estratégicos.
                3. El idioma debe ser ESPAÑOL.
                4. Responde ÚNICAMENTE con el texto del anuncio.`;

                const messages: any[] = [
                    { role: "system", content: systemMsg }
                ];

                if (imageBase64) {
                    messages.push({
                        role: "user",
                        content: [
                            { type: "text", text: `Basado en esta imagen y en el producto ${productName}, genera el copy perfecto.` },
                            { type: "image_url", image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } }
                        ]
                    });
                } else {
                    messages.push({ role: "user", content: `Genera el copy para ${productName}` });
                }

                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openAIKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: messages
                    })
                });

                const data = await res.json();
                if (data.choices?.[0]?.message?.content) {
                    return NextResponse.json({ success: true, copy: data.choices[0].message.content });
                }
            } catch (err) {
                console.error("OpenAI Copy Error, trying Gemini fallback...", err);
            }
        }

        // Fallback to Gemini if OpenAI fails or is not configured
        if (!apiKey) {
            return NextResponse.json({ error: "No hay API Keys configuradas (OpenAI o Gemini)." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Actúa como un Copywriter experto. Genera un ad copy de alta conversión en ESPAÑOL para el producto "${productName}" 
        dirigido a "${targetAudience}" con el ángulo "${angle}". 
        Usa emojis, estructura persuasiva y un llamado a la acción claro.
        Responde solo con el texto del anuncio.`;

        let result;
        if (imageBase64) {
            result = await model.generateContent([
                prompt,
                { inlineData: { data: imageBase64, mimeType: mimeType || "image/jpeg" } }
            ]);
        } else {
            result = await model.generateContent(prompt);
        }

        const text = result.response.text();
        return NextResponse.json({ success: true, copy: text });

    } catch (error: any) {
        console.error("Generate Copy Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
