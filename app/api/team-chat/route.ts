import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { TEAM_AGENTS } from "@/lib/constants/team";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
    // Always return valid JSON — even on unexpected crashes
    try {
        // ── Parse body safely ──────────────────────────────────
        let body: any;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Cuerpo de la petición inválido (JSON malformado)." },
                { status: 400 },
            );
        }

        const { agentId, message, history } = body ?? {};

        console.log("[team-chat] agentId:", agentId, "| message length:", message?.length);

        if (!agentId || !message) {
            return NextResponse.json({ error: "Faltan parámetros: agentId y message son requeridos." }, { status: 400 });
        }

        // ── Find agent ─────────────────────────────────────────
        const agent = TEAM_AGENTS.find((a) => a.id === agentId);
        if (!agent) {
            console.warn("[team-chat] Agente no encontrado:", agentId);
            return NextResponse.json({ error: `Agente '${agentId}' no encontrado.` }, { status: 404 });
        }

        // ── API Key ────────────────────────────────────────────
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("[team-chat] GEMINI_API_KEY no configurada");
            return NextResponse.json({ error: "Configuración de servidor incorrecta: API key faltante." }, { status: 500 });
        }

        // ── Build chat history ─────────────────────────────────
        const chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
        if (Array.isArray(history)) {
            for (const msg of history) {
                if (msg?.role && msg?.text) {
                    chatHistory.push({
                        role: msg.role === "user" ? "user" : "model",
                        parts: [{ text: String(msg.text) }],
                    });
                }
            }
        }

        // ── Call Gemini ────────────────────────────────────────
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        }, { apiVersion: "v1" });

        const chat = model.startChat({ history: chatHistory });

        let result;
        try {
            const finalPrompt = `[INSTRUCCIONES DE SISTEMA]: ${agent.systemPrompt}\n\n[MENSAJE DEL USUARIO]: ${String(message)}`;
            result = await chat.sendMessage(finalPrompt);
        } catch (geminiErr: any) {
            console.error("[team-chat] Error llamando a Gemini:", geminiErr?.message ?? geminiErr);
            return NextResponse.json(
                { error: `Error de Gemini: ${geminiErr?.message ?? "respuesta vacía"}` },
                { status: 502 },
            );
        }

        // ── Extract text defensively ───────────────────────────
        let reply = "";
        try {
            reply = result.response.text();
        } catch (textErr: any) {
            // Gemini blocked the response (safety filter, quota, etc.)
            const blockReason =
                result.response?.promptFeedback?.blockReason ??
                result.response?.candidates?.[0]?.finishReason ??
                "UNKNOWN";
            console.warn("[team-chat] Bloqueo de Gemini, blockReason:", blockReason);
            return NextResponse.json(
                { error: `La IA bloqueó la respuesta (${blockReason}). Intenta reformular tu mensaje.` },
                { status: 422 },
            );
        }

        if (!reply || reply.trim() === "") {
            console.warn("[team-chat] Gemini devolvió respuesta vacía para agentId:", agentId);
            return NextResponse.json(
                { error: "La IA devolvió una respuesta vacía. Intenta de nuevo." },
                { status: 502 },
            );
        }

        console.log("[team-chat] ✓ reply length:", reply.length);
        return NextResponse.json({ reply });

    } catch (error: any) {
        // Last-resort catch — always return valid JSON
        console.error("[team-chat] Error inesperado:", error?.message ?? error);
        return NextResponse.json(
            { error: error?.message ?? "Error interno del servidor." },
            { status: 500 },
        );
    }
}
