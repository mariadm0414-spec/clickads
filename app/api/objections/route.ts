import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { description } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Eres un Psicólogo de Ventas y Closer de Alto Nivel (tipo Alex Hormozi o Jordan Belfort).
Analiza este producto/oferta y detecta las 7 objeciones más probables que impedirán la compra.

Producto/Oferta: "${description}"

Para cada objeción, escribe un "Script de Respuesta" (Rebatimiento) que el usuario pueda copiar y pegar en su Landing Page o Anuncio para neutralizar el miedo antes de que aparezca.
El tono debe ser empático pero autoritario y lógico.

Devuelve UNICAMENTE un JSON válido con esta estructura:
{
  "objeciones": [
    {
      "tipo": "Precio / Valor",
      "duda": "¿Por qué cuesta tanto? / No tengo dinero ahora",
      "script": "Script exacto para matar esta objeción..."
    },
    {
      "tipo": "Confianza / Credibilidad",
      "duda": "¿Y si es una estafa? / ¿Funcionará para mí?",
      "script": "Script exacto..."
    },
    // ... hasta 7 objeciones
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
        console.error("Error en Objections API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
