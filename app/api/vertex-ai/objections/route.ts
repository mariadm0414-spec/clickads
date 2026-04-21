import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

// Llave maestra de respaldo por si el usuario no configura la suya
const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productName, objections, apiKey } = body;

        // Priorizamos la del usuario, de lo contrario usamos la maestra
        const finalKey = apiKey || MASTER_KEY;

        const genAI = new GoogleGenerativeAI(finalKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Actualizado a 2.0
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

        const systemMsg = `Actúa como un experto en Neuro-Marketing y Manejo de Objeciones de Clase Mundial. 
        Tu misión es DESTRUIR las dudas del cliente sobre el producto "${productName || 'este producto'}".
        
        REGLA 1: No des explicaciones teóricas. Proporciona respuestas directas, audaces y altamente persuasivas que el usuario pueda copiar y pegar en su Landing Page, Anuncios o Guiones de Venta.
        REGLA 2: Usa un tono de autoridad pero empático.
        REGLA 3: Si el usuario no proporciona objeciones específicas, GENERA LAS 5 OBJECIONES MÁS COMUNES para el tipo de producto proporcionado y destrúyelas sistemáticamente.
        REGLA 4: Todo el contenido debe estar en ESPAÑOL.
        REGLA 5: No uses placeholders ni corchetes.
        `;

        const userMsg = `
        PRODUCTO: "${productName || 'Producto ClickAds'}"
        OBJECIONES A DESTRUIR: "${objections || 'Genera las objeciones típicas de este nicho'}"
        
        Genera una lista de objeciones y una respuesta "Demoledora" para cada una. Termina con una conclusión que incite a la compra inmediata.
        `;

        const result = await model.generateContent([systemMsg, userMsg]);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ success: true, result: text });

    } catch (error: any) {
        console.error("Objections API Error:", error);
        return NextResponse.json({ error: error.message || "Error interno procesando las objeciones." }, { status: 500 });
    }
}
