import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { ctr, cpc, cpa, roas } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `Eres un Media Buyer Senior con 10 años de experiencia gestionando cuentas de $1M+/mes en Meta Ads y TikTok Ads.

Un cliente te comparte estas métricas de su campaña activa:
- CTR (Click Through Rate): ${ctr}%
- CPC (Costo por Clic): $${cpc}
- CPA (Costo por Adquisición): $${cpa}
- ROAS (Retorno sobre Inversión Publicitaria): ${roas}x

Analiza la relación entre estos números como un experto. Usa estos benchmarks como referencia:
- CTR saludable: >1.5% (Meta), >0.5% (TikTok). Bajo = problema creativo.
- CPC alto + CTR bajo = anuncio débil, cambiar creativo.
- CTR alto + ROAS bajo = la web/landing falla, el problema está después del clic.
- CPA > margen = apagar campaña inmediatamente.
- ROAS < 1.5x = estás perdiendo dinero activamente.
- ROAS 1.5x–2.5x = punto de equilibrio, optimizar urgente.
- ROAS > 3x = campaña sana, escalar.

Devuelve ÚNICAMENTE JSON válido con esta estructura:
{
  "nivelAlerta": "VERDE" | "AMARILLO" | "ROJO",
  "diagnostico": "Explicación clara en lenguaje sencillo de qué está pasando en la campaña (2-3 oraciones).",
  "causaRaiz": "Dónde está el problema real: el anuncio, la audiencia o la landing page.",
  "planAccion": [
    "Paso concreto 1 para mejorar HOY (ej: Probar 3 creativos nuevos con ganchos distintos)",
    "Paso concreto 2 (ej: Revisar velocidad de la landing page en mobile)",
    "Paso concreto 3 (ej: Activar regla automática: pausar si ROAS < 1.5 en 48h)"
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
        console.error("Error en Metrics Translator:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
