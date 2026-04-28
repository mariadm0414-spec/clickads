import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Configuración de API incompleta" }, { status: 500 });
    }

    const body = await request.json();
    const {
      businessType,
      awarenessLevel,
      averageTicket,
      productService,
      idealClient,
      valueProposition,
      objective,
      budget,
      currency
    } = body;

    if (!productService || !objective || !businessType) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const dailyBudget = parseFloat(budget?.replace(/[^0-9.]/g, "") || "0");
    const currTag = currency ? ` ${currency}` : "";
    const tofuBudget = dailyBudget ? `${(dailyBudget * 0.10).toFixed(2)}${currTag}/día` : "10% del ppto.";
    const mofuBudget = dailyBudget ? `${(dailyBudget * 0.70).toFixed(2)}${currTag}/día` : "70% del ppto.";
    const bofuBudget = dailyBudget ? `${(dailyBudget * 0.20).toFixed(2)}${currTag}/día` : "20% del ppto.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const prompt = `
Eres un Director de Estrategia Creativa especializado en Paid Media (Meta Ads, TikTok Ads) para Latinoamérica.
Tu objetivo es analizar el negocio proporcionado y generar LA MEJOR ESTRATEGIA PUBLICITARIA FULL-FUNNEL (1 solo blueprint maestro) perfectamente adaptada a su nicho.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL NEGOCIO:
- Tipo de Negocio/Nicho: ${businessType}
- Nivel de Consciencia del Cliente: ${awarenessLevel}
- Ticket Promedio: ${averageTicket || "No especificado"}
- Producto/Servicio: ${productService}
- Cliente Ideal: ${idealClient || "No especificado"}
- Propuesta de Valor: ${valueProposition || "No especificada"}
- Objetivo Principal: ${objective}
- Presupuesto Diario Total: ${budget || "No especificado"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLAS DE CONFIGURACIÓN DE CAMPAÑA (ESTRICTAS OBLIGATORIAS):
Debes adaptar la recomendación de "configuracion_campana" a las siguientes reglas según el Tipo de Negocio y Objetivo.

1. Ecommerce -> Cualquier objetivo: TOFU (Tráfico a IG o Reconocimiento ThruPlay). MOFU (Conversiones web: 1 adset Intereses Directos, 1 adset Advantage+). BOFU (Conversiones web Remarketing: compradores, carrito, web).
2. Inmobiliaria -> Ventas WhatsApp: TOFU (Tráfico IG/ThruPlay). MOFU (Mensajes WA: 1 adset Directo bienes raíces, 1 adset Indirecto de alto poder adquisitivo ej. golf, viajeros internacionales, resorts). BOFU (Mensajes WA Remarketing a interacciones IG).
3. Inmobiliaria -> Leads/Formulario: TOFU (Tráfico IG/ThruPlay). MOFU (Formulario con 3 preguntas: 1. Tiene dinero? 2. Busca en la zona? 3. Tiempo de compra?). BOFU (Formulario Remarketing a interacciones).
4. Clínica / Salud / Servicios Locales -> Ventas WhatsApp: TOFU (Tráfico IG/ThruPlay). MOFU (Mensajes WA: Directo odontología/servicio + Indirecto poder adquisitivo). BOFU (Remarketing interacciones IG).
5. Clínica / Salud / Servicios Locales -> Leads/Formulario: TOFU (Tráfico IG/ThruPlay). MOFU (Formulario: 1. Tiene dinero? 2. Interesado en el tratamiento?). BOFU (Formulario o WA Remarketing).
6. Clínica / Salud / Servicios Locales -> Llamada: TOFU (Tráfico IG/ThruPlay). MOFU y BOFU (Llamadas a personas con intereses directos en el tratamiento).
7. Airbnb / Turismo -> Ventas WhatsApp: TOFU (Tráfico IG/ThruPlay). MOFU (Mensajes WA intereses de destino). BOFU (Remarketing WA interactuaron IG o video MOFU).
8. Airbnb / Turismo -> Leads/Formulario: TOFU (Tráfico IG/ThruPlay). MOFU (Formulario: ¿Fecha de viaje?). BOFU (Ventas a WA Remarketing).
9. Infoproducto -> Ventas a la Web: TOFU (Tráfico IG/ThruPlay). MOFU (Ventas Web: Advantage+ y Directo). BOFU (Remarketing compradores, carrito, web).
10. Infoproducto -> Ventas a WhatsApp: TOFU (Tráfico IG/ThruPlay). MOFU (Mensajes WA público directo). BOFU (Mensajes WA Remarketing a interacciones previas).
* Si es "Otro", adapta esta misma lógica (Atracción arriba, mensajes/conversión directo+indirecto en medio, remarketing abajo) 100% a su producto.

INSTRUCCIONES DE SALIDA:
Genera un Blueprint con EXACTAMENTE 9 creativos en total (3 TOFU, 3 MOFU, 3 BOFU).
Genera 3 copys recomendados en total (1 por cada etapa).
Añade un "Semáforo de decisiones", explicando la métrica para detener campañas y la estrategia para escalarlas (escalado del 25% diario).

Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura ESTRICTA.

{
  "summary": "Resumen ejecutivo de 2-3 líneas de la estrategia global...",
  "tofu": {
    "etapa": "Atracción - Público Frío",
    "objetivo": "Reconocimiento y clics masivos...",
    "budget": "${tofuBudget}",
    "configuracion_campana": "Regla estricta aplicada (Campaña, Públicos y optimización).",
    "creatives": [
      { "angle": "Ángulo (1)", "description": "Qué mostrar (detallado)." },
      { "angle": "Ángulo (2)", "description": "..." },
      { "angle": "Ángulo (3)", "description": "..." }
    ],
    "copy": "Copy 1 recomendado para TOFU"
  },
  "mofu": {
    "etapa": "Consideración - Público Tibio",
    "objetivo": "Generar confianza y deseo...",
    "budget": "${mofuBudget}",
    "configuracion_campana": "Regla estricta aplicada (Campaña, Públicos y optimización).",
    "creatives": [
      { "angle": "Prueba Social/Beneficio (1)", "description": "..." },
      { "angle": "Prueba Social/Beneficio (2)", "description": "..." },
      { "angle": "Prueba Social/Beneficio (3)", "description": "..." }
    ],
    "copy": "Copy 2 recomendado para MOFU"
  },
  "bofu": {
    "etapa": "Conversión - Público Caliente",
    "objetivo": "Cierre de venta inmediato...",
    "budget": "${bofuBudget}",
    "configuracion_campana": "Regla estricta aplicada (Campaña, Públicos y optimización).",
    "creatives": [
      { "angle": "Escasez/Urgencia (1)", "description": "..." },
      { "angle": "Escasez/Urgencia (2)", "description": "..." },
      { "angle": "Escasez/Urgencia (3)", "description": "..." }
    ],
    "copy": "Copy 3 recomendado para BOFU"
  },
  "semaforo": {
    "detener": "Cuándo detener la campaña (ej. tras N días o superando cierto CPA)",
    "optimizar": "Cuándo cambiar creativos o pausar conjuntos",
    "escalar": "Cuándo escalar y metodología estricta (aumentar presupuesto 25% diario sin reiniciar aprendizaje)"
  }
}
`.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    let text = result.response.text();
    const data = JSON.parse(text);

    return NextResponse.json({ success: true, strategy: data });

  } catch (error: any) {
    console.error("ERROR EN GENERATE STRATEGY:", error);
    return NextResponse.json(
      { error: "Error al generar la estrategia", details: error.message },
      { status: 500 }
    );
  }
}

