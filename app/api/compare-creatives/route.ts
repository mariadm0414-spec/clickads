import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { analyses } = body;

        if (!analyses || analyses.length < 2) {
            return NextResponse.json(
                { error: "Se requieren al menos 2 análisis para comparar" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key de Gemini no configurada" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `
            Actúa como un Director Creativo Senior experto en Performance Marketing.
            Compara los siguientes dos análisis de creativos publicitarios y determina cuál tiene más probabilidades de éxito en una campaña paga (pauta).

            ANÁLISIS 1:
            Score General: ${analyses[0].overall_score}
            Métricas: ${JSON.stringify(analyses[0].scores)}
            Veredicto: ${analyses[0].veredicto}

            ANÁLISIS 2:
            Score General: ${analyses[1].overall_score}
            Métricas: ${JSON.stringify(analyses[1].scores)}
            Veredicto: ${analyses[1].veredicto}

            TAREA:
            1. Analiza las diferencias clave en los puntajes.
            2. Elige un ganador claro (puede ser por margen mínimo).
            3. Explica el "POR QUÉ" técnico desde una perspectiva de conversión (marketing psicológico, jerarquía visual, stop-rate).
            4. Responde ÚNICA Y EXCLUSIVAMENTE en ESPAÑOL.

            Devuelve un JSON con esta estructura:
            {
                "winner_index": number (0 o 1),
                "winner_reason": "explicación detallada en español",
                "key_differences": ["diferencia 1", "diferencia 2"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean JSON
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const comparison = JSON.parse(text);

        return NextResponse.json({
            success: true,
            comparison
        });

    } catch (error: any) {
        console.error("ERROR COMPARING CREATIVES:", error);
        return NextResponse.json(
            { error: "Error al comparar los creativos", details: error.message },
            { status: 500 }
        );
    }
}
