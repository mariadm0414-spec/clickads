import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { beforeBase64, afterBase64, treatment, apiKey, angle } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Gemini no configurada. Ve a Configuración y agrega tu API Key." }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const allClinicAngles = [
            {
                id: "SPLIT",
                name: "SPLIT COMPARISON",
                style: "Cinematic, high-contrast professional medical photography. Clinical precision lighting.",
                goal: "Comparativa clásica vertical de alto impacto: Lado izquierdo (ANTES) y lado derecho (DESPUÉS) en ESPAÑOL. Añadir etiquetas elegantes y minimalistas con tipografía moderna."
            },
            {
                id: "MACRO",
                name: "MACRO CLOSE-UP",
                style: "Macro clinical aesthetic photography with extreme detail and soft editorial lighting.",
                goal: "Zoom macro profesional al resultado final, resaltando una piel perfecta y calidad médica premium. Texto mínimo en ESPAÑOL: 'RESULTADOS REALES'."
            },
            {
                id: "SOCIAL",
                name: "SOCIAL PROOF STORY",
                style: "Premium Instagram storytelling ad with warm, trusting clinical lighting.",
                goal: "Añadir una burbuja de testimonio elegante con el avatar de un paciente satisfecho. Texto en ESPAÑOL (ej: '¡El cambio que buscaba!'). Incluir 5 estrellas doradas brillantes y un acabado de revista de lujo."
            },
            {
                id: "MEDICAL",
                name: "TECHNICAL FILE",
                style: "High-end medical case study documentation layout with soft studio shadows.",
                goal: "Estética de ficha técnica clínica elite con anotaciones minimalistas, flechas elegantes y datos en ESPAÑOL sobre la mejora del tratamiento."
            },
            {
                id: "STORY",
                name: "LIFESTYLE SUCCESS",
                style: "Bright, luxurious modern clinical setting with professional depth of field.",
                goal: "Paciente real sonriendo con total confianza en el entorno de la clínica. Texto sugerido en ESPAÑOL: 'Vuelve a sonreír' o similar. Ambiente aspiracional."
            },
            {
                id: "TRUST",
                name: "TRUST SEAL",
                style: "Elite studio clinical product/service photography.",
                goal: "Incluir un sello de 'Resultado Científico' o 'Garantía Clínica' premium en ESPAÑOL. Sombras suaves y composición equilibrada de alta gama."
            }
        ];

        let targets = [];
        if (angle) {
            const chosen = allClinicAngles.find(a => a.id === angle) || allClinicAngles[0];
            targets = [chosen];
        } else {
            targets = allClinicAngles;
        }

        const variations = [];

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const basePrompt = `Create high-end clinic/med-spa advertising image for ${treatment || "Aesthetic procedure"}. Aspect ratio 4:5. ${target.goal}`;

            try {
                const response: any = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [{ role: "user", parts: [{ text: basePrompt }] }],
                    config: {
                        responseModalities: ["IMAGE"]
                    } as any
                });

                const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                if (part && part.inlineData) {
                    variations.push({
                        image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        angle: target.name
                    });
                }
            } catch (err: any) {
                console.error(`Error generating clinic variation ${i}:`, err.message);
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudo generar ninguna variación clínica.");
        }

        return NextResponse.json({ success: true, variations });

    } catch (error: any) {
        console.error("Clinic Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
