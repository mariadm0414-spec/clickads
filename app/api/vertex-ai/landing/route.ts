import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { images, category, template, size, language, apiKey, primaryColor, secondaryColor, font } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);

        const mediaParts: any[] = [];
        if (images && images.length > 0) {
            images.forEach((img: string) => {
                if (img) {
                    const data = img.includes(",") ? img.split(",")[1] : img;
                    mediaParts.push({
                        inlineData: { data, mimeType: "image/jpeg" }
                    });
                }
            });
        }

        const colorStyle = `
        REGLAS DE COLOR Y MARCA (CRÍTICO):
        - COLOR PRIMARIO: Utiliza el color hexadecimal ${primaryColor || '#8B5CF6'} para los elementos más importantes (titulares principales, botones, rebordes destacados).
        - COLOR SECUNDARIO: Utiliza el color hexadecimal ${secondaryColor || '#FFFFFF'} para fondos secundarios, textos de apoyo o acentos.
        - TIPOGRAFÍA: Simula una estética tipográfica basada en la fuente '${font || 'Inter'}'.
        - Asegúrate de que los degradados incluyan estos colores exactamente para que combinen con la marca del usuario.
        `;

        // Determine prompt based on category
        let specificPrompt = "";
        if (category === "Antes/Después") {
            const { before, after } = body;
            specificPrompt = `Diseña una sección de Transformación (Antes y Después). 
            COMPOSICIÓN:
            - Divide la imagen en dos áreas: Izquierda (ANTES) y Derecha (DESPUÉS).
            - PARTE IZQUIERDA (DOLOR): Representa visualmente el problema descrito: "${before || 'Problema sin producto'}". Usa tonos ligeramente más fríos o desaturados para el fondo del 'Antes'.
            - PARTE DERECHA (SOLUCIÓN): Representa visualmente la transformación positiva descrita: "${after || 'Solución con producto'}". Usa colores vibrantes y el color primario del proyecto.
            - TEXTO INTEGRADO: Incluye etiquetas claras de 'ANTES' y 'DESPUÉS'. 
            - BENEFICIOS: Añade 3 viñetas con iconos debajo de cada lado comparando fatiga vs energía, dolor vs alivio, etc.
            - TESTIMONIO: Incluye en la parte inferior una caja pequeña con una foto de perfil simulada, 5 estrellas y una frase corta de victoria comercial (ej: '¡Mi vida cambió en solo 3 días!').`;
        } else if (category === "Hero") {
            specificPrompt = `Diseña una cabecera (Hero Section) de impacto masivo y conversión inmediata. 
            ESTILO VISUAL: Utiliza fondos dinámicos con degradados premium o formas geométricas audaces (estilo deportivo o corporativo moderno según el producto). 
            COMPOSICIÓN: El producto debe ser el héroe absoluto. Si es posible, integra una persona (modelo) que represente el estilo de vida del producto (ej: atletas para suplementos, personas elegantes para moda).
            TEXTO: Aplica una jerarquía tipográfica brutal. 
            - Un Titular principal gigante y persuasivo en la parte superior.
            - Un bloque de beneficios cortos o una descripción técnica legible justo debajo.
            - Una franja o botón destacado con un mensaje de urgencia (ej: 'ENVÍO SEGURO' o 'OFERTA EXCLUSIVA').
            - Texto secundario en la parte inferior para refuerzo de autoridad.
            Todo debe estar perfectamente alineado y usar los colores de marca si se detectan en el logo o producto.`;

        } else if (category === "Oferta") {
            const { prices } = body;
            const validPacks = [];
            if (prices?.x1) validPacks.push(`Pack 1: ${prices.x1} (1 Unidad)`);
            if (prices?.x2) validPacks.push(`Pack 2: ${prices.x2} (2 Unidades)`);
            if (prices?.x3) validPacks.push(`Pack 3: ${prices.x3} (3 Unidades)`);
            if (prices?.x4) validPacks.push(`Pack 4: ${prices.x4} (4 Unidades)`);

            specificPrompt = `Diseña una sección de Oferta Irresistible (Packs de Venta).
            REGLA DE ORO: SOLO GENERA LOS PACKS PARA LOS QUE SE HA PROPORCIONADO UN PRECIO. NO INVENTES PRECIOS NI USES "N/A" NI "AGOTADO".
            CONFIGURACIÓN ACTUAL:
            - Genera exactamente ${validPacks.length} packs/columnas.
            - Los precios reales a usar son: ${validPacks.join(", ") || 'No se han proveido precios, no muestres packs'}.
            
            ESTILO Y COMPOSICIÓN:
            - Cada pack legítimo debe estar en su propio cuadro destacado.
            - Resalta el pack con más unidades o mejor ahorro con el color primario del proyecto.
            - Incluye botones de 'COMPRAR AHORA' con el precio exacto dentro o cerca.
            - NO generes texto distorsionado ni packs ficticios.`;

        } else if (category === "Beneficios") {
            const { benefits } = body;
            specificPrompt = `Diseña una sección de Beneficios (Para qué sirve). 
            ESTILO: 'Infografía de Producto' limpia y profesional.
            COMPOSICIÓN:
            - Coloca el producto en el centro o en un lateral con efectos de salpicaduras o aura si aplica.
            - Lista los siguientes beneficios de forma numerada (1, 2, 3...) o con iconos circulares modernos: ${benefits || 'Beneficios por defecto: Calidad, Resultados, Confianza'}.
            - Los beneficios deben estar alineados (ej: todos a la izquierda del producto, o repartidos).
            - TITULAR: Usa un título gancho como "¿Por qué elegir [Producto]?" o "¿Para qué sirve?".
            - PIE: Incluye una frase de cierre con el color principal del proyecto.`;
        } else if (category === "Tabla Comparativa") {
            const { comparison } = body;
            specificPrompt = `Diseña una sección de Comparativa (Nosotros vs Ellos).
            COMPOSICIÓN:
            - Crea una tabla con 2 columnas claras: "[TU MARCA]" y "ALTERNATIVAS".
            - COLUMNA TU MARCA: Usa flechas verdes, checkmarks elegantes y el color primario del proyecto. Incluye estos beneficios: ${comparison?.brand || 'Calidad, Rapidez, Garantía'}.
            - COLUMNA OTROS: Usa tonos apagados, cruces rojas o iconos de advertencia. Incluye estos problemas: ${comparison?.others || 'Envío lento, Sin soporte, Mala calidad'}.
            - VISUAL: El producto debe aparecer de forma heroica junto a tu columna de beneficios.
            - TITULAR: "No todos los productos son iguales" o "La diferencia está en los detalles".`;
        } else if (category === "Testimonios") {
            const { testimonials } = body;
            specificPrompt = `Diseña una sección de Prueba Social y Testimonios Reales.
            ESTILO: 'Social Proof Wall' o cuadrícula de tarjetas de reseña.
            COMPOSICIÓN:
            - Genera una cuadrícula con estas reseñas específicas: ${testimonials?.join(" | ") || 'Historias increíbles de clientes reales'}.
            - Cada reseña debe estar en una tarjeta blanca o con sombra ligera, incluyendo:
                1. Foto de perfil realista de una persona (hombre/mujer según el avatar).
                2. Nombre (ej: 'Carlos B.', 'Sofía P.').
                3. Calificación de 5 estrellas doradas.
                4. El texto del testimonio de forma legible.
            - TITULAR: "Historias Reales, Resultados Reales" o "Lo que dicen nuestros clientes".
            - VISUAL: El producto debe aparecer en la parte inferior o integrado de forma elegante.`;
        } else if (category === "Prueba de Autoridad") {
            const { authoritarian } = body;
            specificPrompt = `Diseña una sección de Autoridad y Confianza Profesional.
            ESTILO: 'Recomendación de Expertos' con estética médica o técnica limpia.
            COMPOSICIÓN:
            - Muestra a un experto fotorrealista (hombre o mujer con bata médica, uniforme o atuendo profesional) en primer plano.
            - El experto puede estar sosteniendo el producto o señalando hacia un bloque de texto destacado.
            - TITULAR: "Recomendado por Profesionales" o "${authoritarian?.title || 'Expertos en el sector'} confían en nosotros".
            - TESTIMONIO DE AUTORIDAD: Incluye de forma muy legible la siguiente frase (dentro de una burbuja de texto o bloque elegante): "${authoritarian?.quote || 'He analizado los componentes y los resultados son excepcionales.'}".
            - FIRMA: Firmado por "${authoritarian?.expert || 'Dra. Elena Ruiz'}, ${authoritarian?.title || 'Especialista'}".
            - SELLOS: Añade insignias de confianza como 'Acción Clínica', 'Made in USA', 'Clínicamente Probado'.`;
        } else if (category === "Modo de Uso") {
            const { usage } = body;
            specificPrompt = `Diseña una sección de 'Cómo funciona' o 'Modo de uso'.
            COMPOSICIÓN:
            - Divide la parte inferior en 3 recuadros o círculos numerados (1, 2, 3).
            - En cada recuadro, muestra una foto fotorrealista de una persona realizando los pasos descritos: ${usage || '1. Abre el producto, 2. Úsalo diariamente, 3. Disfruta los resultados'}.
            - Cada foto debe tener un pie de foto corto y directo en ${language}.
            - TITULAR: "¿Cómo usar [Producto]?" o "Tu camino al éxito en 3 pasos".
            - VISUAL: El producto principal debe aparecer arriba o al lado para conectar con las instrucciones.`;
        } else if (category === "Logística") {
            const { logistics } = body;
            specificPrompt = `Diseña una sección de 'Logística y Confianza de Envío'.
            COMPOSICIÓN:
            - TITULAR: "Envíos a todo el país" o "Tu pedido en buenas manos".
            - LOGOS DE TRANSPORTISTAS: Incluye logotipos profesionales de mensajería (simulados como Forza, FedEx, DHL o los mencionados: ${logistics}).
            - MÉTODOS DE PAGO: Añade iconos de Visa, Mastercard y un sello destacado de 'PAGO CONTRAENTREGA'.
            - VISUAL PRINCIPAL: Una mano sosteniendo un smartphone que muestra una aplicación de mapa con una ruta de entrega.
            - TEXTO DE DETALLE: "${logistics || 'Envío rápido y seguro con seguimiento en tiempo real'}".
            - ESTÉTICA: Colores corporativos confiables (azul, verde o los de la marca).`;
        } else if (category === "Preguntas Frecuentes") {
            const { faqs } = body;
            const faqList = faqs?.map((f: any) => `Q: ${f.q} | A: ${f.a}`).join(" || ");
            specificPrompt = `Diseña una sección de 'Preguntas Frecuentes' (FAQ).
            COMPOSICIÓN:
            - TITULAR: "Todo lo que necesitas saber" o "Preguntas Clave sobre [Producto]".
            - LISTADO: Muestra una lista vertical u horizontal de tarjetas con estas preguntas y respuestas: ${faqList || 'Varias preguntas sobre envíos, garantías y uso'}.
            - ESTILO: Cada par Q: A: debe estar en un bloque limpio, con iconos de 'Q' y 'A' o burbujas de diálogo.
            - VISUAL: El producto debe aparecer en la parte inferior o lateral como un 'kit definitivo' para cerrar la sección.
            - TEXTO: Asegúrate de que las respuestas sean 100% legibles aunque sean varias.`;
        } else {
            specificPrompt = `Diseña un banner publicitario premium enfocado en resaltar la mejor característica del producto.`;
        }

        const { idealSolution, prices, bonuses, guarantees } = body;

        const humanRealismRules = `
REGLAS DE REALISMO HUMANO (CRÍTICO):
- FOTORREALISMO EXTREMO: Las personas en los testimonios deben parecer fotos reales tomadas con cámaras profesionales (ej. Canon EOS R), con texturas de piel naturales (poros, imperfecciones leves), no modelos AI perfectos ni 'plásticos'.
- ILUMINACIÓN NATURAL: Usa luz ambiental o de estudio suave, evitando el aspecto plano o artificial de la generación común.
- EXPRESIONES GENUINAS: Las sonrisas y miradas deben ser naturales y relajadas, reflejando satisfacción real tras usar el producto.`;

        const globalPrompt = `Eres un diseñador experto en E-commerce y Landing Pages de alto rendimiento.
OBJETIVO: Crear un único gráfico compuesto (Sección de Landing) de exactamente ${size || '447x800'} píxeles de proporción vertical.
CATEGORÍA: ${category}
REFERENCIA DE ESTILO: Profesional, Moderno, Limpio.
IDIOMA DEL TEXTO: ${language}

INFORMACIÓN CLAVE DEL PRODUCTO (TOMAR MUY EN CUENTA):
- SOLUCIÓN IDEAL: ${idealSolution || 'No especificada'}
- OFERTA DE PRECIOS: x1: ${prices?.x1 || 'N/A'}, x2: ${prices?.x2 || 'N/A'}, x3: ${prices?.x3 || 'N/A'}
- BONUS: ${bonuses || 'Sin bonus'}
- GARANTÍAS: ${guarantees || 'Garantía de satisfacción'}

${humanRealismRules}

INSTRUCCIONES DE DISEÑO:
1. ${specificPrompt}
2. ${colorStyle}
3. REGLA ESTRICTA DE PRECIOS: No menciones precios, monedas ($) ni cifras de venta en esta imagen A MENOS que la categoría sea exactamente 'Oferta' y tengas datos numéricos reales. No inventes precios.
4. REGLA DE ESCRITURA Y ORTOGRAFÍA (MUY CRÍTICO): SÓLO PUEDES USAR EL IDIOMA ${language.toUpperCase()} PARA TODO EL TEXTO. ESTÁ TERMINANTEMENTE PROHIBIDO EL INGLÉS U OTROS IDIOMAS. Usa ORTOGRAFÍA PERFECTA, incluyendo tildes y gramática correcta. EVITA errores de IA como letras duplicadas.
5. ESTRUCTURA: Combina de forma magistral texto, iconos, botones simulados y product shots en una composición vertical (proporción 447:800).
6. RESOLUCIÓN: Calidad 8k, ultra detallada.

Genera SÓLO el gráfico publicitario/sección de landing compuesto.`;


        // The user might be using imagen-3.0-generate-001 or gemini-3.1-flash-image-preview
        // we'll try imagen-3.0 first
        const modelNames = ["gemini-3.1-flash-image-preview", "gemini-1.5-flash", "gemini-1.5-pro", "imagen-3.0-generate-001"];
        const modelErrors: string[] = [];
        let resultImage = null;

        for (const mName of modelNames) {
            try {
                const model = userGenAI.getGenerativeModel({
                    model: mName,
                    generationConfig: {
                        responseModalities: ["IMAGE"],
                    } as any
                }, { apiVersion: "v1beta" });
                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [...mediaParts, { text: globalPrompt }] }]
                });
                const response = await result.response;
                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
                if (part && part.inlineData) {
                    resultImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            } catch (err: any) {
                const errMsg = `[${mName}]: ${err.message}`;
                if (!modelErrors.includes(errMsg)) modelErrors.push(errMsg);
            }
        }

        if (!resultImage) {
            throw new Error(`Error en la generación: ${modelErrors.join(" | ")}`);
        }

        return NextResponse.json({ success: true, image: resultImage });

    } catch (error: any) {
        console.error("Landing API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
