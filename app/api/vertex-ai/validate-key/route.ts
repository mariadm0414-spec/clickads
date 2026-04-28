import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "No se proporcionó ninguna clave." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

        // Intentamos una petición ultra-mínima para no gastar cuota y validar la clave
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: 'Hola' }] }],
            generationConfig: { maxOutputTokens: 1 }
        });

        const response = await result.response;
        const text = response.text();

        if (text || text === "") {
            return NextResponse.json({ success: true, message: "Validación exitosa" });
        } else {
            throw new Error("Sin respuesta del motor");
        }

    } catch (error: any) {
        console.error("Error validando API Key:", error.message);

        let errorMessage = "Clave de API inválida o error de conexión.";
        if (error.message?.includes("API_KEY_INVALID")) {
            errorMessage = "La clave de API ingresada es incorrecta. Por favor, verifícala.";
        } else if (error.message?.includes("limit")) {
            errorMessage = "La clave es válida, pero has alcanzado el límite de cuota de Google.";
        }

        return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
}
