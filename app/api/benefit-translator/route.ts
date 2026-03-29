import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { features } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Eres un Copywriter Experto en Psicología de Ventas y Neuroventas.
Tu objetivo es traducir características aburridas de un producto en beneficios emocionales viscerales.

Producto/Características: "${features}"

Analiza esto y genera 3 ángulos de venta distintos en formato JSON:

1. "placer": Enfocado en el deseo, estatus y satisfacción (Aspiracional). Usa emojis.
2. "dolor": Enfocado en eliminar frustraciones, miedos y problemas (Alivio). Usa emojis.
3. "transformacion": Una frase poderosa que resuma el cambio de identidad del cliente (Del "Antes" al "Después").

Devuelve JSON puro con esta estructura exacta:
{
  "placer": {
    "titulo": "Título Gancho de Placer",
    "puntos": ["Beneficio emocional 1", "Beneficio emocional 2", "Beneficio emocional 3"]
  },
  "dolor": {
    "titulo": "Título Gancho de Dolor",
    "puntos": ["Problema eliminado 1", "Problema eliminado 2", "Problema eliminado 3"]
  },
  "transformacion": "Frase de transformación impactante"
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        // Limpieza básica por si el modelo incluye texto extra fuera del JSON
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error en Benefit Translator:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
