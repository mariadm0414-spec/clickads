import { NextRequest, NextResponse } from "next/server";

// El navegador no puede mandar headers custom en un <video src> ni en un <a href> de descarga,
// y Google exige el header x-goog-api-key para servir el video generado por Veo — este proxy
// hace esa llamada server-side y reenvía los bytes tal cual. NO persiste nada (no hay Storage,
// no hay Supabase, no hay base de datos de por medio): cada reproducción vuelve a pedirle el
// archivo a Google, así que el video deja de funcionar en cuanto el enlace de Google expira
// (Google lo conserva ~48h) — decisión explícita del usuario de no usar almacenamiento externo.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
    const uri = req.nextUrl.searchParams.get("uri");
    const apiKey = req.nextUrl.searchParams.get("key");

    if (!uri) {
        return NextResponse.json({ error: "Falta el parámetro uri." }, { status: 400 });
    }
    if (!apiKey) {
        return NextResponse.json({ error: "Falta el parámetro key." }, { status: 400 });
    }

    try {
        const videoRes = await fetch(uri, {
            headers: { "x-goog-api-key": apiKey }
        });

        if (!videoRes.ok || !videoRes.body) {
            return NextResponse.json(
                { error: `No se pudo obtener el video desde Google (${videoRes.status}). El enlace de Google expira ~48h después de generado.` },
                { status: videoRes.status || 502 }
            );
        }

        return new NextResponse(videoRes.body, {
            status: 200,
            headers: {
                "Content-Type": videoRes.headers.get("content-type") || "video/mp4",
                "Cache-Control": "private, max-age=3600"
            }
        });
    } catch (error: any) {
        console.error("Veo video-proxy Error:", error);
        return NextResponse.json({ error: error.message || "Error del servidor al obtener el video." }, { status: 500 });
    }
}
