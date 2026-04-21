import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

// Llave maestra de respaldo por si el usuario no configura la suya
const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productName, targetAudience, userPrompt, language, angle, apiKey } = body;

        // Priorizamos la del usuario, de lo contrario usamos la maestra
        const finalKey = apiKey || MASTER_KEY;

        // Inicialización con el nuevo SDK @google/genai
        const ai = new GoogleGenAI({ apiKey: finalKey });

        const outputLang = language || "ESPAÑOL";
        const finalProductName = productName || "Producto ClickAds";

        const systemMsg = `Actúa como un experto en Marketing de Respuesta Directa y Anuncios UGC Virales. 
        REGLA CRÍTICA NÚMERO 1: Está TERMINANTEMENTE PROHIBIDO usar placeholders como "[Nombre del Producto]", "[Añadir problema]" o corchetes.
        REGLA CRÍTICA NÚMERO 2: No des explicaciones iniciales ni pidas más detalles. Genera el contenido de inmediato.
        REGLA CRÍTICA NÚMERO 3: Escribe un guion específico y detallado usando la información proporcionada. Si la información es poca, USA TU CONOCIMIENTO para inventar detalles realistas y persuasivos sobre el producto "${finalProductName}".
        REGLA CRÍTICA NÚMERO 4: Todo el contenido (guion y copy) debe estar EXCLUSIVAMENTE EN ESPAÑOL. No uses términos en inglés como "hook", "engagement", o "copywriting" dentro del texto final. Usa un lenguaje natural, persuasivo y cercano al público hispano.
        `;

        const userMsgContent = `
        ${systemMsg}
        
        PROYECTO: "${finalProductName}"
        PÚBLICO OBJETIVO: "${targetAudience || 'Personas interesadas en este tipo de soluciones'}"
        ÁNGULO: "${angle || 'Natural/Testimonio'}"
        INSTRUCCIONES DEL USUARIO: "${userPrompt || 'Sin instrucciones adicionales'}"
        IDIOMA: ${outputLang}

        GENERA UN GUION COMPLETO PARA VIDEO (Hook, Problema, Solución, Beneficios, CTA) Y UN COPY PARA REDES SOCIALES.
        Menciona siempre el producto por su nombre: "${finalProductName}".
        `;

        // Generación de contenido usando el nuevo SDK
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: [{ role: "user", parts: [{ text: userMsgContent }] }]
        });

        // En el nuevo SDK la respuesta está en response.text
        const text = response.text || "No se pudo generar el guion.";

        return NextResponse.json({ success: true, copy: text });

    } catch (error: any) {
        console.error("Critical UGC Generation Error (genai SDK):", error);
        return NextResponse.json({ error: error.message || "Error interno procesando el guion." }, { status: 500 });
    }
}
