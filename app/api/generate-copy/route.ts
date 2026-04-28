import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productoDescripcion, angulo, tono, plataforma, avatar } = body;

    if (!productoDescripcion) {
      return NextResponse.json(
        { error: "Se requiere descripción del producto" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const avatarInfo = avatar
      ? `Cliente ideal: ${avatar.name || "No especificado"}, ${avatar.mainPain || ""}, ${avatar.mainDesire || ""}`
      : "Cliente ideal: No especificado";

    const prompt = `Eres un copywriter experto en publicidad digital para redes sociales. Genera copy publicitario en ESPAÑOL para:

Producto: ${productoDescripcion}
Ángulo de venta: ${angulo || "Beneficio principal"}
Tono: ${tono || "Profesional"}
Plataforma: ${plataforma || "General"}
${avatarInfo}

Genera 5 variaciones usando estos frameworks: PAS, AIDA, BAB, FAB, 4Ps.

IMPORTANTE: Cada variación debe ser única y usar el framework correspondiente correctamente.

Responde ÚNICAMENTE con JSON válido, sin markdown, sin backticks:

{
  "variations": [
    {
      "framework": "PAS",
      "framework_name": "Problem-Agitate-Solve",
      "headline": "máximo 40 caracteres",
      "primary_text": "texto del anuncio máximo 125 caracteres",
      "description": "máximo 30 caracteres",
      "cta": "texto del botón",
      "overlay_headline": "máximo 8 palabras para poner sobre la imagen",
      "overlay_subheadline": "máximo 12 palabras",
      "overlay_cta": "máximo 4 palabras",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    },
    {
      "framework": "AIDA",
      "framework_name": "Attention-Interest-Desire-Action",
      "headline": "máximo 40 caracteres",
      "primary_text": "texto del anuncio máximo 125 caracteres",
      "description": "máximo 30 caracteres",
      "cta": "texto del botón",
      "overlay_headline": "máximo 8 palabras",
      "overlay_subheadline": "máximo 12 palabras",
      "overlay_cta": "máximo 4 palabras",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    },
    {
      "framework": "BAB",
      "framework_name": "Before-After-Bridge",
      "headline": "máximo 40 caracteres",
      "primary_text": "texto del anuncio máximo 125 caracteres",
      "description": "máximo 30 caracteres",
      "cta": "texto del botón",
      "overlay_headline": "máximo 8 palabras",
      "overlay_subheadline": "máximo 12 palabras",
      "overlay_cta": "máximo 4 palabras",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    },
    {
      "framework": "FAB",
      "framework_name": "Features-Advantages-Benefits",
      "headline": "máximo 40 caracteres",
      "primary_text": "texto del anuncio máximo 125 caracteres",
      "description": "máximo 30 caracteres",
      "cta": "texto del botón",
      "overlay_headline": "máximo 8 palabras",
      "overlay_subheadline": "máximo 12 palabras",
      "overlay_cta": "máximo 4 palabras",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    },
    {
      "framework": "4Ps",
      "framework_name": "Picture-Promise-Prove-Push",
      "headline": "máximo 40 caracteres",
      "primary_text": "texto del anuncio máximo 125 caracteres",
      "description": "máximo 30 caracteres",
      "cta": "texto del botón",
      "overlay_headline": "máximo 8 palabras",
      "overlay_subheadline": "máximo 12 palabras",
      "overlay_cta": "máximo 4 palabras",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean response
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const data = JSON.parse(text);

    return NextResponse.json({
      success: true,
      variations: data.variations,
    });
  } catch (error: any) {
    console.error("Error generating copy:", error);
    return NextResponse.json(
      {
        error: "Error al generar copy",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
