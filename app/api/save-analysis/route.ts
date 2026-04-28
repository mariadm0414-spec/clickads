import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl, overall_score, analysis } = body;

        if (!imageUrl || !analysis) {
            return NextResponse.json(
                { error: "Datos incompletos para guardar el análisis" },
                { status: 400 }
            );
        }

        // Simular guardado en base de datos
        // En una implementación real, aquí se usaría Prisma, Mongoose, etc.
        console.log("Saving analysis:", {
            imageUrl: imageUrl.substring(0, 50) + "...",
            overall_score,
            analysis_id: Math.random().toString(36).substr(2, 9)
        });

        return NextResponse.json({
            success: true,
            message: "Análisis guardado correctamente",
            id: Math.random().toString(36).substr(2, 9)
        });

    } catch (error) {
        console.error("ERROR SAVING ANALYSIS:", error);
        return NextResponse.json(
            { error: "Error al guardar el análisis" },
            { status: 500 }
        );
    }
}
