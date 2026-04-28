import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { product, audience, historico } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key no configurada");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const prompt = `Eres un experto en copywriting de performance para Meta Ads (Facebook/Instagram) y en Machine Learning semántico. Conoces a fondo cómo el algoritmo de Meta escanea el texto de los anuncios para distribuirlos a la audiencia correcta.

Producto/Servicio: "${product}"
Público objetivo deseado: "${audience}"

Tu tarea: Genera EXACTAMENTE 5 variaciones de copy para anuncios en Meta Ads, cada una siguiendo un ángulo psicológico distinto. Cada copy debe tener entre 4 y 7 oraciones, ser persuasivo, natural y contener palabras clave semánticas integradas estratégicamente para entrenar al algoritmo.

${historico && historico.length > 0 ? `REGLA DE ORO (ESTRICTA): NO REPITAS BAJO NINGUNA CIRCUNSTANCIA ninguno de los siguientes textos/ideas que ya han sido generados y guardados en el pasado:\n\n${historico.map((h: string) => `- "${h.substring(0, 150)}..."`).join('\n')}\n\nDebes generar nuevas variaciones conceptuales y de redacción que difieran de estas.` : ""}

Los 5 ángulos son:

1. ÁNGULO DE EMPATÍA (DOLOR): Conecta directamente con el dolor o problema actual del usuario. Muestra que entiendes su situación antes de mencionar el producto.

2. ÁNGULO DE AUTORIDAD (LÓGICO): Explica técnica y lógicamente por qué el producto es la solución definitiva. Usa datos, mecanismos o razonamiento científico/experto.

3. ÁNGULO DE SEÑALES SEMÁNTICAS (ANDROMEDA): Este copy está estratégicamente cargado de palabras clave y frases semánticas invisibles para el ojo humano pero potentes para que el algoritmo de Meta identifique y encuentre a la audiencia perfecta. Cada palabra es una señal de segmentación.

4. ÁNGULO DE CURIOSIDAD (CTR): Texto corto, disruptivo y misterioso. Diseñado para detener el scroll y generar clics inmediatos. Debe crear una brecha de curiosidad irresistible. Máximo 3-4 oraciones muy impactantes.

5. ÁNGULO DE PRUEBA SOCIAL / ESTILO DE VIDA: Muestra el beneficio final y la transformación después de usar el producto. Usa prueba social implícita o explícita y pinta el estilo de vida deseado.

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin texto adicional fuera del JSON):
{
  "variaciones": [
    {
      "angulo": "Empatía (Dolor)",
      "icono": "heart",
      "color": "rose",
      "descripcion": "Conecta con el dolor actual del usuario",
      "copyTexto": "El texto completo del copy aquí..."
    },
    {
      "angulo": "Autoridad (Lógico)",
      "icono": "shield",
      "color": "blue",
      "descripcion": "Explica técnicamente por qué es la solución definitiva",
      "copyTexto": "El texto completo del copy aquí..."
    },
    {
      "angulo": "Señales Semánticas (Andromeda)",
      "icono": "cpu",
      "color": "primary",
      "descripcion": "Cargado de keywords invisibles para el algoritmo de Meta",
      "copyTexto": "El texto completo del copy aquí..."
    },
    {
      "angulo": "Curiosidad (CTR)",
      "icono": "zap",
      "color": "yellow",
      "descripcion": "Texto disruptivo para detener el scroll y generar clics",
      "copyTexto": "El texto completo del copy aquí..."
    },
    {
      "angulo": "Prueba Social / Estilo de Vida",
      "icono": "star",
      "color": "green",
      "descripcion": "Muestra la transformación y el beneficio final",
      "copyTexto": "El texto completo del copy aquí..."
    }
  ],
  "keywordsUsadas": [
    { "keyword": "palabra clave 1", "razon": "Por qué esta keyword entrena al algoritmo" },
    { "keyword": "palabra clave 2", "razon": "..." },
    { "keyword": "palabra clave 3", "razon": "..." },
    { "keyword": "palabra clave 4", "razon": "..." },
    { "keyword": "palabra clave 5", "razon": "..." }
  ],
  "segmentacionComplementaria": [
    { "interes": "Nombre del interés en Meta", "porque": "Por qué complementa el copy" },
    { "interes": "...", "porque": "..." },
    { "interes": "...", "porque": "..." }
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
    console.error("Error en Algo Copy:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
