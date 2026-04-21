import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

// Llave maestra de respaldo por si el usuario no configura la suya
const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mode, chatHistory, clientType, userMessage, apiKey, productName, targetAudience } = body;

        // Priorizamos la del usuario, de lo contrario usamos la maestra
        const finalKey = apiKey || MASTER_KEY;

        // Inicialización con el nuevo SDK @google/genai
        const ai = new GoogleGenAI({ apiKey: finalKey });

        if (mode === "analyze") {
            const systemMsg = `Actúa como un Closer de Ventas de clase mundial especializado en WhatsApp.
            Analiza la conversación pegada y proporciona un análisis detallado en formato JSON.
            
            IMPORTANTE: Responde ÚNICAMENTE en formato JSON plano. No incluyas texto fuera del JSON.
            Formato:
            {
                "status": "...",
                "intent": "...",
                "responses": {
                    "recommended": "...",
                    "soft": "...",
                    "direct": "..."
                },
                "alerts": ["...", "..."],
                "score": number,
                "improvement": "...",
                "flow": ["Paso 1: ...", "Paso 2: ...", "Paso 3: ..."],
                "followUps": {
                    "h24": "...",
                    "seen": "...",
                    "think": "..."
                }
            }`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: [{ role: "user", parts: [{ text: `${systemMsg}\n\nAnaliza este chat:\n\n${userMessage}` }] }]
            });

            let text = response.text || "{}";

            // Limpiar posible formato markdown de JSON
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return NextResponse.json({ success: true, analysis: JSON.parse(text) });
        }

        if (mode === "simulate") {
            const systemMsg = `Eres un cliente potencial REAL en WhatsApp interesado en el producto: "${productName || 'un producto increíble'}". 
            Tu perfil psicológico (Avatar): "${targetAudience || 'un cliente interesado'}". 
            Tipo de comportamiento: ${clientType}. 
            
            REGLAS DE ORO:
            1. NO actúes como un asistente virtual. NO digas "En qué puedo ayudarte".
            2. Actúa como alguien que vio un anuncio y escribió por WhatsApp.
            3. Usa lenguaje informal, corto, con algunos emojis (estilo WhatsApp).
            4. Tu objetivo es preguntar, objetar y, si el vendedor es bueno, comprar.
            5. Si es el primer mensaje, sé tú quien inicie con algo natural de cliente.`;

            // Convertir historial simple a formato GenAI SDK
            // El nuevo SDK prefiere un array de mensajes planos o estructurados en objects
            const history = (chatHistory || []).map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: [
                    { role: "user", parts: [{ text: systemMsg }] },
                    { role: "model", parts: [{ text: "Entendido, actuaré como ese cliente de WhatsApp." }] },
                    ...history,
                    { role: "user", parts: [{ text: userMessage }] }
                ]
            });

            return NextResponse.json({ success: true, response: response.text });
        }

        if (mode === "evaluate") {
            const systemMsg = `Eres un coach de ventas. Evalúa la siguiente simulación de chat de WhatsApp.
            Responde ÚNICAMENTE en formato JSON:
            {
                "score": {
                    "overall": number,
                    "clarity": number,
                    "objections": number,
                    "closing": number
                },
                "feedback": {
                    "good": "...",
                    "bad": "...",
                    "better": "..."
                },
                "expertResponse": "..."
            }`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: [{ role: "user", parts: [{ text: `${systemMsg}\n\nEvalúa este chat:\n\n${userMessage}` }] }]
            });

            let text = response.text || "{}";
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return NextResponse.json({ success: true, evaluation: JSON.parse(text) });
        }

        return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });

    } catch (error: any) {
        console.error("WhatsApp Closer API Error (genai SDK):", error);
        return NextResponse.json({ error: error.message || "Error interno procesando la solicitud" }, { status: 500 });
    }
}
