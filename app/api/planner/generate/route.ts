import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { producto, metas, propuestaValor, clienteIdeal, historico } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key no configurada");

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash with higher token limit for 100 ideas
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    }, { apiVersion: "v1" });

    const prompt = `Eres el director creativo de contenido orgánico más brillante de Latinoamérica. Tu especialidad: crear ideas de video para Instagram y TikTok que generan ventas reales sin pauta pagada.

DATOS DEL NEGOCIO:
- Producto/Servicio: "${producto}"
- Metas: "${metas || "No especificadas"}"
- Propuesta de valor: "${propuestaValor || "No especificada"}"
- Cliente ideal: "${clienteIdeal}"

${historico && historico.length > 0 ? `REGLA DE ORO (ESTRICTA): NO REPITAS BAJO NINGUNA CIRCUNSTANCIA ninguno de los siguientes títulos, hooks o ideas que ya han sido guardados en el historial del usuario:\n\n${historico.map((h: string) => `- "${h}"`).join('\n')}\n` : ""}

Genera EXACTAMENTE 100 ideas de video únicas y completamente distintas entre sí.

DISTRIBUCIÓN:
- 30 Educación, 25 Venta, 25 Entretenimiento, 20 Viralidad

FORMATOS: Reel, Carrusel, Story

Responde ÚNICAMENTE con JSON válido:
{"ideas":[{"numero":1,"titulo":"...","formato":"Reel","objetivo":"Educación","hook":"...","descripcion":"..."},{"numero":2,"titulo":"...","formato":"Carrusel","objetivo":"Venta","hook":"...","descripcion":"..."}]}

IMPORTANTE:
- Revisa que tu JSON sea 100% válido, escapando correctamente las comillas dentro de los textos.
- Evita usar saltos de línea (\n) literales dentro de las strings.
- Genera las 100 ideas. Cada campo debe ser corto pero específico (titulo: máximo 10 palabras, hook: máximo 15 palabras, descripcion: máximo 20 palabras).`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // With application/json, text should be a valid JSON. 
    // Just in case it got truncated due to length, we run the repair.
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    let openBraces = 0;
    let openBrackets = 0;
    let repairedText = "";
    let insideString = false;
    let escape = false;

    // A smarter but simple counter to handle truncation
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (!escape && ch === '"') {
        insideString = !insideString;
      }
      if (!insideString) {
        if (ch === "{") openBraces++;
        if (ch === "}") openBraces--;
        if (ch === "[") openBrackets++;
        if (ch === "]") openBrackets--;
      }
      if (ch === '\\' && !escape) {
        escape = true;
      } else {
        escape = false;
      }
      repairedText += ch;
    }

    if (insideString) {
      repairedText += '"'; // close string
    }

    if (openBraces > 0 || openBrackets > 0) {
      // Remove trailing comma or partial property
      repairedText = repairedText.replace(/,\s*(?:"[^"]*?)?$/, "");
      for (let i = 0; i < openBrackets; i++) repairedText += "]";
      for (let i = 0; i < openBraces; i++) repairedText += "}";
    }

    let data: { ideas: unknown[] };
    try {
      // Clean possible control characters strictly before parse
      const cleanedText = repairedText.replace(/[\u0000-\u001F]+/g, " ");
      data = JSON.parse(cleanedText);
    } catch (parseError: any) {
      console.error("JSON PARSE ERROR:");
      console.error(parseError.message);
      console.error("REPAIRED TEXT PREVIEW:", repairedText.substring(0, 100) + " ... " + repairedText.substring(repairedText.length - 100));
      throw new Error("El modelo generó un contenido inválido. Por favor, intenta de nuevo. (" + parseError.message + ")");
    }

    if (!Array.isArray(data.ideas) || data.ideas.length === 0) {
      throw new Error("No se generaron ideas. Intenta de nuevo con una descripción más detallada.");
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error en 100 Ideas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
