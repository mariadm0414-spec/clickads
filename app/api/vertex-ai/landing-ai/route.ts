import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, systemPrompt, images } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI API Key no configurada." }, { status: 400 });
        }

        // Build the user message - support images if provided
        let userMessage: any;
        if (images && images.length > 0) {
            userMessage = {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    ...images.map((img: string) => ({
                        type: "image_url",
                        image_url: {
                            url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`,
                            detail: "high"
                        }
                    }))
                ]
            };
        } else {
            userMessage = { role: "user", content: prompt };
        }

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt || "Eres un experto en e-commerce. Responde ÚNICAMENTE con JSON válido."
                    },
                    userMessage
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const content = data.choices[0].message.content;
        return NextResponse.json({ success: true, result: content });

    } catch (error: any) {
        console.error("Landing AI (OpenAI) Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
