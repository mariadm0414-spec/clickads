import { NextResponse } from "next/server";
import OpenAI from "openai";

// 1. PROTECCIÓN PARA VERCEL
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        // 2. LA CORRECCIÓN MÁGICA:
        // Inicializamos OpenAI AQUÍ ADENTRO, no afuera.
        // El "|| ''" evita que rompa si Vercel revisa las variables durante el build.
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || "",
        });

        const body = await request.json();
        const { productDescription, targetAudience, problem, objective, visualStyle, variations } = body;

        const systemPrompt = `
            Eres un Director Creativo de clase mundial experto en E-commerce y Publicidad de Alto Nivel.
            
            TU MISIÓN:
            Generar ${variations || 3} variaciones de creativos publicitarios (Hook, Copy, Image Prompts).

            REGLAS ESTRICTAS DE ESTILO VISUAL (Para 'imagePrompt'):
            1. ESTILO OBLIGATORIO: "High-End Product Photography" (Fotografía de Producto de Alta Gama).
            2. REALISMO: Debe parecer una foto real de estudio, 8k, cinegética. Indistinguible de la realidad.
            3. PROHIBIDO (Negative Prompt): "3D render, cartoon, illustration, drawing, painting, fake, low res, blurry".
            4. Si el producto es un ZAPATO (Shoe/Sneaker):
               - Mantén SIEMPRE la estructura: "Honey colored leather (color miel), White sole (suela blanca)".
               - Enfócate en texturas de cuero real, costuras detalladas e iluminación de estudio.
            5. El fondo debe ser adaptable según lo que pida el usuario en 'visualStyle', pero siempre realista.

            INPUT DEL USUARIO:
            - Producto: ${productDescription}
            - Público: ${targetAudience}
            - Problema: ${problem}
            - Objetivo: ${objective}
            - Estilo de Fondo/Vibe: ${visualStyle}

            FORMATO DE RESPUESTA (JSON PURO):
            {
              "variations": [
                {
                  "hook": "Frase corta y potente (3-5 palabras)",
                  "copy": "Texto persuasivo para el anuncio (Facebook/Instagram style)",
                  "imagePrompt": "Prompt técnico en INGLES para generar la imagen realista. Ej: 'Professional product photography of a [Product], [Context], cinematic lighting, 8k...'"
                }
              ]
            }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Ojo: Asegúrate de tener acceso a gpt-4o, si no usa gpt-3.5-turbo o gpt-4
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Genera los creativos ahora." }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const result = completion.choices[0].message.content;

        if (!result) throw new Error("No response from OpenAI");

        const json = JSON.parse(result);
        return NextResponse.json(json);

    } catch (error: any) {
        console.error("ERROR GENERATE API:", error);
        return NextResponse.json(
            { variations: [], error: "Error generando creativos con IA: " + error.message },
            { status: 500 }
        );
    }
}
