import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { businessType, objective, currency, metrics } = payload;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key no configurada");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const metricsList = Object.entries(metrics).map(([k, v]) => `- ${k.toUpperCase()}: ${v}`).join("\n");

    const prompt = `Eres el Media Buyer Senior de una agencia de publicidad que gestiona $2M/mes en Meta Ads. Tu trabajo es diagnosticar campañas como un médico: con precisión quirúrgica.

DATOS DEL NEGOCIO:
- Tipo de Negocio/Nicho: ${businessType}
- Objetivo de esta campaña: ${objective}
- Moneda Base: ${currency}

El cliente te comparte estas métricas de su campaña activa:
${metricsList}

Benchmarks clave para tu diagnóstico (ajustados dinámicamente según el rubro ${businessType} y objetivo ${objective}):
- CTR < 1%: Anuncio débil. CTR > 3%: Excelente gancho.
- Frecuencia > 2.5 disminuyendo el rendimiento = Saturación de audiencia (fatiga creativa).
- CTR alto + pocas visitas a landing = Lentitud de la web o error de pixel.
- CPM alto + CTR bajo = Audiencia muy competida o creative score bajo.
- En Ventas: ROAS < 1.5 = Pérdida. ROAS > 3 = Escalar. Costo por Compra (CPA) alto vs Ticket Promedio bajo = Embudo roto.
- En Leads: CPL muy alto para la industria = Gancho ineficaz o fricción en el formulario.
- En Mensajes: Costo por mensaje (CPMessage) inflado = Oferta poco atractiva o targeting equivocado.

Cruza TODAS las métricas entre sí para dar el diagnóstico más inteligente posible adaptado a su nicho.

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "veredicto": "ESCALAR" | "OPTIMIZAR" | "DETENER",
  "titulo": "Título corto del diagnóstico (ej: Fatiga Creativa Detectada)",
  "resumenEjecutivo": "1-2 oraciones que resumen el estado de la campaña en lenguaje claro.",
  "hallazgosCriticos": [
    { "metrica": "Nombre de la métrica problemática", "problema": "Qué está mal y por qué importa" }
  ],
  "planAccion": [
    "Paso 1 exacto para el Ads Manager (ej: Duplica el ad set activo y cambia el creativo principal por uno con gancho de historia personal)",
    "Paso 2 exacto (ej: Activa regla automática para pausar ads con frecuencia > 3 en 48h)",
    "Paso 3 exacto (ej: Instala Microsoft Clarity para detectar drop-off en la landing page)"
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
    console.error("Error en Ad Doctor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
