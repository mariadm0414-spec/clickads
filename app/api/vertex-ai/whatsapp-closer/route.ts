import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

// Llave maestra de respaldo por si el usuario no configura la suya
const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mode, chatHistory, clientType, userMessage, apiKey, productName, targetAudience } = body;

        // Priorizamos la del usuario, de lo contrario usamos la maestra
        const finalKey = apiKey || MASTER_KEY;

        const genAI = new GoogleGenerativeAI(finalKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Actualizado a 2.0
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

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

            const result = await model.generateContent([systemMsg, `Analiza este chat:\n\n${userMessage}`]);
            const response = await result.response;
            let text = response.text();

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

            // Convertir historial simple a formato Gemini
            const history = (chatHistory || []).map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));

            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: systemMsg }] },
                    { role: "model", parts: [{ text: "Entendido, actuaré como ese cliente de WhatsApp." }] },
                    ...history
                ]
            });

            const result = await chat.sendMessage(userMessage);
            const response = await result.response;

            return NextResponse.json({ success: true, response: response.text() });
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

            const result = await model.generateContent([systemMsg, `Evalúa este chat:\n\n${userMessage}`]);
            const response = await result.response;
            let text = response.text();

            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return NextResponse.json({ success: true, evaluation: JSON.parse(text) });
        }

        return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });

    } catch (error: any) {
        console.error("WhatsApp Closer API Error:", error);
        return NextResponse.json({ error: error.message || "Error procesando la solicitud" }, { status: 500 });
    }
}
