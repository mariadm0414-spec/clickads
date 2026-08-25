import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET() {
    return NextResponse.json({ message: "Research API is reachable" });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, image, apiKey } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI API Key no configurada." }, { status: 400 });
        }

        const systemPrompt = `Actúa como un Analista Experto en eCommerce de Talla Mundial, Especialista en Psicología del Consumidor y Copywriter de Respuesta Directa nivel Eugene Schwartz. 
        Voy a lanzarte un producto y quiero que desarrolles una BIBLIA de Investigación de Producto y Análisis de Mercado absolutamente colosal, detallada, quirúrgica y de un valor incalculable. 
        Desglosa cada punto con un nivel de detalle exhaustivo. Usa formato Markdown, negritas y viñetas dentro del texto para crear un formato altamente profesional y fácil de leer. Nada de respuestas genéricas: entra a la mente del consumidor y dame las estrategias, motivaciones ocultas y ángulos más agresivos.
        
        PRODUCTO Y CONTEXTO:
        Nombre del producto: "${name}"
        Descripción del usuario: "${description || 'No proporcionada'}"
        
        TAREA Y FORMATO DE SALIDA (MUY IMPORTANTE):
        Debes completar esta Masterclass devolviendo un objeto JSON estricto con exactamente 30 claves (enumera los campos como strings desde "1" hasta "30"). 
        - Cada uno de los 30 campos debe contener una respuesta EXTENSA (2 o 3 párrafos potentes o listas en markdown).
        - Al devolver el JSON, ASEGÚRATE de escapar correctamente comillas internas y usar saltos de línea codificados (\\n\\n) dentro del texto de cada string para no romper el formato JSON. No incluyas comentarios fuera del JSON.
        - Todo en Español Neutro y Profesional.
        
        NO agregues introducciones, SÓLO devuelve el JSON con estas 30 claves literales:
        1 al 30 conforme a la estructura de investigación eCommerce.`;

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Genera la investigación completa para: ${name}. Descripción: ${description}` }
        ];

        if (image) {
            // OpenAI support for images in gpt-4o
            const data = image.includes(",") ? image.split(",")[1] : image;
            messages[1].content = [
                { type: "text", text: `Analiza este producto: ${name}. Descripción: ${description}. Genera el JSON de 30 puntos.` },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${data}` } }
            ];
        }

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: messages,
                response_format: { type: "json_object" }
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const finalJson = JSON.parse(data.choices[0].message.content);

        const resultsArray = [];
        for (let i = 1; i <= 30; i++) {
            resultsArray.push(finalJson[String(i)] || finalJson[i] || "Información no disponible.");
        }

        return NextResponse.json({ success: true, results: resultsArray });

    } catch (error: any) {
        console.error("Research API (OpenAI) Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
