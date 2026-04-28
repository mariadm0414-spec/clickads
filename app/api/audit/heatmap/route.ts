import { NextResponse } from "next/server";
import OpenAI from "openai";

// 1. FORZAMOS A VERCEL A NO TOCAR ESTO EN EL BUILD
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        // 2. INICIALIZAMOS OPENAI AQUÍ ADENTRO (NO AFUERA)
        // Así evitamos que el Build falle si no encuentra la API Key
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build", 
        });

        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // --- SIMULACIÓN DE VISIÓN (Thum.io + Mock) ---
        
        const screenshotUrl = `https://image.thum.io/get/width/1024/crop/800/noanimate/${url}`;
        
        // Simulamos espera de análisis
        await new Promise(resolve => setTimeout(resolve, 2000));

        let heatPoints = [];
        let analysis = { summary: "", weakness: "", recommendation: "" };

        if (url && url.includes("muimia")) {
             heatPoints = [
                { x: 50, y: 12, value: 0.95 },
                { x: 88, y: 8, value: 0.7 },
                { x: 50, y: 40, value: 0.9 },
                { x: 50, y: 65, value: 0.85 },
                { x: 15, y: 50, value: 0.4 },
            ];
            analysis = {
                summary: "El sistema detecta alto contraste en el producto, pero la navegación compite por atención.",
                weakness: "Fuga Visual: El menú roba atención al Hero.",
                recommendation: "Reduce opacidad del menú y satura el botón de compra."
            };
        } else {
            heatPoints = [
                { x: 15, y: 8, value: 0.9 },
                { x: 50, y: 30, value: 0.85 },
                { x: 85, y: 8, value: 0.5 },
                { x: 50, y: 60, value: 0.95 },
                { x: 20, y: 80, value: 0.3 },
            ];
            analysis = {
                summary: "Patrón de lectura en 'F'. El usuario escanea logo, titular y busca el botón.",
                weakness: "Zona inferior derecha fría (testimonios ignorados).",
                recommendation: "Mueve la prueba social cerca del botón de compra."
            };
        }

        return NextResponse.json({
            screenshotUrl: screenshotUrl,
            heatPoints: heatPoints,
            analysis: analysis
        });

    } catch (error: any) {
        console.error("Heatmap API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
