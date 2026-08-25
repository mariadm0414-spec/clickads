import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { personBase64, productBase64, logoBase64, productName, targetAudience, prompt, apiKey, angle, primaryColor, secondaryColor, font } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Gemini no configurada. Ve a Configuración y agrega tu API Key." }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const allDigitalAngles = [
            {
                id: "NEWS",
                name: "TIPO NOTICIA",
                style: "Elite Breaking News TV Broadcast layout with cinematic, professional studio lower-thirds and glows.",
                goal: "Crear un anuncio estilo NOTICIERO VIRAL DE LUJO. Persona y producto en recuadros modernos. Titular en ESPAÑOL impactante sobre: " + (prompt || "Oportunidad única") + ". Incluir sellos de 'EXCLUSIVO' y cintillo de alta tecnología."
            },
            {
                id: "BEFORE_AFTER",
                name: "ANTES / DESPUÉS",
                style: "Elite commercial photographic split-screen for high-conversion performance marketing.",
                goal: `Diseño 'ANTES/DESPUÉS' de alto impacto para "${productName}": 
                1. TITULAR: "TRANSFORMA TUS RESULTADOS CON ${productName}". 
                2. COMPARATIVA: Izquierda "ANTES" (frustración, texto "SIN RESULTADOS") y Derecha "DESPUÉS" (persona exitosa, texto "DISPARANDO VENTAS/ÉXITO"). 
                3. PRODUCTO: El producto visible en un mockup premium solapando ambas partes. 
                4. ICONOS: 2 iconos de 'Check' grandes. 
                5. SOCIAL PROOF: Un recuadro moderno abajo con 5 estrellas doradas y el nombre de un cliente satisfecho.`
            },
            {
                id: "EASE",
                name: "FACILIDAD EXTREMA",
                style: "Minimalist 'Silent Luxury' lifestyle editorial photography with soft, expensive focus.",
                goal: "Atmósfera de calma absoluta. La persona integrando el producto sin esfuerzo en un penthouse or espacio premium. Texto en ESPAÑOL elegante: 'LOGRA EL ÉXITO SIN ESFUERZO'."
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
            },
            {
                id: "HERO",
                name: "HERO (IMPACTANTE)",
                style: "Premium lifestyle advertising photography. Elite successful atmosphere. High-impact commercial lighting.",
                goal: `Diseño 'HERO' de alto impacto para infoproducto "${productName}": 1. TITULAR: Un titular GIGANTE y PERSUASIVO en ESPAÑOL resaltando el beneficio principal. 2. DESCRIPCIÓN: Un párrafo corto emocionante. 3. PUNTOS CLAVE: 3 beneficios con iconos de check. 4. BADGES: Etiquetas de "ACCESO INMEDIATO" y "100% RECOMENDADO". 5. PERSONA: Una persona representando el éxito tras consumir el contenido.`
            },
            {
                id: "LIFESTYLE_ELITE",
                name: "LIFESTYLE PREMIUM",
                style: "Premium editorial photography. High-end lifestyle context.",
                goal: `Diseño 'LIFESTYLE' de alto impacto: 1. CABECERA: Fondo de color con un TITULAR GIGANTE y ENÉRGICO en blanco sobre "${productName}". 2. CTA: Botón que diga "EMPEZAR AHORA". 3. ESCENA: La persona en un entorno de éxito con el producto (layout similar a revista de negocios). 4. LISTA: 6 mini-columnas de beneficios con iconos. 5. SELLO: Un sello circular de garantía en una esquina.`
            },
            {
                id: "WHAT_IS_IT_FOR",
                name: "PARA QUÉ SIRVE",
                style: "Elite educational digital layout. Crisp, professional and modern style.",
                goal: `Diseño '¿PARA QUÉ SIRVE?' para el infoproducto "${productName}": 
                1. CABECERA: Fondo blanco con titular azul/oscuro "¿PARA QUÉ SIRVE?". 
                2. LISTA: 5 beneficios numerados sobre la transformación del curso/ebook. 
                3. PRODUCTO: Mockup premium a la derecha. 
                4. FOOTER: Barra de color al final con el nombre de la academia y un slogan.`
            },
            {
                id: "PROBLEM_QUESTION",
                name: "PREGUNTA PROBLEMA",
                style: "Elite educational digital layout with strong typography. Forbes-level professional portraiture.",
                goal: `Diseño 'PREGUNTA PROBLEMA' para el infoproducto "${productName}": 
                1. TITULAR: Una PREGUNTA GIGANTE e IMPACTANTE en la parte superior en ESPAÑOL sobre un problema común de tu nicho. 
                2. TESTIMONIOS/PRUEBA: Tarjeta lateral con "+2,000 alumnos" y estrellas. 
                3. PRECIO: Resaltar precio en un sticker o burbuja moderna. 
                4. LISTA: 4 beneficios de por qué tu formación es la solución. 
                5. FOOTER: Sellos de certificación y confianza (Visa, Master, etc.) en un tono elegante.`
            },
            {
                id: "END_OF_PROBLEM",
                name: "EL FIN DE TU PROBLEMA",
                style: "Elite educational digital layout with strong typography. Success-themed cinematic backgrounds.",
                goal: `Diseño 'EL FIN DE TU PROBLEMA' para el infoproducto "${productName}": 
                1. TEXTO GIGANTE: "EL FIN DE [PROBLEMA]" en blanco. 
                2. TESTIMONIOS: Bloque de autoridad inferior con estrellas y "+10,000 alumnos satisfechos". 
                3. LISTA: 4 beneficios clave de la formación. 
                4. PERSONA: La persona empoderada al fondo en un entorno de éxito.`
            },
            {
                id: "OVERCOME_LIMITS",
                name: "SUPERA TUS LÍMITES",
                style: "Elite digital success layout with heavy typography. High-end corporate success style.",
                goal: `Diseño 'SUPERA TUS LÍMITES' para el infoproducto "${productName}": 
                1. TITULAR: Escribir "SUPERA TUS LÍMITES" en letras GIGANTES. 
                2. CAJAS: 6 iconos de beneficios rodeando a la persona/producto. 
                3. COMPARATIVA: Caja blanca inferior de PROBLEMA: [X] vs SOLUCIÓN: [Y]. 
                4. SOCIAL PROOF: estrellas doradas y "+1,000 casos de éxito" al pie.`
            },
            {
                id: "TRANSFORMATION",
                name: "TRANSFORMACIÓN",
                style: "Elite comparison-focused educational digital layout. Strong high-impact graphics.",
                goal: `Diseño 'TRANSFORMACIÓN' para el infoproducto "${productName}": 
                1. CABECERA: "TRANSFORMA TU VIDA CON ${productName}". 
                2. COMPARATIVA: Secciones de "ANTES" (sin conocimientos/resultados) y "DESPUÉS" (con resultados del curso) con flecha central. 
                3. TESTIMONIO: Recuadro inferior con cara de alumno y una cita de éxito emocionante. 
                4. ICONOS: 3 iconos de pilares claves de la formación.`
            },
            {
                id: "BEST_FRIEND",
                name: "TU MEJOR AMIGO",
                style: "Elite digital course/product layout with process visuals. Professional editorial style.",
                goal: `Diseño 'TU MEJOR AMIGO' para "${productName}": 
                - TITULAR: "TU MEJOR COMPAÑERO". 
                - PROGRESO: Línea de tiempo 1-2-3 (Aprender, Aplicar, Dominar). 
                - BENEFICIOS: 4 checks de utilidad al pie. 
                - BADGE: Sello circular de acceso de por vida o duración.`
            },
            {
                id: "WHY_IS_IT_SPECIAL",
                name: "¿POR QUÉ ES TAN ESPECIAL?",
                style: "Elite digital product showcase. Minimalist and elegant corporate branding.",
                goal: `Diseño '¿POR QUÉ ES TAN ESPECIAL?' para el infoproducto "${productName}": 
                - TITULAR: "¿POR QUÉ ES TAN ESPECIAL?". 
                - LÍNEA: Beneficios clave explicados en cajas de color. 
                - ESCENA: El infoproducto resaltado en dispositivos de lujo (MacBook/iPad). 
                - BANDA: Marca a la izquierda en vertical.`
            },
            {
                id: "PROBLEM_VS_SOLUTION",
                name: "PROBLEMA VS SOLUCIÓN",
                style: "Elite vertical split educational layout. High-impact commercial digital design.",
                goal: `Diseño 'PROBLEMA VS SOLUCIÓN' para el infoproducto "${productName}": 
                - DIVISIÓN: Línea central vertical. 
                - IZQUIERDA: "PROBLEMAS" (frustraciones del nicho). 
                - DERECHA: "SOLUCIÓN" (beneficios de tu formación). 
                - ESCENA: Alumno feliz con el curso.`
            }
        ];

        let targets = [];
        if (angle && angle !== "ALL") {
            const chosen = allDigitalAngles.find(a => a.id === angle) || allDigitalAngles[0];
            targets = [chosen];
        } else {
            targets = allDigitalAngles;
        }

        const variations: any[] = [];

        // Global Aesthetic Instructions
        const faceInstruction = personBase64
            ? "CRITICAL FACE CONSISTENCY: The AI must generate a realistic person resembling the concept provided."
            : "CHARACTER: If no person image is provided, use a 27-year-old Latina entrepreneur (modern, professional, confident look).";

        const brandColors = primaryColor ? `BRAND COLORS: Use ${primaryColor} as the primary accent color and ${secondaryColor || "#FFFFFF"} as the secondary color.` : "";
        const fontStyle = font ? `TYPOGRAPHY STYLE: Use ${font} font style.` : "";

        const globalAesthetic = `PRODUCT: "${productName || 'unknown'}". TARGET AUDIENCE: "${targetAudience || 'general'}". AESTHETIC: ${faceInstruction} Minimalist luxurious workspace. Real skin texture, visible pores, soft studio lighting. Digital ecosystem: MacBook Pro and iPad Pro. ${brandColors} ${fontStyle} TECHNICAL: Cinematic 35mm lens, elite bokeh. High commercial quality. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY: 
        1. NO TECHNICAL LABELS: NEVER write labels like "SUBTITULAR", "TITULAR", "SUBTITLE", "HEADLINE", "TAGLINE", "INFOGRAPHIC", "FEATURES", "LOGO", "URL", or "WEBSITE". 
        2. MANDATORY: 100% PERFECT SPANISH ORTHOGRAPHY. 
        3. FONT STYLE: Use only VERY BOLD, THICK, CLEAN SANS-SERIF fonts. 
`;

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const finalPrompt = `${globalAesthetic} AD OBJECTIVE: ${target.goal}. STYLE: ${target.style}. 
            DIMENSIONS: Instagram Post vertical feed (4:5 aspect ratio).
            TEXT OVERLAY: Include legible and persuasive advertising copy in SPANISH integrated into the design. 
            Output: ONE high-quality image.`;

            try {
                const response: any = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
                    config: {
                        responseModalities: ["IMAGE"]
                    }
                } as any);

                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    variations.push({
                        image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        angle: target.name
                    });
                }
            } catch (err: any) {
                console.error(`Error with digital variation ${i}:`, err.message);
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudo generar ningún creativo digital premium.");
        }

        return NextResponse.json({ success: true, variations });

    } catch (error: any) {
        console.error("Critical Digital Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
