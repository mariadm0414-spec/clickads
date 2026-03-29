import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        console.log("=== GENERATE VIDEO SCRIPTS API STARTED ===");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Configuración de API incompleta" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const {
            duration,
            style,
            productoDescripcion,
            dayWeek,
            milestone,
            quantity = 3,
            knowledgeContext,
            angle // New parameter
        } = body;

        if (!productoDescripcion) {
            return NextResponse.json(
                { error: "Se requiere descripción del producto" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const isSeries = style === "series";
        const isMixed = style === "mixed";

        // Logic for Mixed Style with Specific Angle
        const mixedInstructions = angle
            ? `
            ESTRATEGIA DE ÁNGULO VIRAL ESPECÍFICO: ${angle.toUpperCase().replace('_', ' ')}
            Genera ${quantity} variaciones creativas profundizando EXCLUSIVAMENTE en este ángulo.
            No mezcles otros estilos. Queremos probar 3 formas distintas de ejecutar este mismo gancho/ángulo.
            `
            : `
            ESTRATEGIA MIXTA (OBLIGATORIO VARIAR ÁNGULOS):
            Genera ${quantity} guiones con enfoques RADICALMENTE DIFERENTES:
            - Opción 1: UGC/Testimonial (Historia personal, "probé esto y...").
            - Opción 2: Educativo/Polémico (Derribando mitos del nicho).
            - Opción 3: Oferta Irresistible (Directo al grano, urgencia).
            `;

        const prompt = `
            Actúa como un Guionista de Viralidad experto en retención y tendencias de redes sociales (TikTok, Reels, Shorts). 
            Tu objetivo es generar ${quantity} opciones de guiones de ALTA RETENCIÓN enfocados exclusivamente en la LOCUCIÓN.

            CONTEXTO ESTRATÉGICO (BASE DE CONOCIMIENTO):
            ${knowledgeContext || "No hay contexto extra."}

            DATOS DEL PROYECTO:
            - PRODUCTO: "${productoDescripcion}"
            - DURACIÓN: ${duration}
            - ESTILO: ${isSeries ? "MÉTODO DE SERIES (Reto viral)" : (isMixed ? `MIXTO ${angle ? `(Foco: ${angle})` : "(Variedad)"}` : style)}
            ${isSeries ? `- DÍA/SEMANA ACTUAL: ${dayWeek}\n- HITO DE HOY: ${milestone}` : ""}

            INSTRUCCIONES DE ESTILO:
            ${isSeries ? `
            METODOLOGÍA "MÉTODO DE SERIES":
            1. Investigar tendencias de retos virales.
            2. Gancho de progreso ("Día X").
            3. Narrativa de jornada (héroe).
            ` : (isMixed ? mixedInstructions : `
            ESTILO SELECCIONADO: ${style}. Mantén este enfoque para todas las opciones pero varía los ganchos.
            `)}

            REGLAS DE ESTILO:
            - Frases cortas de 8 a 12 palabras.
            - Tono vulnerable y motivador.
            - Guion optimizado para ser leído en Teleprompter.
            
            INSTRUCCIONES DE IDIOMA Y FORMATO:
            - TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL DE LATINOAMÉRICA. No uses términos en inglés.
            - NO incluyas [Contenido Visual] ni sugerencias de tomas.
            - Solo el texto que se debe decir (locución).
            - Separa claramente el GANCHO, el CUERPO y el CTA con saltos de línea dobles.
            - Respuesta ÚNICAMENTE en JSON válido.

            {
              "scripts": [
                {
                  "option_number": 1,
                  "title": "${isSeries ? `Idea de Reto Viral: [Nombre del reto]` : "Título del Guion"}",
                  "hook": "Texto del hook",
                  "audio_voiceover": "TEXTO PARA TELEPROMPTER. Separa Gancho, Cuerpo y CTA con \\n\\n para que se vean como bloques independientes.",
                  "duration_estimate": "Tiempo estimado exacto"
                }
              ]
            }
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON cleaning
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        }

        const data = JSON.parse(text);

        return NextResponse.json({
            success: true,
            scripts: data.scripts,
        });

    } catch (error: any) {
        console.error("🚨 ERROR EN GENERATE SCRIPTS:", error);
        return NextResponse.json(
            { error: "Error al generar guiones", details: error.message },
            { status: 500 }
        );
    }
}
