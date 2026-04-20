import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, image, apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);
        const mediaParts: any[] = [];
        if (image) {
            const data = image.includes(",") ? image.split(",")[1] : image;
            mediaParts.push({ inlineData: { data, mimeType: "image/jpeg" } });
        }

        const prompt = `Actúa como un Analista Experto en eCommerce de Talla Mundial, Especialista en Psicología del Consumidor y Copywriter de Respuesta Directa nivel Eugene Schwartz. 
Voy a lanzarte un producto y quiero que desarrolles una BIBLIA de Investigación de Producto y Análisis de Mercado absolutamente colosal, detallada, quirúrgica y de un valor incalculable. 
Desglosa cada punto con un nivel de detalle exhaustivo. Usa formato Markdown, negritas y viñetas dentro del texto para crear un formato altamente profesional y fácil de leer. Nada de respuestas genéricas: entra a la mente del consumidor y dame las estrategias, motivaciones ocultas y ángulos más agresivos.

PRODUCTO Y CONTEXTO:
Nombre del producto: "${name}"
Descripción del usuario: "${description || 'No proporcionada'}"
Imagen: (Si está adjunta, utilízala al 100% para deducir funcionalidades, calidad percibida y contexto de uso).

TAREA Y FORMATO DE SALIDA (MUY IMPORTANTE):
Debes completar esta Masterclass devolviendo un objeto JSON estricto con exactamente 30 claves (enumera los campos como strings desde "1" hasta "30"). 
- Cada uno de los 30 campos debe contener una respuesta EXTENSA (2 o 3 párrafos potentes o listas en markdown).
- Al devolver el JSON, ASEGÚRATE de escapar correctamente comillas internas y usar saltos de línea codificados (\\n\\n) dentro del texto de cada string para no romper el formato JSON. No incluyas comentarios fuera del JSON.
- Todo en Español Neutro y Profesional.

NO agregues introducciones, SÓLO devuelve el JSON con estas 30 claves literales:

1: Nombre y Descripción del Producto (Análisis de posicionamiento, tipo y descripción maestra)
2: Promesa Central del Producto (Transformación absoluta y grandiosa que enganchará al cliente rápido)
3: Beneficios Específicos (Clasificados detalladamente: Físicos, Estéticos, Funcionales y Emocionales)
4: Características Clave del Producto (Datos técnicos, ingredientes, dimensiones, ventajas de materiales)
5: Tipo de Solución (Clasificación estratégica y por qué encaja ahí: Preventiva, correctiva, mantenimiento u optimización)
6: Mecanismo Diferencial Funcional (El secreto de su funcionamiento y por qué destruye a la competencia)
7: Problemas y Dolores que Resuelve (Listado profundo de frustraciones diarias y escenarios donde el producto salva al usuario)
8: Anhelos o Deseos del Consumidor (Aspiraciones psicológicas, estatus moral, y validación social)
9: Dolores Profundos del Consumidor (La mayor urgencia o punto de ebullición emocional que exige acción hoy)
10: Miedos Ocultos del Consumidor (Miedos viscerales, sociales o irracionales que el producto erradicará)
11: Resultado Principal Deseado (El 'Santo Grial'. La escena final en la mente de quien lo compra)
12: Tipo de Transformación (El paso exacto del estado A al estado B en lo físico, emocional y social)
13: Transformación de Antes y Después (Contraste dramático: Cómo era su infierno antes vs. su paraíso después)
14: Naturaleza del Valor Percibido (El tipo de ahorro sistemático, conveniencia, paz mental o lujo agregado)
15: Modo de Uso y Adopción (Cómo se integra en la rutina sin fricción)
16: Errores de Uso y Fricciones (Posibles malos usos que el marketing debe anticipar y despejar)
17: Restricciones y Advertencias (Limitaciones reales, éticas o funcionales)
18: Categoría Mental del Producto (En qué 'cajón mental' ubica el cliente la solución y cómo reposicionarla para cobrar más)
19: Criterios de Decisión del Comprador (Factores de compra: precio, tiempos, ingredientes, garantías tangibles)
20: Disparadores de Compra Evidentes (Eventos de vida o situaciones límite que provocan una compra de impulso)
21: Objeciones Comunes del Consumidor (Excusas mentales para NO comprar y la demolición argumentativa de las mismas)
22: Barrera Principal de Acción (El mayor obstáculo de conversión y la táctica exacta para matarlo)
23: Nivel de Explicación Necesario (Grado de educación, corto/medio/largo, y qué embudo/landing necesita)
24: Señales de Credibilidad (Requisitos de autoridad, menciones, ciencia empírica o demostraciones requeridas)
25: Evidencias, Pruebas y Testimonios (El esquema exacto que debe tener un testimonio demoledor para este producto)
26: Factor de Gratificación (Gratificación instantánea vs demorada, y cómo mantenerles comprados)
27: Oportunidades Estratégicas y Ángulos (Océanos azules, nuevas perspectivas y ángulos hiper-rentables)
28: Insights Psicológicos Clave (Qué botón reptiliano apretar para desencadenar pura irracionalidad compradora)
29: Elevator Pitch de Ventas (El resumen ultra-agresivo de 3 a 5 líneas para captar atención de forma letal)
30: Avatares y Públicos Objetivos (Desglose riguroso de al menos 3 nichos sub-específicos, sus motivaciones core y cómo atacarlos)`;

        const modelNames = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-3.1-flash-image-preview"
        ];

        let finalJson = null;
        let lastError = "";

        for (const modelName of modelNames) {
            try {
                const model = userGenAI.getGenerativeModel({
                    model: modelName
                });

                const result = await model.generateContent([...mediaParts, prompt]);
                const response = await result.response;
                const rawText = response.text();

                const cleanText = rawText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

                finalJson = JSON.parse(cleanText);
                if (finalJson && (finalJson["1"] || finalJson[1])) {
                    break; // Exito
                }
            } catch (e: any) {
                console.error(`Fallo modelo ${modelName}:`, e.message || e);
                lastError = e.message || "Error desconocido";
            }
        }

        if (!finalJson) {
            throw new Error("El modelo de IA está inactivo o la Key no tiene permisos. Error: " + lastError);
        }

        // Validate that we have objects 1 to 30
        const resultsArray = [];
        for (let i = 1; i <= 30; i++) {
            resultsArray.push(finalJson[String(i)] || finalJson[i] || "Información no disponible.");
        }

        return NextResponse.json({ success: true, results: resultsArray });

    } catch (error: any) {
        console.error("Research API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
