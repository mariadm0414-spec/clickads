import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mode, chatHistory, clientType, userMessage, apiKey, productName, targetAudience } = body;

        // Prioridad: Si hay OpenAI Key en env, usarla. Si no, usar la de Gemini (pero ahora el cliente quiere OpenAI)
        const openAIKey = process.env.OPENAI_API_KEY;

        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI API Key no configurada en el servidor." }, { status: 400 });
        }

        const openaiFetch = async (messages: any[]) => {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAIKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: messages,
                    temperature: 0.7
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        };

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

            const text = await openaiFetch([
                { role: "system", content: systemMsg },
                { role: "user", content: `Analiza este chat:\n\n${userMessage}` }
            ]);

            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return NextResponse.json({ success: true, analysis: JSON.parse(cleanText) });
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

            const history = (chatHistory || []).map((m: any) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
            }));

            const response = await openaiFetch([
                { role: "system", content: systemMsg },
                ...history,
                { role: "user", content: userMessage }
            ]);

            return NextResponse.json({ success: true, response });
        }

        if (mode === "evaluate") {
            const systemMsg = `Actúa como un Entrenador de Ventas de Élite, Psicólogo del Consumidor y Experto en Cierre de Ventas por WhatsApp. 
            Tu objetivo es proporcionar un INFORME EXTREMADAMENTE DETALLADO Y EXTENSO (mínimo 500 palabras) sobre la interacción del vendedor.
            
            El informe debe estar estructurado en Markdown y cubrir estas áreas:
            1. **Análisis de Apertura:** Cómo inició la charla y la primera impresión generada.
            2. **Psicología del Cliente:** Explica qué estaba pensando el cliente en cada fase según su perfil "${clientType}".
            3. **Detección de Errores Críticos:** Señala exactamente dónde se perdió la autoridad o la conexión.
            4. **Técnicas de Persuasión:** Evalúa el uso de gatillos mentales (escasez, urgencia, prueba social, autoridad).
            5. **Manejo Quirúrgico de Objeciones:** Analiza si respondió a la objeción real o solo a la superficie.
            6. **Veredicto del Cierre:** Por qué se cerró o por qué se perdió la venta.
            
            IMPORTANTE: Responde ÚNICAMENTE en formato JSON plano:
            {
                "score": {
                    "overall": 0-100,
                    "rapport": 0-10,
                    "objections": 0-10,
                    "closing": 0-10
                },
                "report": "TU INFORME LARGO Y DETALLADO AQUÍ EN MARKDOWN. Usa títulos, negritas y bloques de cita.",
                "improvements": ["Mejora detallada 1...", "Mejora detallada 2...", "Mejora detallada 3...", "Mejora detallada 4...", "Mejora detallada 5..."],
                "expertCopy": "El guion perfecto paso a paso que debió seguirse."
            }`;

            const text = await openaiFetch([
                { role: "system", content: systemMsg },
                { role: "user", content: `Evalúa este chat para el producto "${productName}":\n\n${userMessage}` }
            ]);

            let cleanText = text.trim();
            const jsonStart = cleanText.indexOf('{');
            const jsonEnd = cleanText.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
            }

            const evaluation = JSON.parse(cleanText);
            return NextResponse.json({ success: true, evaluation });
        }

        return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });

    } catch (error: any) {
        console.error("WhatsApp Closer API (OpenAI) Error:", error);
        return NextResponse.json({ error: error.message || "Error interno procesando la solicitud" }, { status: 500 });
    }
}
