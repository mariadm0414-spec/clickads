import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TEAM_AGENTS } from "@/lib/constants/team";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history, agentId } = body;

        const agent = TEAM_AGENTS.find(a => a.id === agentId);
        if (!agent) {
            return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });
        }

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "API Key no configurada" }, { status: 400 });
        }

        // Simulación de respuesta del agente (o llamada a OpenAI)
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: agent.systemPrompt },
                    ...(history || []),
                    { role: "user", content: message }
                ]
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        return NextResponse.json({ 
            success: true, 
            response: data.choices[0].message.content,
            agentName: agent.name 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
