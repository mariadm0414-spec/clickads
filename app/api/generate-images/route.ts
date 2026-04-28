import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            imageBase64,
            mimeType,
            descripcion,
            avatar,
            cantidad = 4,
            estilo,
            tipoCreativo,
            plataforma,
            coloresMarca,
        } = body;

        if (!imageBase64) {
            return NextResponse.json(
                { error: "No se recibió imagen del producto" },
                { status: 400 }
            );
        }

        // Try Gemini 2.0 Flash Exp with image generation
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            }, { apiVersion: "v1" });

            // Prepare Avatar Context if available
            const avatarContext = avatar ? `
                CLIENTE IDEAL (AVATAR):
                - Nombre: ${avatar.name}
                - Dolor principal: ${avatar.mainPain}
                - Deseo principal: ${avatar.mainDesire}
                - Redes sociales: ${avatar.socialNetworks?.join(", ")}
            ` : "";

            // Handle "Automático" Style
            const stylePrompt = estilo === "automatico"
                ? "Decide el mejor estilo visual (minimalista, bold, elegante, etc.) que mejor convierta para este producto y avatar."
                : `Estilo: ${estilo}`;

            // Generate variations
            const variationTypes = [
                "Fondo limpio profesional",
                "Lifestyle/Contexto de uso",
                "Colores de marca",
                "Composición creativa",
                "Enfoque en beneficio",
            ].slice(0, cantidad);

            const generatedImages = await Promise.all(
                variationTypes.map(async (type, index) => {
                    try {
                        const prompt = `
                            Crea una imagen publicitaria profesional basada en este producto.
                            ${stylePrompt}
                            Tipo de creativo: ${tipoCreativo}
                            Plataforma: ${plataforma}
                            ${avatarContext}
                            Variación: ${type}
                            
                            INDICACIONES:
                            - El producto debe ser el protagonista absoluto.
                            - Usa los colores de marca: ${coloresMarca?.join(", ") || "colores coordinados"}.
                            - Calidad de fotografía comercial de alta gama.
                            - NO incluir texto sobre la imagen.
                            
                            Propuesta específica para esta variación (${index + 1}):
                            ${index === 0 ? "Fondo de estudio limpio y minimalista." : ""}
                            ${index === 1 ? "Producto en un entorno de uso real y natural." : ""}
                            ${index === 2 ? "Uso predominante de los colores de la marca en el fondo y elementos." : ""}
                            ${index === 3 ? "Composición artística y moderna con elementos gráficos." : ""}
                            ${index === 4 ? "Enfoque en resaltar el beneficio principal del producto visualmente." : ""}
                        `;

                        const result = await model.generateContent([
                            {
                                inlineData: {
                                    data: imageBase64,
                                    mimeType: mimeType,
                                },
                            },
                            prompt,
                        ]);

                        const response = await result.response;
                        const parts = response.candidates?.[0]?.content?.parts || [];
                        const imagePart = parts.find((part: any) => part.inlineData);

                        if (imagePart?.inlineData) {
                            return {
                                imageBase64: imagePart.inlineData.data,
                                mimeType: imagePart.inlineData.mimeType,
                                variationType: type,
                            };
                        }

                        return {
                            imageBase64,
                            mimeType,
                            variationType: type,
                            isFallback: true,
                        };
                    } catch (err) {
                        console.error(`Error generating variation ${index}:`, err);
                        return {
                            imageBase64,
                            mimeType,
                            variationType: type,
                            isFallback: true,
                        };
                    }
                })
            );

            const hasFallbacks = generatedImages.some((img) => img.isFallback);

            return NextResponse.json({
                success: true,
                images: generatedImages,
                warning: hasFallbacks
                    ? "Algunas imágenes no pudieron generarse con IA. Mostrando imagen original."
                    : null,
            });
        } catch (error: any) {
            console.error("Error with Gemini image generation:", error);

            const fallbackImages = Array.from({ length: cantidad }).map((_, i) => ({
                imageBase64,
                mimeType,
                variationType: `Variación ${i + 1}`,
                isFallback: true,
            }));

            return NextResponse.json({
                success: true,
                images: fallbackImages,
                warning: "Generación con IA no disponible. Mostrando imagen original.",
            });
        }
    } catch (error: any) {
        console.error("Error in generate-images:", error);
        return NextResponse.json(
            {
                error: "Error al generar creativos",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
