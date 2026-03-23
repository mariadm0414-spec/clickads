import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, logoBase64, userPrompt, apiKey, specificAngle, count, primaryColor, secondaryColor, font, aspectRatio, productName, targetAudience } = body;

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
        const brandingContext = ` PRODUCT: "${productName || 'unknown'}". TARGET AUDIENCE: "${targetAudience || 'general'}". ${logoInstruction} VISUAL THEME: Use the palette ${primaryColor || "luxury"} and ${secondaryColor || "neutral"} for all graphic elements (buttons, borders, overlays). Use ${font || "modern"} style for typography. 
        CRITICAL RULES for TEXT: 
        1. CRITICAL: NEVER write technical labels like "INFOGRAPHIC", "INFOGRAFÍA", "BENEFITS", "BENEFICIOS", "FEATURES", "CARACTERÍSTICAS", "LOGO", "WEBSITE", "URL", "WWW" or raw HEX CODES (e.g. #8B5CF6) as visible text. Replace them with REAL MARKETING HEADLINES (e.g. "¡Calidad Garantizada!", "Para tu ${targetAudience}"). 
        2. MANDATORY: 100% PERFECT SPANISH ORTHOGRAPHY. NO typos, NO word-breaks (AVOID "masco mscota", write exactly "mascota"). NO ENGLISH, NO GIBBERISH. 
        3. FONT STYLE: Use only VERY BOLD, CLEAN, PROFESSIONAL SANS-SERIF fonts for all overlays. NO cursive, NO ugly scripts. 
        4. SPACING & CLARITY: If a piece of text is too complex to render perfectly or risks having typos, OMIT it or use a simple icon (heart, star, paw) instead. 
        5. MANDATORY CONTEXT: 100% of the generated text MUST BE STRICTLY RELEVANT to the product "${productName}" and the audience "${targetAudience}". NO GENERIC OR INCORRECT CLAIMS. 
        6. PRICE POLICY: NEVER invent or include prices (e.g. "$9.99") UNLESS they are explicitly provided in the user's additional context/prompt. 
        7. BRANDING POLICY: NEVER invent or include placeholder logos, random brand names (e.g. "PetShop"), QR codes, or generic websites (e.g. "www.yoursite.com") UNLESS explicitly provided. 
`;

        const allAdTypes = [
            {
                id: "TESTIMONIAL",
                name: "TESTIMONIAL",
                style: "Cinematic professional product photography with dramatic commercial lighting. High-end atmospheric setting.",
                goal: "Añadir 2-3 burbujas de testimonios elegantes con FOTOGRAFÍAS REALES DE PERSONAS (NO ilustraciones, NO avatares dibujados, NO dibujos). Cada burbuja con un texto corto en ESPAÑOL (ej: '¡Es increíble!', 'Realmente funciona'). No incluir edades. Incluir 5 estrellas doradas y el texto 'Únete a +3,500 clientes felices'."
            },
            {
                id: "SALES_CTA",
                name: "SALES_CTA",
                style: "Urban premium lifestyle editorial photography. High-end professional lighting.",
                goal: "Incluir un titular impactante en ESPAÑOL relacionado con el producto. Añadir un botón flotante moderno y contrastado que diga 'COMPRAR AHORA' en ESPAÑOL. Diseño limpio y minimalista."
            },
            {
                id: "BENEFITS",
                name: "BENEFITS",
                style: "Clean luxury minimalist showroom with soft diffused lighting.",
                goal: `Resaltar 3 beneficios clave del producto "${productName || 'de la imagen'}" para el público "${targetAudience || 'general'}" usando iconos minimalistas y etiquetas de texto cortas en ESPAÑOL (ej: 'Calidad Premium', 'Garantía Total').`
            },
            {
                id: "INFOGRAPHIC",
                name: "INFOGRAPHIC",
                style: "Flat-lay professional editorial layout with clinical precision.",
                goal: `Crear una infografía premium del producto "${productName || 'de la imagen'}". Señalar 3-4 características REALES y VERIFICABLES (ej: material, diseño, uso) para el público "${targetAudience || 'general'}". NO ALUCINAR funciones que no existan. Texto breve en ESPAÑOL.`
            },
            {
                id: "BEFORE_AFTER",
                name: "BEFORE_AFTER",
                style: "Cinematic split-screen comparison with professional color grading.",
                goal: `Transformación de alto impacto emocional. Parte IZQUIERDA (ANTES): Mostrar el PROBLEMA que soluciona el producto "${productName || 'de la imagen'}" para el público "${targetAudience || 'general'}" (ej: aburrimiento, tristeza, desorden). Parte DERECHA (DESPUÉS): Mostrar la FELICIDAD y SOLUCIÓN usando el producto. Etiquetas claras en ESPAÑOL: 'ANTES' y 'DESPUÉS'.`
            },
            {
                id: "COMPARISON",
                name: "COMPARISON",
                style: "Side-by-side luxurious product face-off with dramatic lighting.",
                goal: "Comparativa competitiva premium. A un lado 'OTROS' y al otro 'NOSOTROS' en letras grandes, legibles y elegantes en ESPAÑOL."
            },
            {
                id: "ZOOM_DETAIL",
                name: "ZOOM_DETAIL",
                style: "Macro editorial photography showcasing texture and premium build quality.",
                goal: "Doble composición: el producto en un escenario de lujo y un zoom macro detallado resaltando la calidad, con textos mínimos en ESPAÑOL."
            }
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
            const productCtx = productName ? ` PRODUCTO: ${productName}.` : "";
            const audienceCtx = targetAudience ? ` PÚBLICO OBJETIVO/AVATAR: ${targetAudience}.` : "";
            const basePrompt = `Identify the product in the primary image.${productCtx}${audienceCtx} Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE in SPANISH: ${type.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO ADICIONAL: ${userPrompt}.` : "";
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
