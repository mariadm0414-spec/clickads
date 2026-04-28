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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `Eres un Experto Senior en Políticas de Publicidad de Meta (Facebook/Instagram) y TikTok con 8 años de experiencia en Trust & Safety.

Analiza esta imagen publicitaria buscando infracciones de normas comunitarias y publicitarias. Sé estricto, paranoico y preventivo.

Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown) con esta estructura:

{
  "scoreSeguridad": 85, // 0-39: ROJO, 40-79: AMARILLO, 80-100: VERDE
  "estado": "VERDE", // "VERDE" (Seguro), "AMARILLO" (Riesgo Moderado), "ROJO" (Peligro Alto)
  "veredicto": "Título corto del veredicto (ej: Aprobado con advertencias)",
  "riesgosDetectados": ["Promesa de ingresos exagerada", "Uso de 'Tú' excesivo (Atributos personales)"],
  "analisisProfundo": {
    "promesasIngresos": { "estado": "OK", "comentario": "¿Promete dinero fácil o resultados irreales?" },
    "saludAntesDespues": { "estado": "RIESGO", "comentario": "¿Muestra cuerpos, piel con zoom o comparativas prohibidas?" },
    "contenidoSexual": { "estado": "OK", "comentario": "¿Hay desnudez sugerida, poses provocativas o escotes excesivos?" },
    "atributosPersonales": { "estado": "OK", "comentario": "¿Se enfoca en características del usuario (edad, raza, religión, discapacidad) o usa mucho la palabra 'Tú' de forma acusatoria?" },
    "lenguajeSensacionalista": { "estado": "WARNING", "comentario": "¿Usa mayúsculas excesivas, clickbait o afirma cosas imposibles?" }
  },
  "porQuePodriasSerBaneado": "Explicación detallada y pedagógica de por qué el algoritmo podría marcar esto.",
  "comoCorregirlo": [
    "Acción concreta 1 (ej: Elimina la frase 'Gana $500 hoy')",
    "Acción concreta 2 (ej: Aleja el zoom de la parte del cuerpo mostrada)"
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
        console.error("ERROR EN POLICY CHECK:", error);
        return NextResponse.json(
            { error: error.message || "Error al procesar el análisis de políticas" },
            { status: 500 }
        );
    }
}
