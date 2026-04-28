import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const formData = await request.formData();
        const files = formData.getAll("images") as File[];

        // Mantener compatibilidad con carga individual si existe
        if (files.length === 0) {
            const singleFile = formData.get("image") as File;
            if (singleFile) files.push(singleFile);
        }

        if (files.length === 0) {
            return NextResponse.json({ error: "Images missing" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const imageParts = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                return {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: file.type
                    }
                };
            })
        );

        const prompt = `
            Actúa como un Ingeniero de Crecimiento y Experto en Marketing de Respuesta Directa. 
            Misión: Realizar un ANALISIS COMPARATIVO PROFUNDO de los creativos proporcionados (${files.length} imágenes).
            
            EXTRACCIÓN DE ADN Y AUDITORÍA:
            1. ADN Ganador: Identifica los patrones visuales, psicológicos y estructurales que se repiten y que hacen que estos creativos funcionen.
            2. Análisis de Similitudes: Compara las ${files.length} imágenes y extrae los puntos en común.
            3. Oportunidades de Mejora: Crítica constructiva profunda. Identifica qué les falta para ser perfectos (ej: legibilidad, contraste del CTA, jerarquía visual, psicología del color).
            4. Súper Creativo (Fusión): Genera un prompt para Imagen 4 que fusione los elementos ganadores de todos, corrigiendo las debilidades halladas.
            5. Calificación: Score 0-100 de escalabilidad potencial.

            REGLAS DE IDIOMA Y FORMATO:
            - TODO EN ESPAÑOL DE LATINOAMÉRICA.
            - Usa párrafos cortos (máx 5 líneas).
            - Usa viñetas (-) para puntos clave.
            - Tono profesional y analítico.

            Devuelve SOLAMENTE JSON:
            {
                "patterns": ["string"],
                "factor_x": "string",
                "scalability_score": number,
                "dna_interpretation": "string (ADN Ganador y Análisis Comparativo con explicaciones claras)",
                "improvement_opportunities": "string (Bloque detallado de oportunidades de mejora y sugerencias tácticas)",
                "imagen4_prompt": "string (Prompt detallado para Imagen 4 que fusione lo mejor del conjunto)",
                "innovative_ideas": [
                    { "concept": "string", "visual_hook": "string", "why_it_works": "string" }
                ]
            }
        `;

        const result = await model.generateContent([
            prompt,
            ...imageParts
        ]);

        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const analysis = JSON.parse(text);

        return NextResponse.json({ success: true, analysis });
    } catch (error: any) {
        console.error("Creative Lab Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
