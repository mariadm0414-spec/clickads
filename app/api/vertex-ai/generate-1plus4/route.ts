import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, logoBase64, userPrompt, apiKey, specificAngle, count, primaryColor, secondaryColor, font, aspectRatio } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        if (!productBase64) {
            return NextResponse.json({ error: "No se recibió la imagen del producto." }, { status: 400 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);
        const base64Data = productBase64.includes(",") ? productBase64.split(",")[1] : productBase64;
        const mimeType = productBase64.includes("image/png") ? "image/png" : "image/jpeg";

        const logoInstruction = logoBase64 ? " INTEGRATE LOGO: Use the provided secondary image as the brand logo. Position it professionally in a corner or as part of the background. DO NOT write the word 'logo' or any technical labels." : "";
        const brandingContext = ` ${logoInstruction} VISUAL THEME: Use the palette ${primaryColor || "luxury"} and ${secondaryColor || "neutral"} for all graphic elements (buttons, borders, overlays). Use ${font || "modern"} style for typography. 
        CRITICAL RULES for TEXT: 
        1. NEVER write hex codes (e.g., "${primaryColor}"), color names, or font names as visible text. 
        2. All visible text must be in PERFECT SPANISH with no spelling mistakes. 
        3. Only write the specific text requested in the goal, and nothing else. 
        4. If a piece of text is too complex to render clearly, omit it or use a simple icon instead.`;

        const allAdTypes = [
            { id: "TESTIMONIAL", name: "TESTIMONIAL", style: "luxury studio setting with a clean background", goal: "Añadir una frase de testimonio corta en ESPAÑOL (ej: 'Excelente calidad'). Incluir 5 estrellas doradas." },
            { id: "SALES_CTA", name: "SALES_CTA", style: "urban premium lifestyle setting", goal: "Incluir un botón que diga 'COMPRAR AHORA' en ESPAÑOL. Sin más texto innecesario." },
            { id: "BENEFITS", name: "BENEFITS", style: "clean minimalist showroom", goal: "Resaltar 3 iconos con texto corto en ESPAÑOL (ej: 'Resistente', 'Elegante', 'Garantía')." },
            { id: "INFOGRAPHIC", name: "INFOGRAPHIC", style: "flat-lay professional photography", goal: "Diseño con etiquetas de texto breves y limpias en ESPAÑOL explicativas." },
            { id: "BEFORE_AFTER", name: "BEFORE_AFTER", style: "split screen comparison layout", goal: "Comparativa clara. Etiqueta izquierda: 'ANTES', Etiqueta derecha: 'DESPUÉS' (en ESPAÑOL)." },
            { id: "COMPARISON", name: "COMPARISON", style: "side-by-side product duel", goal: "Comparativa. A un lado 'OTROS' y al otro 'NOSOTROS' en letras grandes y legibles en ESPAÑOL." },
            { id: "ZOOM_DETAIL", name: "ZOOM_DETAIL", style: "editorial photography layout", goal: "Doble composición: producto en escenario de lujo y un zoom resaltando texturas." }
        ];

        let targets = [];
        if (specificAngle) {
            const angle = allAdTypes.find(a => a.id === specificAngle) || allAdTypes[0];
            const num = count || 1;
            for (let i = 0; i < num; i++) targets.push(angle);
        } else {
            targets = allAdTypes;
        }

        const variations = [];
        let lastError = "";
        const modelNames = ["gemini-3.1-flash-image-preview", "imagen-3.0-generate-001"];

        for (let i = 0; i < targets.length; i++) {
            const type = targets[i];
            const basePrompt = `Identify the product in the primary image. Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE in SPANISH: ${type.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} Relación ${aspectRatio || '4:5'} vertical. Output: ONE high-quality image. Variation ${i + 1}`;

            let success = false;
            for (const mName of modelNames) {
                try {
                    const currentModel = userGenAI.getGenerativeModel({
                        model: mName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ],
                    });

                    const mediaParts = [
                        { inlineData: { data: base64Data, mimeType: mimeType } }
                    ];

                    if (logoBase64) {
                        const lData = logoBase64.includes(",") ? logoBase64.split(",")[1] : logoBase64;
                        const lMime = logoBase64.includes("image/png") ? "image/png" : "image/jpeg";
                        mediaParts.push({ inlineData: { data: lData, mimeType: lMime } });
                    }

                    const result = await currentModel.generateContent([
                        ...mediaParts,
                        finalPrompt,
                    ]);

                    const response = await result.response;
                    const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            title: type.name
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    lastError = err.message;
                    if (err.message.includes("429") || err.message.includes("Quota exceeded")) {
                        throw err;
                    }
                }
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2500));
            }
        }

        if (variations.length === 0) {
            throw new Error(lastError || "Error en la generación.");
        }

        return NextResponse.json({ success: true, variations: variations });

    } catch (error: any) {
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
            return NextResponse.json({ error: "CUOTA EXCEDIDA. Intenta en unos minutos." }, { status: 429 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}