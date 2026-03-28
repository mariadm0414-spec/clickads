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

        const prompt = `Actúa como un analista experto en eCommerce, Copywriting de Respuesta Directa y Psicología del Consumidor de talla mundial (nivel Eugene Schwartz / Gary Halbert). 
Voy a lanzarte un producto y necesito la investigación de mercado y perfilado de producto más profunda y precisa posible.

PRODUCTO Y CONTEXTO:
Nombre del producto: "${name}"
Descripción del usuario: "${description || 'No proporcionada'}"
Imagen: (Si está adjunta, úsala para deducir qué es y cómo funciona).

TAREA:
Debes completar una investigación exhaustiva devolviendo un objeto JSON estricto con exactamente 30 claves (desde "1" hasta "30"). Cada clave corresponde al conocimiento específico solicitado abajo. Responde al punto con máxima profundidad, profesionalismo, usando viñetas o párrafos separados con salto de línea (\\n\\n) cuando sea necesario. Todo en Español Perfecto.

NO agregues introducciones, SÓLO devuelve el JSON con estas 30 claves literales (enumera los campos como strings "1", "2", ..."30"):

1: Nombre y Descripcion del Producto (Nombre comercial, tipo y descripción general)
2: Promesa Central del Producto (Transformación realista prometida)
3: Beneficios Específicos (Físicos, estéticos, funcionales y emocionales)
4: Características Clave del Producto (Datos técnicos, ingredientes, dimensiones, etc)
5: Tipo de Solución (Preventiva, correctiva, mantenimiento, alivio u optimización)
6: Mecanismo Diferencial Funcional (Cómo funciona y qué lo hace único)
7: Problemas que Resuelve (Frustraciones y dificultades)
8: Anhelos o Deseos del Consumidor (Aspiraciones psicológicas)
9: Dolores Profundos del Consumidor (Las mayores urgencias que requieren esto)
10: Miedos Ocultos del Consumidor (Miedos irreales o sociales)
11: Resultado Principal Deseado (El Santo Grial para el usuario)
12: Tipo de Transformación (Física, emocional, estatus)
13: Transformación de Antes y Después (Contraste de vida)
14: Naturaleza del Valor (Ahorro, estatus, salud, comodidad)
15: Modo de Uso (Cómo integrarlo a su vida)
16: Errores de Uso (Fricciones posibles)
17: Restricciones y Advertencias (Limitaciones éticas o funcionales)
18: Categoría Mental del Producto (Cajón mental del cliente)
19: Criterios de Decisión del Comprador (Factores de compra)
20: Disparadores de Compra (Eventos gatillo)
21: Objeciones Comunes del Consumidor (Excusas para no comprar)
22: Barrera Principal de Acción (Mayor obstáculo de conversión)
23: Nivel de Explicación Necesario (Corto, medio, largo)
24: Señales de Credibilidad (Pruebas necesarias)
25: Evidencias o Pruebas (Testimonios ideales, data)
26: Factor de Gratificación (Instantánea, tardía)
27: Oportunidades Estratégicas (Ángulos inexplorados de marketing)
28: Insights Psicológicos Clave (Qué botón mental apretar)
29: Resumen (Pitch elevador del producto en 3 líneas)
30: Públicos Objetivos (Nichos y avatares ideales específicos)`;

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
