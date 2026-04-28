import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            productBase64,
            logoBase64,
            userPrompt,
            apiKey: userApiKey,
            specificAngle,
            count,
            primaryColor,
            secondaryColor,
            aspectRatio,
            productName,
            targetAudience,
            language
        } = body;

        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Gemini no configurada." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" }); // Note: Using 1.5 flash for logic, but we need 3.1 flash for image if possible.
        // Wait, the project uses @google/generative-ai. 
        // In 100Ecom it used @google/genai which supports gemini-3.1-flash-image-preview.
        // Let's check if 'saas' has @google/genai or if @google/generative-ai supports it.

        const outputLang = language || "ESPAÑOL";

        const logoInstruction = logoBase64 ? " INTEGRATE LOGO: Use the provided secondary image as the brand logo. Position it professionally in a corner or as part of the background. DO NOT write the word 'logo' or any technical labels." : "";
        const brandingContext = ` PRODUCT: "${productName || 'unknown'}". TARGET AUDIENCE: "${targetAudience || 'general'}". ${logoInstruction} VISUAL THEME: Use the colors ${primaryColor || "luxury"} and ${secondaryColor || "neutral"} for backgrounds and accents. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY: 
        1. NO TECHNICAL LABELS: NEVER write labels like "HEADLINE", "TITLE", "SUBTITLE", "LOGO", etc.
        2. SPANISH ONLY: All text on the image MUST be in Spanish.
        3. PRODUCT RELEVANCE: Ensure the environment matches the product.
`;

        const allAdTypes = [
            {
                id: "TESTIMONIAL",
                name: "Testimonial",
                style: "Cinematic professional product photography with dramatic commercial lighting. High-end atmospheric setting.",
                goal: `Añadir burbujas de testimonios elegantes con FOTOGRAFÍAS REALES DE PERSONAS. Texto corto en ${outputLang}. Incluir 5 estrellas doradas.`
            },
            {
                id: "SALES_CTA",
                name: "Llamada a la Acción",
                style: "Urban premium lifestyle editorial photography. High-end professional lighting.",
                goal: `Incluir un titular impactante en ${outputLang} relacionado con el producto. Añadir un botón flotante moderno y contrastado. Diseño limpio y minimalista.`
            },
            {
                id: "BENEFITS",
                name: "Beneficios",
                style: "Clean luxury minimalist showroom with soft diffused lighting.",
                goal: `Resaltar 3 beneficios clave del producto "${productName || 'de la imagen'}" para el público "${targetAudience || 'general'}" usando iconos minimalistas y etiquetas de texto cortas en ${outputLang}.`
            },
            {
                id: "BEFORE_AFTER",
                name: "Antes y Después",
                style: "Cinematic ultra-high conversion split-screen comparison.",
                goal: `Diseño 'ANTES/DESPUÉS' de alto impacto para "${productName}". Lado izquierdo "ANTES" (problema) y Lado derecho "DESPUÉS" (éxito). Texto en ${outputLang}.`
            },
            {
                id: "HERO",
                name: "Hero / Principal",
                style: "Premium high-energy lifestyle advertising photography. High-impact commercial lighting.",
                goal: `Diseño 'HERO' de alto impacto: Titular GRANDE y PERSUASIVO en ${outputLang} sobre el producto "${productName}". 3 beneficios con iconos de check. Sello de garantía.`
            }
        ];

        const angle = allAdTypes.find(a => a.id === specificAngle) || allAdTypes[0];
        const num = Math.min(count || 1, 4);

        const variations = [];

        // We use the direct fetch to the Google API because the SDK might be old.
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

        for (let i = 0; i < num; i++) {
            const productCtx = productName ? ` PRODUCTO: ${productName}.` : "";
            const audienceCtx = targetAudience ? ` PÚBLICO OBJETIVO: ${targetAudience}.` : "";
            const basePrompt = `Create a high quality commercial ad image. Identify the product conceptually. ${productCtx}${audienceCtx} Professional photography style: ${angle.style}. AD CREATIVE OBJECTIVE: ${angle.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO ADICIONAL: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} IMAGE DIMENSIONS / ASPECT RATIO: ${aspectRatio || '1:1'}. Output: ONE high-quality image.`;

            const parts: any[] = [];
            if (productBase64 && productBase64.includes(',')) {
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: productBase64.split(",")[1]
                    }
                });
            }
            if (logoBase64 && logoBase64.includes(',')) {
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: logoBase64.split(",")[1]
                    }
                });
            }
            parts.push({ text: `MANDATORY: REFERENCE THE PROVIDED IMAGES. The generated image MUST feature the exact product shown in the input image. ${finalPrompt}` });

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts }],
                        generationConfig: {
                            responseModalities: ["IMAGE"]
                        }
                    })
                });

                const data = await res.json();
                if (data.error) throw new Error(data.error.message || "Error Gemini");

                const part = data.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    variations.push({
                        image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        title: angle.name
                    });
                }
            } catch (err: any) {
                console.error(`Error with generate-creative iteration ${i}:`, err.message);
            }

            if (i < num - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (variations.length === 0) {
            return NextResponse.json({ error: "No se pudo generar ningún creativo." }, { status: 500 });
        }

        return NextResponse.json({ success: true, variations });

    } catch (error: any) {
        console.error("Creative Generator API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
