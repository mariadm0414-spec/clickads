import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        const base64Data = image.includes(",") ? image.split(",")[1] : image;
        const mimeType = image.includes(";") ? image.split(";")[0].split(":")[1] : "image/jpeg";

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key de Gemini no configurada (GEMINI_API_KEY)");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Eres un Director Creativo Senior y Estratega de Performance Marketing con 10 años de experiencia en Meta Ads y TikTok Ads.

Analiza esta imagen publicitaria y devuelve ÚNICAMENTE un objeto JSON válido (sin texto Markdown, sin bloques de código, solo el JSON puro):

{
  "scoreTotal": 85,
  "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "debilidades": ["debilidad 1", "debilidad 2", "debilidad 3"],
  "desglose": {
    "disenoYJerarquia": { "score": 90, "comentario": "análisis de diseño y jerarquía visual" },
    "paletaColores": { "score": 80, "comentario": "análisis de paleta de colores y contraste" },
    "copyYOferta": { "score": 70, "comentario": "análisis del copy, precio y CTA" }
  },
  "scrollStopper": {
    "score": 75,
    "tieneElementoDisruptivo": true,
    "comentario": "¿Atrapa la atención en los primeros 3 segundos? Describe qué elemento visual lo logra o por qué falla."
  },
  "anguloDeVenta": {
    "emocionPrincipal": "Urgencia",
    "descripcion": "Describe qué emoción o motivación psicológica está atacando el anuncio (Urgencia, Estatus, FOMO, Solución a Problema, Aspiración, etc.) y si está bien ejecutada."
  },
  "platformFit": {
    "score": 80,
    "esNativo": true,
    "zonaSegura": "Indica si el texto o elementos clave se tapan con botones de TikTok/Instagram (zona inferior derecha y superior). Veredicto: OK o RIESGO.",
    "comentario": "¿Parece contenido orgánico o un banner publicitario anticuado?"
  },
  "claridadOferta": {
    "score": 85,
    "ctaVisible": true,
    "precioVisible": false,
    "comentario": "¿El beneficio principal es obvio? ¿El CTA y el precio tienen el mayor peso visual después del gancho?"
  },
  "quickWins": [
    "Acción concreta 1 para el diseñador (ej: Aumenta el tamaño del precio un 20%)",
    "Acción concreta 2 (ej: Añade un rostro humano en el primer tercio de la imagen)",
    "Acción concreta 3 (ej: Cambia el fondo blanco por uno oscuro para generar más contraste)"
  ]
}`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType } },
        ]);

        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("ERROR REAL EN SERVIDOR:", error);
        return NextResponse.json(
            { error: error.message || "Error interno desconocido al procesar la IA" },
            { status: 500 }
        );
    }
}
