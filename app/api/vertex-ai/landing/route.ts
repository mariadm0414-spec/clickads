import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { images, category, template, size, language, apiKey } = body;

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

        // Determine prompt based on category
        let specificPrompt = "";
        if (category === "Antes/Después") {
            specificPrompt = `Diseña una sección gráfica de 'Antes y Después' dividida verticalmente o diagonalmente. Muestra el estado problema ('ANTES') y el estado de éxito ('DESPUÉS') usando el producto proporcionado. Incluye insignias o burbujas de texto explicando el contraste.`;
        } else if (category === "Hero") {
            specificPrompt = `Diseña una cabecera (Hero Section) espectacular. El producto debe ser el protagonista central, rodeado de un titular gigante, persuasivo y de alto contraste que capte la atención inmediata, y un subtítulo que invite a la acción. Añade un botón call-to-action simulado en el diseño.`;
        } else if (category === "Oferta") {
            specificPrompt = `Diseña un banner de Oferta Irresistible (Irresistible Offer). Destaca el producto con elementos de urgencia (ej. 'Por tiempo limitado', 'Oferta flash', banderas de descuento tipo '-50%'). Incluye un temporizador falso y elementos que griten escasez y valor.`;
        } else if (category === "Beneficios") {
            specificPrompt = `Diseña una sección de Beneficios. Presenta el producto junto a 3 o 4 iconos modernos o viñetas destacadas (bullets) que expliquen claramente por qué este producto soluciona el problema del cliente.`;
        } else if (category === "Tabla Comparativa") {
            specificPrompt = `Diseña gráfica de Tabla Comparativa o formato 'Nosotros vs Ellos' (Us vs Them). Muestra claramente la superioridad del producto (marcas de verificación verdes, colores positivos) frente a las alternativas genéricas (cruces rojas, colores opacos).`;
        } else if (category === "Testimonios") {
            specificPrompt = `Diseña una sección de Prueba Social y Testimonios. Muestra el producto integrado con 2 o 3 tarjetas de reseñas falsas altamente realistas (estrellas doradas 5/5, foto de perfil, un texto breve de cliente emocionado).`;
        } else if (category === "Prueba de Autoridad") {
            specificPrompt = `Diseña un banner de Confianza y Autoridad. Añade logotipos tipo 'Visto en' o 'Recomendado por expertos', acompañado de cifras de impacto grandes (ej. '+10,000 clientes felices').`;
        } else if (category === "Modo de Uso") {
            specificPrompt = `Diseña una sección de 'Cómo funciona' o 'Modo de uso' dividida en pasos claros (Paso 1, Paso 2, Paso 3). Gráficos limpios y directos mostrando la sencillez del proceso integrado con el producto.`;
        } else {
            specificPrompt = `Diseña un banner publicitario premium enfocado en resaltar la mejor característica del producto.`;
        }

        const globalPrompt = `Eres un diseñador experto en E-commerce y Landing Pages de alto rendimiento (estilo ClickFunnels / Shopify Premium).
OBJETIVO: Crear un único gráfico compuesto (Sección de Landing) listo para insertarse en una web.
CATEGORÍA: ${category}
REFERENCIA DE ESTILO/PLANTILLA: "${template}"
IDIOMA DEL TEXTO: ${language}

INSTRUCCIONES DE DISEÑO:
1. ${specificPrompt}
2. REGLA ESTRICTA DE TEXTO: El diseño debe incluir TÍTULOS Y TEXTOS 100% LEGIBLES EN ${language.toUpperCase()}. NO debes generar símbolos extraños ni letras rotas (Evita el texto distorsionado tan común en IA).
3. ESTRUCTURA: Combina hábilmente texto integrado, fotografías, cajas de color y elementos de interfaz de usuario (UI) pintados como parte de la imagen. 
4. RESOLUCIÓN Y FORMATO: El gráfico debe sentirse moderno, corporativo u orgánico (según aplique al producto). Calidad de render 8k y uso magistral de sombras y brillos.
5. INTEGRACIÓN: Si se te han proporcionado imágenes de producto, utilízalas de forma heroica y realista dentro de la composición gráfica.

Genera SÓLO el gráfico publicitario/sección de landing compuesto.`;

        // The user might be using imagen-3.0-generate-001 or gemini-3.1-flash-image-preview
        // we'll try imagen-3.0 first
        const modelNames = ["imagen-3.0-generate-001", "imagen-3.0-fast-001"];
        let resultImage = null;

        for (const mName of modelNames) {
            try {
                const model = userGenAI.getGenerativeModel({ model: mName }, { apiVersion: "v1beta" });
                const result = await model.generateContent([
                    ...mediaParts,
                    globalPrompt
                ]);
                const response = await result.response;
                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
                if (part && part.inlineData) {
                    resultImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            } catch (err) {
                console.error(`Error generating landing with ${mName}:`, err);
            }
        }

        if (!resultImage) {
            throw new Error("No se pudo generar la sección de landing. Revisa la calidad de las imágenes base o intenta otra categoría.");
        }

        return NextResponse.json({ success: true, image: resultImage });

    } catch (error: any) {
        console.error("Landing API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
