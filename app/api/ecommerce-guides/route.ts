import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Strip control characters (newlines, tabs, carriage returns) that break JSON prompts
        const sanitize = (s: string) =>
            String(s).replace(/[\r\n\t]/g, " ").replace(/\s{2,}/g, " ").trim();

        const product = sanitize(body.product || "");
        const problem = sanitize(body.problem || "");
        const storeName = sanitize(body.storeName || "");

        if (!product || !problem || !storeName) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `Eres un experto en marketing de contenidos y ecommerce. Tu misión es crear una guía de valor (lead magnet) corta, práctica y persuasiva para ayudar a vender un producto físico.

DATOS:
- Producto: "${product}"
- Problema que resuelve: "${problem}"
- Tienda: "${storeName}"

Genera la guía en ESPAÑOL con el siguiente formato JSON exacto. NO incluyas texto fuera del JSON:

{
  "guideTitle": "Título atractivo de la guía (máx 10 palabras, que prometa una transformación)",
  "coverTagline": "Una frase de impacto de máx 12 palabras que va debajo del título en la portada",
  "whyNeedIt": {
    "headline": "Por qué necesitas esto (título de sección impactante, máx 8 palabras)",
    "body": "3-4 párrafos cortos (700-900 caracteres total) describiendo el dolor del cliente y por qué el producto es la solución. Lenguaje directo y empático."
  },
  "tips": [
    {
      "number": 1,
      "title": "Título del consejo/hack (máx 8 palabras)",
      "body": "Explicación práctica y específica del consejo (200-280 caracteres). Incluye un ejemplo real."
    },
    {
      "number": 2,
      "title": "Título del consejo/hack (máx 8 palabras)",
      "body": "Explicación práctica y específica (200-280 caracteres). Incluye un ejemplo real."
    },
    {
      "number": 3,
      "title": "Título del consejo/hack (máx 8 palabras)",
      "body": "Explicación práctica y específica (200-280 caracteres). Incluye un ejemplo real."
    },
    {
      "number": 4,
      "title": "Título del consejo/hack (máx 8 palabras)",
      "body": "Explicación práctica y específica (200-280 caracteres). Incluye un ejemplo real."
    },
    {
      "number": 5,
      "title": "Título del consejo/hack (máx 8 palabras)",
      "body": "Explicación práctica y específica (200-280 caracteres). Incluye un ejemplo real."
    }
  ],
  "cta": {
    "headline": "Frase de cierre poderosa (máx 10 palabras, urgencia o beneficio claro)",
    "body": "2-3 oraciones persuasivas que inviten a comprar ahora. Menciona la tienda '${storeName}'. (300-400 caracteres)",
    "buttonText": "Texto del botón CTA (máx 5 palabras, ej: Consíguelo Ahora en ${storeName})",
    "url": "https://www.${storeName.toLowerCase().replace(/\\s+/g, '')}.com"
  }
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const guide = JSON.parse(text);
        return NextResponse.json({ guide });

    } catch (error: any) {
        console.error("Error en Ecommerce Guides:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
