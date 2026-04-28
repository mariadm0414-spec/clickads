/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { csvData, fileName } = body;

        if (!csvData) {
            return NextResponse.json({ error: "No se enviaron datos para analizar." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const prompt = `
            Actúa como el mejor Analista de Datos y Trafficker Senior del mundo.
            Aquí tienes los datos de un reporte de Excel subido por el usuario (Archivo: ${fileName || "Reporte"}). 
            He extraído los principales registros aquí (en formato CSV/JSON):
            
            ${csvData.substring(0, 50000)}

            Tu misión es analizar profundamente este informe y generar un "SUPER INFORME EJECUTIVO DE RENDIMIENTO PUBLICITARIO Y NEGOCIO" extremadamente extenso, detallado y accionable.
            Combina el análisis de negocio (problemas, hallazgos, mejoras) con el publicitario (ROAS, CPA, puntuación de campañas).
            Si faltan datos, infiérelo de forma analítica y lógica. Queremos que el usuario sienta que un humano experto revisó línea por línea de su Excel.

            REGLA DE FORMATO DE NÚMEROS: TODOS los valores numéricos grandes, de moneda o cantidades (Inversión, Conversiones, CPA, etc.) DEBEN incluir puntuación y separadores de miles y decimales amigables para el usuario (Por ejemplo: "$1,500.50", "12,450", "3.45%"). Nunca regreses números planos como 1500.5.

            Devuelve TODA la respuesta EXCLUSIVAMENTE en formato JSON válido con la siguiente estructura exacta:
            {
                "reportTitle": "SUPER INFORME EJECUTIVO DE RENDIMIENTO",
                "period": "Rango de fechas o 'Período no especificado'",
                "executiveSummary": [
                    "Primer párrafo del resumen (introducción general sobre la salud del negocio y los datos en general)...",
                    "Segundo párrafo del resumen (análisis comercial cruzado con publicitario)...",
                    "Tercer párrafo del resumen (impresiones iniciales de mejora o fugas)..."
                ],
                "kpis": {
                    "totalSpend": "...",
                    "totalConversions": "...",
                    "avgCpa": "...",
                    "avgCtr": "...",
                    "avgConversionRate": "...",
                    "roasGeneral": "..."
                },
                "keyFindings": [
                    { "title": "Hallazgo Positivo 1", "description": "Descripción extensa de por qué es bueno..." },
                    { "title": "Hallazgo Positivo 2", "description": "Descripción extensa..." }
                ],
                "problems": [
                    { "title": "Fuga de presupuesto 1", "severity": "Crítica", "description": "Explicación de por qué se pierde dinero o hay fallas..." },
                    { "title": "Cuello de botella 2", "severity": "Alta", "description": "..." }
                ],
                "improvements": [
                    { "title": "Optimización 1", "impact": "Alto", "description": "Qué hacer para mejorar conversiones o bajar costos..." },
                    { "title": "Optimización 2", "impact": "Medio", "description": "..." }
                ],
                "campaignAnalysis": [
                    { 
                        "name": "Campaña X", 
                        "platform": "Meta/Google/etc",
                        "score": 95, 
                        "status": "Ganadora",
                        "spend": "$1,000.00",
                        "conversions": "1,500",
                        "cpa": "$20.00", 
                        "reason": "Por qué funcionó maravillosamente y qué hacer con ella (ej. escalar)." 
                    },
                    { 
                        "name": "Campaña Y", 
                        "platform": "Meta/Google/etc",
                        "score": 30, 
                        "status": "Perdedora",
                        "spend": "$500.00",
                        "conversions": "2",
                        "cpa": "$250.00", 
                        "reason": "Por qué falló y diagnóstico de ineficiencia urgente." 
                    }
                ],
                "platformPerformance": [
                    { "platform": "Meta", "spend": "...", "conversions": "...", "cpa": "...", "roas": "...", "diagnosis": "Análisis profundo de la eficiencia y rentabilidad." }
                ],
                "temporalTrends": {
                    "summary": "Interpretación profunda del comportamiento del CPA/ROAS en el tiempo.",
                    "bestMonth": "Mes o día con mejor CPA/ROAS",
                    "worstMonth": "Mes o día de mayor fuga"
                },
                "geographicAnalysis": [
                    { "country": "País o Región", "conversions": "...", "cpa": "...", "opportunity": "Insights y recomendaciones para este país" }
                ],
                "actionPlan": [
                    { "step": "1", "action": "Acción hiper detallada y específica...", "priority": "Urgente" },
                    { "step": "2", "action": "...", "priority": "Alta" },
                    { "step": "3", "action": "...", "priority": "Media" }
                ]
            }
            
            No incluyas markdown, HTML ni texto suelto. Devuelve el JSON directo.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        }

        const finalData = JSON.parse(text);
        return NextResponse.json(finalData);

    } catch (error: any) {
        console.error("Excel Analyzer API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
