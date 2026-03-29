import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { personBase64, productBase64, logoBase64, productName, targetAudience, prompt, apiKey, angle, primaryColor, secondaryColor, font } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);

        const allDigitalAngles = [
            {
                id: "NEWS",
                name: "TIPO NOTICIA",
                style: "Elite Breaking News TV Broadcast layout with cinematic, professional studio lower-thirds and glows.",
                goal: "Crear un anuncio estilo NOTICIERO VIRAL DE LUJO. Persona y producto en recuadros modernos. Titular en ESPAÑOL impactante sobre: " + (prompt || "Oportunidad única") + ". Incluir sellos de 'EXCLUSIVO' y cintillo de alta tecnología."
            },
            {
                id: "BEFORE_AFTER",
                name: "SIN / CON PRODUCTO",
                style: "Cinematic split-screen high-conversion direct response layout. High-fashion editing.",
                goal: "Comparativa de alto impacto emocional en ESPAÑOL. Izquierda: 'FRUSTRACIÓN' (tonos apagados). Derecha: 'ÉXITO TOTAL' (la persona vibrante, logrando resultados con el producto en un entorno de ultra-lujo)."
            },
            {
                id: "EASE",
                name: "FACILIDAD EXTREMA",
                style: "Minimalist 'Silent Luxury' lifestyle editorial photography with soft, expensive focus.",
                goal: "Atmósfera de calma absoluta. La persona integrando el producto sin esfuerzo en un penthouse o espacio premium. Texto en ESPAÑOL elegante: 'LOGRA EL ÉXITO SIN ESFUERZO'."
            },
            {
                id: "PROOF",
                name: "PRUEBA SOCIAL",
                style: "Premium social-native storytelling layout with warm cinematic lighting and bokeh.",
                goal: "Añadir 2-3 burbujas de testimonios con FOTOGRAFÍAS REALES DE PERSONAS (NO ilustraciones, NO avatares dibujados). Cada burbuja con un elogio corto en ESPAÑOL (ej: '¡Mi vida cambió!', 'La mejor elección'). Incluir 5 estrellas doradas premium y el texto 'Únete a +3,500 expertos'."
            },
            {
                id: "AUTHORITY",
                name: "AUTORIDAD / FORBES",
                style: "Elite commercial portraits for a high-end business magazine like Forbes or Vogue.",
                goal: "Máximo liderazgo y autoridad visual. Persona con mirada de confianza, iluminación de estudio profesional y sombras controladas. Texto en ESPAÑOL: 'EL REFERENTE #1 DEL SECTOR'."
            },
            {
                id: "SUCCESS",
                name: "RESULTADO ASPIRACIONAL",
                style: "Cinematic, high-stakes success lifestyle in an elite setting (Private Jet or SkyLounge).",
                goal: "Visualizar el éxito absoluto. La persona disfrutando de su libertad con el producto integrado en dispositivos premium (MacBook Pro Mockup). Texto en ESPAÑOL: 'VIVE TU LIBERTAD FINANCIERA'."
            },
            {
                id: "HOOK_VIBRANT",
                name: "GANCHO VIRAL VIBRANTE",
                style: "Ultra-dynamic, high-contrast attention-grabbing ad design with professional color grading.",
                goal: "Diseño audaz con colores vibrantes integrados elegantemente. Titular GIGANTE y legible en ESPAÑOL cautivando la atención inmediata sobre: " + prompt + "."
            },
            {
                id: "MOCKUP_3D",
                name: "MOCKUP 3D PREMIUM",
                style: "Apple-style digital showroom 3D render with pristine surfaces and cinematic lighting.",
                goal: "El infoproducto como protagonista absoluto en una suite de dispositivos Apple (MacBook, iPhone, Tablet). Renderizado 3D perfecto, sin ruido visual, fondo de lujo desenfocado."
            }
        ];

        let targets = [];
        if (angle && angle !== "ALL") {
            const chosen = allDigitalAngles.find(a => a.id === angle) || allDigitalAngles[0];
            targets = [chosen];
        } else {
            targets = allDigitalAngles;
        }

        const variations = [];
        const modelNames = ["gemini-3.1-flash-image-preview", "gemini-1.5-flash", "gemini-1.5-pro", "imagen-3.0-generate-001"];

        // Global Aesthetic Instructions as requested
        const faceInstruction = personBase64
            ? "CRITICAL FACE CONSISTENCY: The AI must generate a realistic person resembling the concept provided."
            : "CHARACTER: If no person image is provided, use a 27-year-old Latina entrepreneur (modern, professional, confident look).";

        const brandColors = primaryColor ? `BRAND COLORS: Use ${primaryColor} as the primary accent color and ${secondaryColor || "#FFFFFF"} as the secondary color in the UI/Graphic elements.` : "";
        const fontStyle = font ? `TYPOGRAPHY STYLE: Use ${font} font style (or similar premium sans-serif).` : "";

        const globalAesthetic = `PRODUCT: "${productName || 'unknown'}". TARGET AUDIENCE: "${targetAudience || 'general'}". AESTHETIC: ${faceInstruction} Minimalist luxurious workspace. Real skin texture, visible pores, soft studio lighting. Digital ecosystem: MacBook Pro and iPad Pro. ${brandColors} ${fontStyle} TECHNICAL: Cinematic 35mm lens, elite bokeh. High commercial quality, Forbes magazine level. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY (READ CAREFULLY OR YOU FAIL): 
        1. CRITICAL BAN ON META-TEXT: YOU MUST NEVER RENDER THE EXACT STRINGS "${primaryColor}" OR "${secondaryColor}" AS VISIBLE TEXT ON THE IMAGE. THESE ARE COLORS TO PAINT WITH, NOT WORDS TO WRITE! NEVER write Hex codes.
        2. NO TECHNICAL LABELS: NEVER write "INFOGRAPHIC", "FEATURES", "LOGO", "URL", or "WEBSITE". Replace them with REAL MARKETING HEADLINES. 
        3. MANDATORY: 100% PERFECT SPANISH ORTHOGRAPHY. NO typos, NO word-breaks (AVOID "masco mscota", write exactly "mascota"). NO ENGLISH.
        4. FONT STYLE: Use only VERY BOLD, THICK, CLEAN SANS-SERIF fonts for all text overlays (impactful). NO cursive, NO ugly scripts. 
        5. SPACING & CLARITY: If a word is too complex to render perfectly, OMIT it or use a simple icon instead. 
        6. MANDATORY CONTEXT: 100% of the generated text MUST BE STRICTLY RELEVANT to the product "${productName}" and the audience "${targetAudience}". NO GENERIC OR INCORRECT CLAIMS. 
        7. PRICE POLICY: NEVER invent or include prices (e.g. "$9.99") UNLESS they are explicitly provided in the user's additional context/prompt. 
        8. BRANDING POLICY: NEVER invent or include placeholder logos, random brand names, QR codes, or generic websites UNLESS explicitly provided. 
`;
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const finalPrompt = `${globalAesthetic} AD OBJECTIVE: ${target.goal}. STYLE: ${target.style}. 
            DIMENSIONS: Instagram Post vertical feed (4:5 aspect ratio, 1080x1350px).
            TEXT OVERLAY: Include legible and persuasive advertising copy in SPANISH integrated into the design. 
            Output: ONE high-quality image.`;

            let success = false;
            for (const mName of modelNames) {
                try {
                    console.log(`Generating premium digital ad variation ${i + 1} (${target.id}) with model: ${mName}`);
                    const model = userGenAI.getGenerativeModel({
                        model: mName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ],
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                        } as any
                    }, { apiVersion: "v1beta" });

                    // Gemini multimodal generation (text -> image)
                    const result = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: finalPrompt }] }]
                    });

                    const response = await result.response;
                    const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            angle: target.name
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    console.error(`Error with premium digital model ${mName}:`, err.message);
                }
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudo generar el creativo digital premium. Revisa las imágenes y tu API Key.");
        }

        return NextResponse.json({ success: true, variations });

    } catch (error: any) {
        console.error("Critical Digital Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
