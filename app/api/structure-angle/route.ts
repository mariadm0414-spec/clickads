import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const { title, type, description, platforms } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Título y descripción son requeridos" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `
            Actúa como un Experto en Marketing de Respuesta Directa y Copywriter de Alto Nivel.
            
            Tu tarea es convertir una idea base de un ángulo de venta en una estructura profesional.
            
            DETALLES DEL ÁNGULO:
            - Título: ${title}
            - Tipo: ${type}
            - Plataformas: ${platforms.join(", ")}
            - Idea Base: ${description}
            
            POR FAVOR, GENERA LA SIGUIENTE ESTRUCTURA EN ESPAÑOL:
            1. Hook (Un gancho irresistible de 1 línea).
            2. Descripción (Explicación del ángulo y por qué funciona psicológicamente, máx 3 líneas).
            3. Ejemplo de Headline (Para el anuncio).
            4. Ejemplo de Copy (Un párrafo persuasivo corto).
            5. Score Potencial (Un número entre 85 y 100 basado en la fuerza de la idea).
            
            RESPONDE EXCLUSIVAMENTE CON ESTE FORMATO JSON:
            {
                "hook": "string",
                "descripcion": "string",
                "ejemplo_headline": "string",
                "ejemplo_copy": "string",
                "score_potencial": number
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean the response if it contains markdown code blocks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const structuredData = JSON.parse(text);

        return NextResponse.json({
            success: true,
            angle: {
                nombre: title,
                tipo: type,
                plataforma_ideal: platforms.join(", "),
                ...structuredData
            }
        });
    } catch (error: any) {
        console.error("Structure Angle Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
