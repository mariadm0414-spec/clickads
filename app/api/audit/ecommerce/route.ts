import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, analysisType, businessContext, niche } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        console.log(`🔍 Auditing URL: ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for fetch

        let pageContent = "";
        let hasMetaPixel = false;
        let hasGTM = false;
        try {
            const htmlRes = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const html = await htmlRes.text();

            hasMetaPixel = html.includes('fbevents.js') || html.includes('fbq(');
            hasGTM = html.includes('googletagmanager.com') || html.includes('gtm.js');

            // Basic cleanup
            pageContent = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        } catch (e) {
            console.error("Fetch failed", e);
            return NextResponse.json({ error: "No se pudo acceder a la URL. Verifica que sea pública." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        let prompt = "";

        if (analysisType === "copywriting") {
            prompt = `
                Actúa como el mejor Copywriter del mundo (estilo Ogilvy + Gary Halbert + modernas SAAS).
                Analiza el texto de esta web (${url}):
                "${pageContent.substring(0, 20000)}"

                Contexto del negocio: ${businessContext || "No especificado"}
                Nicho del Negocio: ${niche || "eCommerce"}

                Tu misión es auditar SOLAMENTE los textos (Copywriting) y reescribirlos para mejorar conversiones.
                Analiza estas 5 áreas clave:
                1. Hero Section (Titular + Subtítulo)
                2. Propuesta de Valor (Beneficios)
                3. Descripciones de Producto/Servicio
                4. Call to Actions (CTAs)
                5. Tono y Voz (Branding)

                FORMATO JSON OBLIGATORIO:
                {
                    "score": 75,
                    "summary": "Resumen brutalmente honesto del copy actual.",
                    "sections": [
                        {
                            "id": "hero",
                            "title": "Titular y Hero Section",
                            "current_state": "El titular actual 'Bienvenido a nuestra tienda' es débil y no dice nada.",
                            "weaknesses": ["No ataca ningún dolor", "Es genérico", "No hay promesa"],
                            "suggestion": "Dejas Dinero en la Mesa cada vez que alguien lee esto.",
                            "rewrite": "Titular Sugerido: 'Consigue X Resultado en Y Tiempo sin Z Esfuerzo'"
                        },
                        {
                            "id": "value_prop",
                            "title": "Propuesta de Valor",
                            "current_state": "La propuesta de valor es 'Productos de calidad a buen precio'.",
                            "weaknesses": ["Demasiado genérica", "No diferencia", "No enfoca en el cliente"],
                            "suggestion": "Enfócate en el beneficio único y el resultado para el cliente.",
                            "rewrite": "Reescritura Sugerida: 'Transforma tu [Problema] en [Solución Deseada] con [Tu Producto/Servicio]'"
                        },
                        {
                            "id": "product_desc",
                            "title": "Descripciones de Producto/Servicio",
                            "current_state": "Las descripciones son listas de características técnicas.",
                            "weaknesses": ["No venden beneficios", "Aburridas", "No conectan emocionalmente"],
                            "suggestion": "Convierte cada característica en un beneficio claro y tangible.",
                            "rewrite": "Reescritura Sugerida: 'Con [Característica], podrás [Beneficio 1] y [Beneficio 2], ahorrándote [Dolor].'"
                        },
                        {
                            "id": "cta",
                            "title": "Call to Actions (CTAs)",
                            "current_state": "Los CTAs son 'Comprar ahora' o 'Más información'.",
                            "weaknesses": ["No generan urgencia", "No son específicos", "No transmiten valor"],
                            "suggestion": "Haz que el CTA refleje el valor que el usuario obtendrá al hacer clic.",
                            "rewrite": "Reescritura Sugerida: 'Quiero mi [Beneficio]', 'Empieza a [Acción Deseada] hoy'"
                        },
                        {
                            "id": "tone_voice",
                            "title": "Tono y Voz",
                            "current_state": "El tono es formal y corporativo.",
                            "weaknesses": ["No conecta con la audiencia", "Frío", "No genera confianza"],
                            "suggestion": "Define un tono que resuene con tu cliente ideal y sea consistente.",
                            "rewrite": "Reescritura Sugerida: 'Adoptar un tono más cercano y empático, usando un lenguaje que tu cliente ideal entienda y con el que se identifique.'"
                        }
                    ]
                }
            `;
        } else if (analysisType === "landing") {
            prompt = `
                Actúa como un Experto en Embudos de Venta y Landing Pages (ClickFunnels & Russell Brunson style).
                Analiza esta Landing Page: ${url}
                Contexto: "${pageContent.substring(0, 15000)}"
                Nicho del Negocio: ${niche || "eCommerce"}

                Objetivo: Determinar por qué esta página convierte o no convierte tráfico frío en clientes.
                Analiza estos 5 Bloques de Landing Page:
                1. Congruencia (¿Se entiende en 3 segundos qué es?)
                2. Gancho / Above the Fold (Titular + Subtítulo + VSL/Imagen)
                3. Cuerpo / Argumentación (Problema - Agitación - Solución)
                4. Prueba Social y Autoridad
                5. Oferta y Llamada a la Acción (CTA)

                FORMATO JSON OBLIGATORIO:
                {
                    "score": 60,
                    "summary": "Resumen de la efectividad de la landing.",
                    "sections": [
                        {
                            "id": "hook",
                            "title": "1. Gancho y Primera Impresión",
                            "score": 6,
                            "strengths": ["Titular grande y visible"],
                            "weaknesses": ["El titular es confuso", "No hay promesa clara arriba"],
                            "immediate_action": ["Cambiar titular a: 'Cómo lograr X sin Y'"]
                        },
                        {
                            "id": "content",
                            "title": "2. Cuerpo y Persuasión",
                            "score": 7,
                            "strengths": ["Buenos bullets de beneficios"],
                            "weaknesses": ["Párrafos muy largos", "Falta enfoque en el problema (dolor)"],
                            "immediate_action": ["Romper párrafos en líneas de 1 frase", "Añadir sección de '¿Te pasa esto?'"]
                        },
                        {
                            "id": "proof",
                            "title": "3. Prueba Social",
                            "score": 4,
                            "strengths": [],
                            "weaknesses": ["Testimonios parecen falsos", "Faltan logos de autoridad"],
                            "immediate_action": ["Añadir fotos reales de clientes", "Poner capturas de resultados"]
                        },
                        {
                            "id": "offer",
                            "title": "4. Oferta Irresistible",
                            "score": 5,
                            "strengths": ["Precio claro"],
                            "weaknesses": ["No hay bonus", "No hay garantía visible"],
                            "immediate_action": ["Crear stack de valor (Bonus 1, 2, 3)", "Añadir sello de garantía 30 días"]
                        },
                        {
                            "id": "cta",
                            "title": "5. CTA y Cierre",
                            "score": 8,
                            "strengths": ["Botón contrastante"],
                            "weaknesses": ["Solo hay un botón al final"],
                            "immediate_action": ["Poner botón flotante o repetirlo cada 2 secciones"]
                        }
                    ]
                }
            `;
        } else if (analysisType === "oferta" || analysisType === "product") {
            prompt = `
                Actúa como un Experto en Optimización de Ofertas y Servicios (PDP / Sales Page).
                Analiza esta URL: ${url}
                Contenido: "${pageContent.substring(0, 15000)}"
                Nicho del Negocio: ${niche || "eCommerce"}

                Objetivo: Maximizar la tasa de "Add to Cart" y el Ticket Medio.

                Analiza:
                1. La Oferta (Precio, Descuento, Bonus, Garantía)
                2. Estructura de la Página (Fotos, Título, Buy Box)
                3. Ingeniería del Copy (Características vs Beneficios)

                FORMATO JSON OBLIGATORIO:
                {
                    "score": 75,
                    "productStructure": {
                        "missingElements": ["Falta Urgencia o Escasez", "No hay CTA claro en móvil", "No se destaca la oferta principal"],
                        "layoutAdvice": "Mueve la descripción de los beneficios por encima del precio y destaca el CTA principal."
                    },
                    "copyEngineering": [
                        { "feature": "Tela 100% Algodón", "benefit": "Suavidad que dura todo el día sin irritar tu piel." }
                    ],
                    "offerOptimization": {
                        "priceAnalysis": "El precio está oculto.",
                        "ctaAdvice": "Cambiar color del botón a uno de alto contraste."
                    },
                    "masterPlan": {
                        "critical": ["Arreglar el botón de compra roto"],
                        "important": ["Mejorar fotos de producto"],
                        "optimization": ["Añadir FAQs"]
                    }
                }
            `;
        } else {
            // General Audit
            prompt = `
                Actúa como un Auditor de Negocios Experto.
                Analiza: ${url}
                Contenido: "${pageContent.substring(0, 15000)}"
                Nicho del Negocio: ${niche || "eCommerce"}

                INFORMACIÓN TÉCNICA CLAVE: 
                - Píxel de Meta detectado en el código: ${hasMetaPixel ? 'SÍ' : 'NO'}
                - Google Tag Manager detectado en el código: ${hasGTM ? 'SÍ' : 'NO'}
                Considera esto como obligatorio para la sección 7. Analítica y Tracking. Si falta el píxel, es un fallo crítico para la pauta.

                INSTRUCCIONES:
                Evalúa los 9 pilares. 
                Céntrate EXCLUSIVAMENTE en **Fortalezas** y **Debilidades**.
                Elimina cualquier consejo genérico. Quiero saber qué está roto y qué funciona.

                1. Diseño y UX/UI
                2. SEO
                3. Velocidad y Técnico
                4. Estructura de Conversión (CRO)
                5. Copywriting (General)
                6. Producto y Propuesta
                7. Analítica y Tracking
                8. Estrategia de Tráfico
                9. Confianza y Credibilidad

                FORMATO JSON OBLIGATORIO:
                {
                    "score": 85,
                    "summary": "Resumen ejecutivo.",
                    "sections": [
                        {
                            "id": "design",
                            "title": "1️⃣ Diseño y UX/UI",
                            "subtitle": "Percepción Visual",
                            "score": 8,
                            "strengths": [
                                "Párrafo detallado sobre lo bueno...",
                                "Otro punto fuerte..."
                            ],
                            "weaknesses": [
                                "Párrafo detallado sobre el error crítico...",
                                "Otro punto débil..."
                            ]
                        },
                        {
                            "id": "seo",
                            "title": "2️⃣ SEO (Posicionamiento Orgánico)",
                            "subtitle": "Tráfico gratis vs Dependencia de Ads",
                            "score": 5,
                            "strengths": ["Títulos descriptivos..."],
                            "weaknesses": ["Faltan meta descripciones...", "Estructura H1 múltiple..."]
                        },
                        {
                            "id": "speed",
                            "title": "3️⃣ Velocidad y Rendimiento",
                            "subtitle": "Impacto directo en ROAS",
                            "score": 7,
                            "strengths": ["Carga inicial rápida..."],
                            "weaknesses": ["Imágenes sin optimizar (>2MB)..."]
                        },
                        {
                            "id": "cro",
                            "title": "4️⃣ Estructura de Conversión (CRO)",
                            "subtitle": "¿Diseñado para vender o para verse bien?",
                            "score": 6,
                            "strengths": ["Flujo de checkout simple..."],
                            "weaknesses": ["Falta urgencia...", "Demasiados clicks para pagar..."]
                        },
                        {
                            "id": "copy",
                            "title": "5️⃣ Copywriting",
                            "subtitle": "El mensaje es lo que vende",
                            "score": 9,
                            "strengths": ["Propuesta de valor clara..."],
                            "weaknesses": ["Mucho texto técnico...", "Falta storytelling..."]
                        },
                        {
                            "id": "product",
                            "title": "6️⃣ Oferta y Servicio",
                            "subtitle": "Potencial real de mercado",
                            "score": 8,
                            "strengths": ["Servicio único en el mercado..."],
                            "weaknesses": ["Precio no justificado...", "Fotos de baja calidad..."]
                        },
                        {
                            "id": "analytics",
                            "title": "7️⃣ Analítica y Tracking",
                            "subtitle": "Sin datos no hay escalabilidad",
                            "score": 4,
                            "strengths": ["GA4 instalado..."],
                            "weaknesses": ["No detecto Pixel de Meta...", "Eventos duplicados..."]
                        },
                        {
                            "id": "traffic",
                            "title": "8️⃣ Estrategia de Tráfico",
                            "subtitle": "Capacidad de escalar",
                            "score": 7,
                            "strengths": ["Buen mix orgánico..."],
                            "weaknesses": ["Dependencia 100% de Facebook...", "Sin retargeting..."]
                        },
                        {
                            "id": "trust",
                            "title": "9️⃣ Confianza y Credibilidad",
                            "subtitle": "Factor de decisión de compra",
                            "score": 6,
                            "strengths": ["Reseñas visibles..."],
                            "weaknesses": ["Faltan sellos de seguridad...", "Política de devolución oculta..."]
                        }
                    ]
                }
            `;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean JSON
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        }

        let finalResponse = JSON.parse(text);

        // Inject Heatmap data for Landing Audit
        if (analysisType === "landing") {
            const screenshotUrl = `https://image.thum.io/get/width/1024/crop/900/noanimate/${url}`;
            const heatPoints = [
                { x: 50, y: 15, value: 0.9 }, // Headline
                { x: 20, y: 40, value: 0.6 }, // Image/Video left
                { x: 75, y: 40, value: 0.8 }, // Benefits right
                { x: 50, y: 85, value: 0.95 }, // CTA
            ];
            finalResponse.heatmap = {
                screenshotUrl,
                heatPoints
            };
        }

        return NextResponse.json(finalResponse);


    } catch (error: any) {
        console.error("Audit API Critical Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
