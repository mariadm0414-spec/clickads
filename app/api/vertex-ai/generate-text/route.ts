import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, systemPrompt } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI Key no configurada." }, { status: 400 });
        }

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt || "Eres un asistente inteligente y profesional." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        return NextResponse.json({ success: true, result: data.choices[0].message.content });

    } catch (error: any) {
        console.error("Generate Text (OpenAI) Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
