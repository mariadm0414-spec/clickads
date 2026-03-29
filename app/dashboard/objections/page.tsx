"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, MessageCircleQuestion, AlertCircle, Loader2, Sword } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Objection {
    tipo: string;
    duda: string;
    script: string;
}

interface ObjectionResponse {
    objeciones: Objection[];
}

export default function ObjectionDestroyerPage() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<ObjectionResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) return;
        setIsGenerating(true);
        setResult(null);

        try {
            const res = await fetch("/api/objections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error generating objections:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto p-8 space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                    <Sword className="h-10 w-10 text-primary" />
                    Destructor de Objeciones
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Anticípate al "NO" del cliente. Identifica sus miedos ocultos y destrúyelos antes de que aparezcan.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ── INPUT ── */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#15151A] border-white/10 h-full sticky top-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-white/10 p-2 rounded-lg"><MessageCircleQuestion className="h-5 w-5 text-white" /></span>
                                Tu Oferta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-400">
                                Describe tu producto y la oferta irresistible (precio, garantía, bonos, etc.)
                            </p>
                            <Textarea
                                className="bg-[#0B0B0F] border-white/10 text-white min-h-[200px] resize-none focus-visible:ring-primary/50"
                                placeholder="Ej: Curso de yoga online por $47 con garantía de 30 días y acceso de por vida + bonus de nutrición..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !description.trim()}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                            >
                                {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analizando Miedos...</> : <><Sword className="mr-2 h-5 w-5 fill-current" /> Identificar y Destruir</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* ── OUTPUT RESULTS ── */}
                <div className="lg:col-span-2 space-y-6">
                    {!result && !isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-xl text-center space-y-4 min-h-[400px]">
                            <div className="bg-white/5 p-4 rounded-full"><Sword className="h-8 w-8 text-gray-600" /></div>
                            <h3 className="text-xl font-bold text-gray-500">¿Qué detiene a tus clientes?</h3>
                            <p className="text-gray-600 max-w-md">Cuéntanos qué vendes y te diremos exactamente por qué no compran (y cómo solucionarlo).</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse min-h-[400px]">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-gray-400 font-medium">Leyendo la mente de tu cliente ideal...</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" /> 7 Barreras Detectadas
                                </h3>
                                <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/5">
                                    Scripts Listos para Copiar
                                </Badge>
                            </div>

                            <div className="grid gap-6">
                                {result.objeciones.map((obj, i) => (
                                    <div key={i} className="group relative overflow-hidden rounded-xl bg-[#15151A] border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 via-transparent to-green-500 opacity-50" />

                                        <div className="grid md:grid-cols-5 h-full">
                                            {/* Left: Fear/Doubt */}
                                            <div className="md:col-span-2 p-6 bg-white/[0.02] border-r border-white/5 flex flex-col justify-center space-y-3">
                                                <Badge className="w-fit bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
                                                    {obj.tipo}
                                                </Badge>
                                                <div className="font-bold text-gray-300 italic text-sm md:text-base">
                                                    "{obj.duda}"
                                                </div>
                                            </div>

                                            {/* Right: Response/Script */}
                                            <div className="md:col-span-3 p-6 flex flex-col justify-center space-y-4 bg-[#0B0B0F]/50">
                                                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                    <ShieldCheck className="h-4 w-4" /> Script Neutralizador
                                                </div>
                                                <p className="text-white font-medium leading-relaxed">
                                                    {obj.script}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-fit text-xs text-gray-500 hover:text-white hover:bg-white/10 self-end"
                                                    onClick={() => navigator.clipboard.writeText(obj.script)}
                                                >
                                                    Copiar Script
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
