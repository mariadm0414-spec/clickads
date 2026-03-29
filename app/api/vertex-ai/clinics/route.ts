import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { beforeBase64, afterBase64, treatment, apiKey, angle } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere una API Key de Gemini." }, { status: 401 });
        }

        const userGenAI = new GoogleGenerativeAI(apiKey);

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
            // Generar todos los ángulos
            targets = allClinicAngles;
        }

        const variations = [];
        const modelNames = ["gemini-3.1-flash-image-preview", "gemini-1.5-flash", "gemini-1.5-pro", "imagen-3.0-generate-001"];

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const basePrompt = `Create a high quality clinical image. Clinical Treatment: ${treatment || "Aesthetic procedure"}. Image context: Show a BEFORE and AFTER comparison conceptually. Goal: ${target.goal}. Style: ${target.style}. 
            DIMENSIONS: Instagram Post size (4:5 aspect ratio, 1080x1350px).
            CRITICAL RULES (READ CAREFULLY OR YOU FAIL): 
            1. CRITICAL BAN ON META-TEXT: YOU MUST NEVER RENDER METRICS, HEX CODES (e.g., #FF00FF), OR COLOR NAMES AS VISIBLE TEXT ON THE IMAGE. THESE ARE STYLE INSTRUCTIONS, NOT TEXT TO BE RENDERED.
            2. ALL TEXT MUST BE IN PERFECT SPANISH. no typos. 
            3. Respect physical features and realism. 
            4. Keep colors natural but clean (clinical aesthetic).`;

            let success = false;
            for (const mName of modelNames) {
                try {
                    const model = userGenAI.getGenerativeModel({
                        model: mName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ],
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                        } as any
                    }, { apiVersion: "v1beta" });

                    const result = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: basePrompt }] }]
                    });

                    const response = await result.response;
                    const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);

                    if (part && part.inlineData) {
                        variations.push({
                            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                            angle: target.name
                        });
                        success = true;
                        break;
                    }
                } catch (err: any) {
                    console.error(`Error with clinic model ${mName}:`, err.message);
                }
            }

            if (i < targets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (variations.length === 0) {
            throw new Error("No se pudo generar ningún resultado clínico.");
        }

        return NextResponse.json({ success: true, variations });

    } catch (error: any) {
        console.error("Clinic Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
