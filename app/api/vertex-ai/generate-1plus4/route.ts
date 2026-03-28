import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productBase64, logoBase64, userPrompt, apiKey, specificAngle, count, primaryColor, secondaryColor, font, aspectRatio, productName, targetAudience, language } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini para continuar." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);
        const outputLang = language || "ESPAÑOL";

        const logoInstruction = logoBase64 ? " INTEGRATE LOGO: Use the provided secondary image as the brand logo. Position it professionally in a corner or as part of the background. DO NOT write the word 'logo' or any technical labels." : "";
        const brandingContext = ` PRODUCT: "${productName || 'unknown'}". TARGET AUDIENCE: "${targetAudience || 'general'}". ${logoInstruction} VISUAL THEME: Use the colors ${primaryColor || "luxury"} and ${secondaryColor || "neutral"} for backgrounds and accents. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY (READ CAREFULLY OR YOU FAIL): 
        1. CRITICAL BAN ON META-TEXT: YOU MUST NEVER RENDER THE EXACT STRINGS "${primaryColor}" OR "${secondaryColor}" AS VISIBLE TEXT IN THE IMAGE. THESE ARE COLORS TO PAINT WITH, NOT WORDS TO WRITE! NEVER write Hex codes.
        2. NO TECHNICAL LABELS: NEVER write "INFOGRAPHIC", "FEATURES", "LOGO", "URL", or "WEBSITE". Use REAL MARKETING HEADLINES instead. 
        3. MANDATORY: 100% PERFECT ORTHOGRAPHY IN ${outputLang}. NO typos. LANGUAGE: ${outputLang}.
        4. FONT STYLE: Use only VERY BOLD, CLEAN, PROFESSIONAL SANS-SERIF fonts for all overlays. NO cursive, NO ugly scripts. 
        5. SPACING & CLARITY: If a piece of text is too complex to render perfectly, OMIT it or use a simple icon instead. 
        6. MANDATORY CONTEXT: 100% of the generated text MUST BE STRICTLY RELEVANT to the product "${productName}" and the audience "${targetAudience}". NO GENERIC OR INCORRECT CLAIMS. 
        7. PRICE POLICY: NEVER invent or include prices (e.g. "$9.99") UNLESS they are explicitly provided in the user's additional context. 
        8. BRANDING POLICY: NEVER invent or include placeholder logos, random brand names, QR codes, or generic websites UNLESS explicitly provided. 
`;

        const allAdTypes = [
            {
                id: "TESTIMONIAL",
                name: "TESTIMONIAL",
                style: "Cinematic professional product photography with dramatic commercial lighting. High-end atmospheric setting.",
                goal: `Añadir 2-3 burbujas de testimonios elegantes con FOTOGRAFÍAS REALES DE PERSONAS (NO ilustraciones, NO avatares dibujados, NO dibujos). Cada burbuja con un texto corto en ${outputLang}. No incluir edades. Incluir 5 estrellas doradas.`
            },
            {
                id: "SALES_CTA",
                name: "SALES_CTA",
                style: "Urban premium lifestyle editorial photography. High-end professional lighting.",
                goal: `Incluir un titular impactante en ${outputLang} relacionado con el producto. Añadir un botón flotante moderno y contrastado. Diseño limpio y minimalista.`
            },
            {
                id: "BENEFITS",
                name: "BENEFITS",
                style: "Clean luxury minimalist showroom with soft diffused lighting.",
                goal: `Resaltar 3 beneficios clave del producto "${productName || 'de la imagen'}" para el público "${targetAudience || 'general'}" usando iconos minimalistas y etiquetas de texto cortas en ${outputLang}.`
            },
            {
                id: "INFOGRAPHIC",
                name: "INFOGRAPHIC",
                style: "Flat-lay professional editorial layout with clinical precision.",
                goal: `Crear una infografía premium del producto "${productName || 'de la imagen'}". Señalar 3-4 características REALES y VERIFICABLES para el público "${targetAudience || 'general'}". Texto breve en ${outputLang}.`
            },
            {
                id: "BEFORE_AFTER",
                name: "BEFORE_AFTER",
                style: "Cinematic split-screen comparison with professional color grading.",
                goal: `Transformación de alto impacto emocional. Parte IZQUIERDA (ANTES): Mostrar el PROBLEMA que soluciona el producto "${productName || 'de la imagen'}". Parte DERECHA (DESPUÉS): Mostrar la FELICIDAD y SOLUCIÓN. Etiquetas claras en ${outputLang}.`
            },
            {
                id: "COMPARISON",
                name: "COMPARISON",
                style: "Side-by-side luxurious product face-off with dramatic lighting.",
                goal: `Comparativa competitiva premium. A un lado 'OTROS' y al otro 'NOSOTROS' (o equivalentes en ${outputLang}) en letras grandes, legibles y elegantes en ${outputLang}.`
            },
            {
                id: "ZOOM_DETAIL",
                name: "ZOOM_DETAIL",
                style: "Macro editorial photography showcasing texture and premium build quality.",
                goal: `Doble composición: el producto en un escenario de lujo y un zoom macro detallado resaltando la calidad, con textos mínimos en ${outputLang}.`
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
        const modelNames = ["imagen-3.0-generate-001"];

        for (let i = 0; i < targets.length; i++) {
            const type = targets[i];
            const productCtx = productName ? ` PRODUCTO: ${productName}.` : "";
            const audienceCtx = targetAudience ? ` PÚBLICO OBJETIVO/AVATAR: ${targetAudience}.` : "";
            const basePrompt = `Create a high quality commercial ad image. Identify the product conceptually. ${productCtx}${audienceCtx} Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE: ${type.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO ADICIONAL: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} IMAGE DIMENSIONS / ASPECT RATIO: ${aspectRatio || '1:1'}. Output: ONE high-quality image. Variation ${i + 1}`;

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

                    // Imagen 3 only supports text prompts
                    const result = await currentModel.generateContent([
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
