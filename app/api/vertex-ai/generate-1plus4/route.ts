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
        2. NO TECHNICAL LABELS (STRICT BAN): NEVER, under any circumstances, write labels or structural words like "CABECERA SUPERIOR", "CABECERA", "SUBTITULAR", "TITULAR", "TITULO", "TAGLINE", "SUBHEADLINE", "LOGO", "URL", or "WEBSITE". These are labels FOR YOU, not for the image. If you write "CABECERA SUPERIOR" or "SUBTITULAR" on the image, you have failed miserably.
        3. PRODUCT RELEVANCE: The characters in the scene MUST be 100% relevant to the product. If the product is for PETS (dogs, cats, etc.), show the PET in the 'Antes' and 'Después' states. Do NOT put a random irritated human if the product is for a dog.
        4. MANDATORY: 100% PERFECT ORTHOGRAPHY IN ${outputLang}. NO typos. LANGUAGE: ${outputLang}.
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
                style: "Cinematic ultra-high conversion split-screen comparison. Pro athletic commercial lighting.",
                goal: `Diseño 'ANTES/DESPUÉS' de alto impacto para "${productName}": 
                1. TITULAR SUPERIOR: "TRANSFORMA TU VIDA CON ${productName}". 
                2. DIVISIÓN CENTRAL: Lado izquierdo "ANTES" (persona cansada/problema, texto "FATIGA & ESTRÉS") y Lado derecho "DESPUÉS" (persona radiante/éxito, texto "ENERGÍA & RESULTADOS"). 
                3. PRODUCTO: El producto "${productName}" en el centro solapando ambas partes. 
                4. ICONOS: Añadir 2 iconos de beneficios (e.g. Rayo de energía, Corazón saludable). 
                5. TESTIMONIOS: Un recuadro inferior con 5 estrellas y una cita corta persuasiva.`
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
            },
            {
                id: "HERO",
                name: "HERO",
                style: "Premium high-energy lifestyle advertising photography. High-impact commercial lighting. Vibrant atmosphere with professional athletic or premium lifestyle setting.",
                goal: `Diseño 'HERO' de alto impacto: 1. TITULAR: Un titular GRANDE y PERSUASIVO en ${outputLang} sobre el producto "${productName}". 2. DESCRIPCIÓN: Un párrafo corto y emocionante. 3. PUNTOS CLAVE: 3 beneficios con iconos de check azules. 4. BADGES: Etiquetas de "ENVÍO GRATIS" y "GARANTÍA" en las esquinas. 5. PERSONA: Una persona exitosa/feliz usando el producto.`
            },
            {
                id: "LIFESTYLE_ELITE",
                name: "LIFESTYLE_ELITE",
                style: "Premium cinematic gym or lifestyle setting. Professional commercial lighting. Shallow depth of field.",
                goal: `Diseño 'LIFESTYLE PREMIUN' para "${productName}": 
                1. CABECERA: Fondo sólido en la parte superior con un TITULAR GIGANTE y ENÉRGICO en blanco. 
                2. CTA: Un botón elegante que diga "DESCUBRE MÁS". 
                3. ESCENA: El producto "${productName}" en primer plano sobre una superficie de madera/lujo. Al fondo, una persona realizando una actividad relacionada (ej. entrenar, relajarse). 
                4. LISTA: 6 beneficios cortos alineados a la izquierda con pequeños iconos. 
                5. BADGE: Sello circular en la esquina inferior derecha con texto "CALIDAD GARANTIZADA".`
            },
            {
                id: "WHAT_IS_IT_FOR",
                name: "WHAT_IS_IT_FOR",
                style: "Clean minimalist studio photography. Product-focused with dynamic splash or natural elements.",
                goal: `Diseño 'PARA QUÉ SIRVE' para "${productName}": 
                - PARTE SUPERIOR: Escribir "¿PARA QUÉ SIRVE?" en letras grandes. NUNCA escribir "TITULAR". 
                - LISTA: Una lista vertical del 1 al 5 a la izquierda con círculos numerados. 
                - PRODUCTO: El producto "${productName}" a la derecha. 
                - FOOTER: Franja de color en la base con un LOGO pequeño.`
            },
            {
                id: "PROBLEM_QUESTION",
                name: "PROBLEM_QUESTION",
                style: "High-energy cinematic background. Realistic professional lighting.",
                goal: `Diseño 'PREGUNTA PROBLEMA' para "${productName}": 
                - PARTE SUPERIOR: Una PREGUNTA GIGANTE e IMPACTANTE sobre un dolor del usuario. NUNCA escribir "TITULAR". 
                - TEXTOS: Una frase de alivio y descripción breve. NUNCA escribir "SUBTITULAR". 
                - TARJETA: Un recuadro a la derecha con prueba social ("+5,400 clientes satisfechos") y PRECIO. 
                - LISTA: 4 beneficios con iconos a la izquierda. 
                - FOOTER: 4 mini-iconos de confianza en la parte más baja.`
            },
            {
                id: "END_OF_PROBLEM",
                name: "END_OF_PROBLEM",
                style: "High-voltage cinematic background. Dramatic lighting.",
                goal: `Diseño 'EL FIN DE TU PROBLEMA' para "${productName}": 
                - PARTE ALTA: Escribir "EL FIN DE [PROBLEMA]" en letras blancas ultra-gruesas. NUNCA escribir "TITULAR" ni "CABECERA". 
                - PARTE MEDIA: Escribir "Tu solución definitiva para obtener [RESULTADO]". NUNCA escribir "SUBTITULAR". 
                - DETALLES: 4 iconos a la izquierda con beneficios. 
                - PRUEBA: Recuadro inferior con 5 estrellas e indicadores de satisfacción masiva.`
            },
            {
                id: "OVERCOME_LIMITS",
                name: "OVERCOME_LIMITS",
                style: "High-exposure energetic clean studio layout. Radial bursts and vibrant professional lighting.",
                goal: `Diseño 'SUPERA TUS LÍMITES' para "${productName}": 
                1. CABECERA: Escribir "SUPERA TUS LÍMITES" en letras GIGANTES y negras sobre blanco (o color de contraste). NUNCA escribir "TITULAR". 
                2. BANNER: Una franja de color sólido con la frase de beneficio principal en blanco (ej. "RESULTADOS VISIBLES EN 7 DÍAS"). 
                3. ICONOS LATERALES: 6 iconos rodeando el producto "${productName}" (3 a cada lado) con etiquetas cortas de beneficios. 
                4. RECUADRO COMPARATIVO: Un bloque inferior con fondo claro indicando "PROBLEMA: [Dolor del usuario]" y "SOLUCIÓN: ${productName} - [Slogan]". NUNCA escribir "SUBTITULAR". 
                5. PRUEBA SOCIAL: 5 estrellas y texto "4.9/5 | RESEÑAS VERIFICADAS" en la base. 
                6. ESCENA: El producto central con una composición creativa de una persona superando retos.`
            },
            {
                id: "TRANSFORMATION",
                name: "TRANSFORMATION",
                style: "Elite graphic comparison layout. Clean, professional and high-contrast digital composition. Focus on the transformation of the product's subject (person or pet).",
                goal: `Diseño 'TRANSFORMACIÓN' para "${productName}": 
                - PARTE ALTA: Escribir "TRANSFORMA LA VIDA DE TU MASCOTA CON ${productName}" (o adaptado al producto) en letras grandes. NUNCA escribir "CABECERA" ni "TITULAR". 
                - COMPARATIVA: Dos bloques dinámicos. Arriba: "ANTES" con lista de 3 problemas y el sujeto (ej. el perro sufriendo) en colores apagados. Abajo: "DESPUÉS" con lista de 3 resultados, el sujeto feliz/sano y el producto "${productName}". NUNCA poner humanos si el producto es para animales. 
                - ELEMENTOS: Una flecha grande que conecte el cambio. 
                - ICONOS: 3 iconos circulares abajo sobre la efectividad. 
                - TESTIMONIO: Recuadro horizontal al final con la satisfacción del dueño o usuario.`
            },
            {
                id: "BEST_FRIEND",
                name: "BEST_FRIEND",
                style: "Infographic-style photographic layout. Product-centered with process and timeline visuals.",
                goal: `Diseño 'TU MEJOR AMIGO' para "${productName}": 
                - PARTE ALTA: Escribir "TU COMPAÑERO EN TODO MOMENTO". NUNCA escribir "TITULAR" ni "CABECERA". 
                - LÍNEA DE TIEMPO: Mostrar 3 pasos (1. Inicio, 2. Uso, 3. Resultado) con fotos pequeñas. 
                - BENEFICIOS: Indicar beneficios basados en el tiempo (ej. 15 min: Efecto rápido). 
                - BADGE: Un sello circular con la cantidad o duración. 
                - FOOTER: 4 beneficios cortos resaltados con iconos de "CHECK" verde. 
                - ESCENA: El producto gigante en el centro.`
            },
            {
                id: "WHY_IS_IT_SPECIAL",
                name: "WHY_IS_IT_SPECIAL",
                style: "Elite product showcase with minimalist architecture. Pedestal-focused lighting. Vertical branding band.",
                goal: `Diseño '¿POR QUÉ ES TAN ESPECIAL?' para "${productName}": 
                - CABECERA: Escribir "¿POR QUÉ ES TAN ESPECIAL?" en letras GIGANTES y negras. NUNCA escribir "TITULAR". 
                - BANDA LATERAL: Una franja vertical delgada a la izquierda con el nombre de marca o "${productName}" rotado 90 grados. 
                - ESCENA: El producto "${productName}" situado sobre un PODIO o PEDESTAL moderno con efectos de salpicadura o aura al fondo. 
                - LISTA: Un bloque a la derecha con el título "Beneficios Clave:" y 4 cajas rectangulares de color con beneficios cortos e iconos asociados. 
                - FOOTER: Pequeño nombre de marca en la esquina inferior derecha.`
            },
            {
                id: "PROBLEM_VS_SOLUTION",
                name: "PROBLEM_VS_SOLUTION",
                style: "Clean vertical split layout. Professional commercial photography on the right, illustrative icons on the left.",
                goal: `Diseño 'PROBLEMA VS SOLUCIÓN' para "${productName}": 
                - DIVISIÓN: Una línea vertical central que separa la imagen en dos. 
                - LADO IZQUIERDO (PROBLEMAS): Fondo en tono neutro fuerte. Escribir "PROBLEMAS" en letras grandes. Mostrar 3 círculos/burbujas con imágenes de los "dolores" o competencia, con etiquetas cortas debajo. 
                - LADO DERECHO (SOLUCIÓN): Fondo luminoso y vibrante. Escribir "SOLUCIÓN" en letras grandes blancas. Mostrar a una persona FELIZ usando "${productName}". 
                - TARJETA: Un recuadro flotante a la derecha con el nombre del producto "${productName}" y una lista de 3 beneficios exclusivos de esta solución.`
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
        const modelErrors: string[] = [];

        // Configuración específica del panel AI Studio (Nano Banana 2)
        const modelNames = [
            "gemini-3.1-flash-image-preview",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "imagen-3.0-generate-001"
        ];

        for (let i = 0; i < targets.length; i++) {
            const type = targets[i];
            const productCtx = productName ? ` PRODUCTO: ${productName}.` : "";
            const audienceCtx = targetAudience ? ` PÚBLICO OBJETIVO/AVATAR: ${targetAudience}.` : "";
            const basePrompt = `Create a high quality commercial ad image. Identify the product conceptually. ${productCtx}${audienceCtx} Professional photography style: ${type.style}. AD CREATIVE OBJECTIVE: ${type.goal}.${brandingContext}`;
            const customContext = userPrompt ? ` CONTEXTO ADICIONAL: ${userPrompt}.` : "";
            const finalPrompt = `${basePrompt}${customContext} IMAGE DIMENSIONS / ASPECT RATIO: ${aspectRatio || '1:1'}. Output: ONE high-quality image. Variation ${i + 1}`;

            // Construir partes multimoda con la imagen real del producto
            const mediaParts = [];
            if (productBase64 && productBase64.includes(',')) {
                mediaParts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: productBase64.split(",")[1]
                    }
                });
            }
            if (logoBase64 && logoBase64.includes(',')) {
                mediaParts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: logoBase64.split(",")[1]
                    }
                });
            }

            let success = false;
            for (const mName of modelNames) {
                try {
                    console.log(`Intentando generación multimoda con modelo: ${mName}`);
                    const currentModel = userGenAI.getGenerativeModel({
                        model: mName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ],
                        // Forzar salida de imagen en modelos multimodales
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                        } as any
                    }, { apiVersion: "v1beta" });

                    // ENVÍO DE IMÁGENES REALES + TEXTO
                    const result = await currentModel.generateContent({
                        contents: [{
                            role: "user",
                            parts: [
                                ...mediaParts,
                                { text: `MANDATORY: REFERENCE THE PROVIDED IMAGES. The generated image MUST feature the exact product shown in the input image. DO NOT invent a new product shape or label. ${finalPrompt}` }
                            ]
                        }]
                    });

                    const response = await result.response;
                    const parts = response.candidates?.[0]?.content?.parts || [];
                    const part = parts.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            title: type.name
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    const errMsg = `[${mName}]: ${err.message}`;
                    if (!modelErrors.includes(errMsg)) modelErrors.push(errMsg);
                    console.error(`Error con modelo ${mName}:`, err.message);
                }
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (variations.length === 0) {
            const failDetail = modelErrors.join(" | ");
            throw new Error(`Error en la generación: ${failDetail}. Asegúrate de que tu API Key tiene acceso a modelos de generación de imágenes.`);
        }

        return NextResponse.json({ success: true, variations: variations });

    } catch (error: any) {
        if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
            return NextResponse.json({ error: "CUOTA EXCEDIDA. Intenta en unos minutos." }, { status: 429 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}