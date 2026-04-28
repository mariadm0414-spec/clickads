import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface PostData {
    dia: number;
    titulo: string;
    formato: string;
    objetivo: string;
    alcance: number;
    guardados: number;
    compartidos: number;
    status: string;
}

export async function POST(req: Request) {
    try {
        const { posts, mision, metasVenta } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API Key no configurada");

        // Filter only published or analyzed posts with at least some data
        const postsConDatos: PostData[] = posts.filter(
            (p: PostData) => (p.status === "Publicado" || p.status === "Analizado") &&
                (p.alcance > 0 || p.guardados > 0 || p.compartidos > 0)
        );

        if (postsConDatos.length === 0) {
            return NextResponse.json({
                error: "No hay posts publicados con métricas para analizar. Publica al menos un post y agrega sus métricas."
            }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        const resumen = postsConDatos.map((p) =>
            `Día ${p.dia}: "${p.titulo}" | Formato: ${p.formato} | Objetivo: ${p.objetivo} | Alcance: ${p.alcance} | Guardados: ${p.guardados} | Compartidos: ${p.compartidos}`
        ).join("\n");

        const prompt = `Eres un estratega de contenido orgánico senior especializado en analizar rendimiento de redes sociales para negocios digitales. Analiza los datos reales de rendimiento del mes y entrega un informe estratégico accionable.

MISIÓN DEL MES: "${mision}"
METAS DE VENTA: "${metasVenta}"

DATOS DE RENDIMIENTO (${postsConDatos.length} posts publicados):
${resumen}

Tu análisis debe ser honesto, directo y extremadamente accionable. Basado en los datos reales:

1. Identifica el FORMATO más exitoso (el que generó más guardados en promedio)
2. Identifica los 2-3 TEMAS que generaron más interés (guardados + compartidos como señal de valor real)
3. Encuentra el POST GANADOR (mayor cantidad de guardados)
4. Da una RECOMENDACIÓN PRO específica para el próximo mes
5. Propón si el post ganador es candidato perfecto para convertirlo en anuncio pagado

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta, sin texto adicional:
{
  "formatoExitoso": "Nombre del formato ganador",
  "razonFormato": "Explicación breve de por qué fue el más efectivo con estos datos",
  "temasMasGuardados": [
    { "tema": "Nombre/descripción del tema", "guardadosTotal": 0, "posts": ["Título del post 1", "Título del post 2"] }
  ],
  "postGanador": {
    "dia": 0,
    "titulo": "Título del post",
    "formato": "Formato",
    "guardados": 0,
    "compartidos": 0,
    "alcance": 0
  },
  "recomendacion": "Recomendación pro específica y concreta para el próximo mes. Mencioná qué duplicar, qué eliminar y por qué.",
  "propuestaAlgoCopy": "Texto persuasivo explicando por qué este post ganador es perfecto para convertirlo en anuncio, y qué ángulo publicitario usar.",
  "resumenEjecutivo": "Párrafo ejecutivo de 2-3 oraciones resumiendo el mes: qué funcionó, qué no, y el estado del negocio en redes."
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error en Planner Analyze:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
