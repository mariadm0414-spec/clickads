import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2-minute timeout for long ebook generation

export async function POST(req: Request) {
    try {
        const { title, author, problem, tone } = await req.json();

        if (!title || !author || !problem || !tone) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY no configurada");

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use 2.0 Flash — confirmed working model for this project's API key
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const toneInstructions: Record<string, string> = {
            "Científico": "Usa un tono académico y científico. Cita principios, estudios y marcos teóricos. Usa vocabulario técnico preciso y fundamenta cada afirmación en evidencia o lógica estructurada.",
            "Storytelling": "Usa un tono narrativo y emocional. Cada capítulo debe comenzar con una historia o anécdota real y conectar los conceptos a través de una narrativa continua que envuelve al lector.",
            "Vendedor Agresivo": "Usa un tono persuasivo, urgente y directo al estilo de los mejores copywriters del mundo. Usa técnicas de storytelling de ventas, prueba social implícita, urgencia y beneficios tangibles. Habla directamente al lector como si lo estuvieras cerrando en una venta de alto valor.",
            "Educativo": "Usa un tono didáctico, claro y progresivo. Explica conceptos de lo simple a lo complejo. Usa ejemplos cotidianos, analogías fáciles de entender y ejercicios prácticos al final de cada sección.",
        };

        const toneGuide = toneInstructions[tone] || toneInstructions["Educativo"];

        const prompt = `Actúa como un Ghostwriter de Best Sellers reconocido internacionalmente. Has escrito libros que han vendido más de 100,000 copias en Amazon.

Tu misión: Genera un Ebook técnico y práctico en ESPAÑOL de aproximadamente 5,000 palabras sobre el siguiente tema.

DATOS DEL EBOOK:
- Título: "${title}"
- Autor: ${author}
- Problema central que resuelve: ${problem}
- Tono de escritura: ${tone}

INSTRUCCIONES DE TONO:
${toneGuide}

ESTRUCTURA OBLIGATORIA (usa exactamente estos encabezados Markdown con H1 para crear saltos de página):

# PORTADA
Título del libro en grande, nombre del autor, una frase de impacto de 1 línea que resume el problema que resuelve.

# ÍNDICE
Lista numerada de todos los capítulos con una descripción de 1 línea de cada uno.

# INTRODUCCIÓN: EL PROBLEMA QUE NADIE TE HA EXPLICADO
Introducción profunda de 500-700 palabras. Describe el dolor del lector, por qué los recursos actuales fallan, y qué aprenderán específicamente en este libro.

# CAPÍTULO 1: [Título impactante relacionado con el problema]
## Subtema A
Contenido extenso (400-600 palabras)...
## Ejercicio Práctico
Ejercicio específico y accionable.

# CAPÍTULO 2: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CAPÍTULO 3: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CAPÍTULO 4: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CAPÍTULO 5: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CAPÍTULO 6: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CAPÍTULO 7: [Título impactante]
## Subtema A
...
## Ejercicio Práctico
...

# CONCLUSIÓN Y PRÓXIMOS PASOS
Cierre poderoso de 400-500 palabras. Resume las lecciones clave, da un plan de acción de 30 días y termina con una llamada a la acción inspiradora.

REGLAS CRÍTICAS:
- Escribe TODO el contenido en ESPAÑOL.
- Cada capítulo debe tener mínimo 400 palabras de contenido real y útil.
- NO uses texto placeholder. TODO debe ser contenido real y valioso.
- Usa formato Markdown correcto: H1 con #, H2 con ##, listas con -, negritas con ** **.
- El total del ebook debe superar las 4,500 palabras.`;

        const result = await model.generateContent(prompt);
        const markdown = result.response.text();

        return NextResponse.json({ markdown });

    } catch (error: any) {
        console.error("Error en Ebook Factory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
