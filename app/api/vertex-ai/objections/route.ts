import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productName, targetAudience, manualObjections, apiKey } = body;

        const openAIKey = process.env.OPENAI_API_KEY;
        if (!openAIKey) {
            return NextResponse.json({ error: "OpenAI API Key no configurada." }, { status: 400 });
        }

        const systemPrompt = `Actúa como un Maestro de la Persuasión y Negociador de Alto Nivel, experto en Psicología del Consumidor y Ventas de Respuesta Directa (estilo Dan Kennedy, Jordan Belfort y Chris Voss).
        Tu misión es "DESTRUIR" las objeciones que impiden que un cliente compre.
        
        CONTEXTO:
        Producto: "${productName || 'No especificado'}"
        Público Objetivo: "${targetAudience || 'No especificado'}"
        
        TAREA:
        1. Si el usuario proporciona objeciones manuales, destrúyelas quirúrgicamente.
        2. Si no proporciona o son pocas, identifica las objeciones más letales y comunes para este producto/audiencia.
        3. Para cada objeción, proporciona:
           - El "Miedo Oculto": Lo que el cliente realmente está pensando detrás de esa excusa.
           - El "Script Destructor": Una respuesta persuasiva, empática pero firme que elimine la objeción y mueva al cliente al cierre.
           - El "Por qué funciona": Breve explicación de la palanca psicológica activada (ej: Escasez, Reciprocidad, Prueba Social, Reencuadre).
        
        FORMATO DE SALIDA:
        Devuelve un objeto JSON con una clave "objections" que sea un array de objetos:
        {
          "objections": [
            {
              "objection": "Nombre de la objeción",
              "hiddenFear": "Explicación del miedo psicológico",
              "script": "Texto persuasivo",
              "psychology": "Palanca psicológica"
            },
            ... (genera entre 6 y 10 objeciones)
          ]
        }
        
        Todo en Español Neutro y Profesional. Asegúrate de que el JSON sea estricto y esté bien formato. No incluyas nada fuera del JSON.`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: manualObjections ? `Destruye estas objeciones específicas: ${manualObjections}` : `Identifica y destruye las objeciones más comunes para este producto.` }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const finalJson = JSON.parse(data.choices[0].message.content);
        return NextResponse.json({ success: true, objections: finalJson.objections });

    } catch (error: any) {
        console.error("Objections API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
