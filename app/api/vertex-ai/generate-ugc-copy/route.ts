import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productName, targetAudience, angle, apiKey } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI Key no configurada." }, { status: 400 });
        }

        const systemMsg = `Eres un experto en guiones para TikTok e Instagram Reels (UGC).
        Genera un guion dinámico para el producto: "${productName || 'este producto'}".
        Público objetivo: "${targetAudience || 'personas interesadas'}".
        Ángulo de venta: "${angle || 'general'}".
        
        REGLAS:
        1. Gancho inicial en los primeros 3 segundos.
        2. Demostración del beneficio.
        3. Llamada a la acción clara.
        4. Idioma: ESPAÑOL.
        5. Responde ÚNICAMENTE con el guion.`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemMsg },
                    { role: "user", content: `Genera el guion UGC para ${productName}` }
                ]
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        return NextResponse.json({ success: true, copy: data.choices[0].message.content });

    } catch (error: any) {
        console.error("Generate UGC Copy (OpenAI) Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
