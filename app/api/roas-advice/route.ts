import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { sellingPrice, productCost, otherExpenses, breakEvenCPA, breakEvenROAS } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `Eres un CFO experto en E-commerce y Dropshipping. Analiza estos unit economics:

- Precio de Venta: $${sellingPrice}
- Costo del Producto: $${productCost}
- Otros Gastos: $${otherExpenses}
- Margen Neto (CPA Breakeven): $${breakEvenCPA}
- ROAS Mínimo para no perder dinero (Breakeven): ${breakEvenROAS}x

Evalúa la viabilidad de escalar este producto con publicidad paga (Meta/TikTok Ads).
Si el margen es menor a $15-$20, advierte que será difícil ser rentable.
Si el ROAS Breakeven es mayor a 2.5x, sugiere subir el precio, crear bundles o reducir costos.

Devuelve un objeto JSON con este formato exacto:
{
  "viabilidad": "ALTA" | "MEDIA" | "BAJA",
  "analisis": "Breve resumen de 1 frase sobre la salud de estos números.",
  "consejos": [
    "Consejo estratégico 1 (ej: Aumentar AOV con bundles)",
    "Consejo estratégico 2 (ej: Negociar costo de producto)",
    "Consejo estratégico 3"
  ]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error en ROAS Advice:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
