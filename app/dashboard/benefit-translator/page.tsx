"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Sparkles, Frown, Smile, ArrowRight, Loader2 } from "lucide-react";

interface BenefitResponse {
    placer: {
        titulo: string;
        puntos: string[];
    };
    dolor: {
        titulo: string;
        puntos: string[];
    };
    transformacion: string;
}

export default function BenefitTranslatorPage() {
    const [features, setFeatures] = useState("");
    const [result, setResult] = useState<BenefitResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!features.trim()) return;
        setIsGenerating(true);
        setResult(null);

        try {
            const res = await fetch("/api/benefit-translator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error generating benefits:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto p-8 space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                    <Zap className="h-10 w-10 text-primary" />
                    Traductor de Beneficios Pro
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Convierte características técnicas aburridas en beneficios emocionales que venden solos.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ── INPUT ── */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#15151A] border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-white/10 p-2 rounded-lg"><Sparkles className="h-5 w-5 text-white" /></span>
                                Tu Producto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-400">
                                Describe qué hace tu producto (características técnicas, funciones, materiales, etc.)
                            </p>
                            <Textarea
                                className="bg-[#0B0B0F] border-white/10 text-white min-h-[200px] resize-none focus-visible:ring-primary/50"
                                placeholder="Ej: Audífonos con cancelación de ruido activa, batería de 30 horas, almohadillas de memoria..."
                                value={features}
                                onChange={(e) => setFeatures(e.target.value)}
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !features.trim()}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                            >
                                {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Traduciendo...</> : <><Zap className="mr-2 h-5 w-5 fill-current" /> Generar Ángulos de Venta</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* ── OUTPUT RESULTS ── */}
                <div className="lg:col-span-2 space-y-6">
                    {!result && !isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-xl text-center space-y-4">
                            <div className="bg-white/5 p-4 rounded-full"><Zap className="h-8 w-8 text-gray-600" /></div>
                            <h3 className="text-xl font-bold text-gray-500">Esperando tu input...</h3>
                            <p className="text-gray-600 max-w-md">Escribe las características a la izquierda y la IA detectará los gatillos emocionales ocultos.</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-gray-400 font-medium">Analizando psicología de ventas...</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

                            {/* TRANSFORMACIÓN (HERO) */}
                            <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/20 to-purple-900/40 border border-purple-500/30 p-8 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                    <Sparkles className="h-4 w-4" /> La Gran Transformación
                                </h3>
                                <p className="text-2xl md:text-3xl font-black text-white leading-tight">
                                    "{result.transformacion}"
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* PLACER (GREEN/GOLD) */}
                                <Card className="bg-[#15151A] border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)] hover:border-green-500/40 transition-colors group">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-green-400 flex items-center gap-2 text-lg uppercase tracking-wide">
                                            <Smile className="h-6 w-6" /> El Deseo (Placer)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <h4 className="font-bold text-white text-lg group-hover:text-green-300 transition-colors">
                                            {result.placer.titulo}
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.placer.puntos.map((point, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                                    <span className="text-green-500 mt-0.5">✨</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* DOLOR (RED) */}
                                <Card className="bg-[#15151A] border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] hover:border-red-500/40 transition-colors group">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-red-400 flex items-center gap-2 text-lg uppercase tracking-wide">
                                            <Frown className="h-6 w-6" /> El Alivio (Dolor)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <h4 className="font-bold text-white text-lg group-hover:text-red-300 transition-colors">
                                            {result.dolor.titulo}
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.dolor.puntos.map((point, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                                    <span className="text-red-500 mt-0.5">🛑</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
