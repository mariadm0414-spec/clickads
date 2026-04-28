import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { productDescription } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `Eres un Antropólogo de Consumo y Psicólogo de Ventas de clase mundial.
Tu misión es diseccionar el mercado para este producto y encontrar los 5 segmentos de clientes (Avatares) más rentables y específicos.

Producto/Servicio: "${productDescription}"

Para cada Avatar, profundiza en su psique. No des demografías aburridas (ej: "Mujer de 25-40"). Dame identidades psicográficas.

Devuelve UNICAMENTE un objeto JSON válido con esta estructura:
{
  "avatares": [
    {
      "nombre": "Nombre Evocativo (ej: Ana, la Emprendedora Agotada)",
      "miedos": ["Miedo profundo 1", "Miedo profundo 2"],
      "deseos": ["Deseo oculto 1", "Deseo oculto 2"],
      "fraseResonancia": "Una frase corta que, si la lee, sentirá que le leíste la mente."
    },
    // ... total 5 avatares
  ]
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error en Avatar API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
