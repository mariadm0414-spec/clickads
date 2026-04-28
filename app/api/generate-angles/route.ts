import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log("=== GENERATE ANGLES API STARTED ===");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("🚨 ERROR: No se encontró GEMINI_API_KEY");
      return NextResponse.json(
        { error: "Configuración de API incompleta" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { productoDescripcion, avatar } = body;

    if (!productoDescripcion) {
      return NextResponse.json(
        { error: "Se requiere descripción del producto" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const avatarInfo = avatar
      ? `CLIENTE IDEAL (AVATAR):
- Nombre: ${avatar.name || "No especificado"}
- Dolor principal: ${avatar.mainPain || "No especificado"}
- Deseo principal: ${avatar.mainDesire || "No especificado"}
- Objeciones: ${avatar.objection1 || "No especificado"}`
      : "CLIENTE IDEAL: No especificado (usa un perfil general de comprador interesado)";

    const prompt = `
            Actúa como un Copywriter Senior experto en Respuesta Directa. 
            Genera 8 ángulos de venta psicológicos para el producto: "${productoDescripcion}".
            ${avatarInfo}

            Devuelve ÚNICAMENTE un objeto JSON con esta estructura:
            {
              "angles": [
                {
                  "nombre": "string",
                  "tipo": "Dolor | Deseo | Urgencia | Estatus | Miedo | Curiosidad | Prueba Social | Autoridad",
                  "hook": "string",
                  "descripcion": "string",
                  "ejemplo_headline": "string",
                  "ejemplo_copy": "string",
                  "plataforma_ideal": "string",
                  "score_potencial": number
                }
              ]
            }
            IMPORTANTE: Toda tu respuesta (campos 'nombre', 'hook', 'descripcion', etc.) DEBE estar en ESPAÑOL de Latinoamérica. 
            No uses términos en inglés. Solo devuelve el JSON, sin bloques de código ni texto adicional.
        `;

    console.log("🚀 Enviando petición a Gemini 2.0 Flash...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Limpieza agresiva de JSON
    if (text.includes("```")) {
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    // Si hay texto antes o después del JSON, intentar extraerlo
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json({
        success: true,
        angles: data.angles || [],
      });
    } catch (parseError) {
      console.error("🚨 JSON PARSE ERROR:", parseError, "Text:", text);
      return NextResponse.json(
        { error: "Error de formato en la respuesta de IA", details: text.substring(0, 100) },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("🚨 ERROR CRÍTICO EN GENERATE ANGLES:", error);
    return NextResponse.json(
      {
        error: "Error interno al generar ángulos",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
