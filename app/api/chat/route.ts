import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { TEAM_AGENTS } from "@/lib/constants/team";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        let body: any;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "JSON inválido en el cuerpo de la petición." }, { status: 400 });
        }

        const { agentId, message, history } = body ?? {};

        if (!agentId || !message) {
            return NextResponse.json({ error: "agentId y message son requeridos." }, { status: 400 });
        }

        const agent = TEAM_AGENTS.find((a) => a.id === agentId);
        if (!agent) {
            return NextResponse.json({ error: `Agente '${agentId}' no encontrado.` }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY no configurada." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        }, { apiVersion: "v1" });

        // Build Gemini history — must start with 'user' role
        const geminiHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
        if (Array.isArray(history)) {
            // Drop any leading non-user messages (e.g. the UI welcome message)
            let started = false;
            for (const msg of history) {
                if (!started && msg.role !== "user") continue;
                started = true;
                if (msg?.text) {
                    geminiHistory.push({
                        role: msg.role === "user" ? "user" : "model",
                        parts: [{ text: String(msg.text) }],
                    });
                }
            }
        }

        const chat = model.startChat({ history: geminiHistory });

        let result: any;
        try {
            const finalPrompt = `[INSTRUCCIONES DE SISTEMA]: ${agent.systemPrompt}\n\n[MENSAJE DEL USUARIO]: ${String(message)}`;
            result = await chat.sendMessage(finalPrompt);
        } catch (err: any) {
            console.error("[chat] sendMessage error:", err?.message);
            return NextResponse.json({ error: `Error de Gemini: ${err?.message ?? "desconocido"}` }, { status: 502 });
        }

        let reply = "";
        try {
            reply = result.response.text();
        } catch {
            const reason = result.response?.promptFeedback?.blockReason ?? "SAFETY";
            return NextResponse.json({ error: `Respuesta bloqueada por Gemini (${reason}).` }, { status: 422 });
        }

        if (!reply?.trim()) {
            return NextResponse.json({ error: "La IA devolvió una respuesta vacía. Intenta de nuevo." }, { status: 502 });
        }

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("[chat] Error inesperado:", error?.message);
        return NextResponse.json({ error: error?.message ?? "Error interno del servidor." }, { status: 500 });
    }
}
