"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, User, Heart, AlertTriangle, Key, Loader2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Avatar {
    nombre: string;
    miedos: string[];
    deseos: string[];
    fraseResonancia: string;
}

interface AvatarResponse {
    avatares: Avatar[];
}

export default function AvatarDiscovererPage() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<AvatarResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) return;
        setIsGenerating(true);
        setResult(null);

        try {
            const res = await fetch("/api/avatars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productDescription: description }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error("Error generating avatars:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto p-8 space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                    <Users className="h-10 w-10 text-primary" />
                    Descubridor de Avatares
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Descubre exactamente a quién le hablas. Conoce sus miedos más profundos y lo que les quita el sueño.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ── INPUT ── */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#15151A] border-white/10 h-full sticky top-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="bg-white/10 p-2 rounded-lg"><Target className="h-5 w-5 text-white" /></span>
                                Tu Producto / Servicio
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-400">
                                Cuéntanos qué vendes y a quién crees que le vendes (o déjalo abierto).
                            </p>
                            <Textarea
                                className="bg-[#0B0B0F] border-white/10 text-white min-h-[200px] resize-none focus-visible:ring-primary/50"
                                placeholder="Ej: Vendo suplementos naturales para dormir mejor, enfocado en gente estresada..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !description.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                            >
                                {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analizando Mercado...</> : <><Users className="mr-2 h-5 w-5 fill-current" /> Encontrar mis 5 Clientes Ideales</>}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* ── OUTPUT RESULTS ── */}
                <div className="lg:col-span-2 space-y-6">
                    {!result && !isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-xl text-center space-y-4 min-h-[400px]">
                            <div className="bg-white/5 p-4 rounded-full"><Users className="h-8 w-8 text-gray-600" /></div>
                            <h3 className="text-xl font-bold text-gray-500">¿Quién es tu cliente ideal?</h3>
                            <p className="text-gray-600 max-w-md">La mayoría de negocios le hablan a "todos" y terminan vendiéndole a "nadie". Vamos a cambiar eso.</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse min-h-[400px]">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-gray-400 font-medium">Segmentando psicográficamente...</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" /> 5 Perfiles Detectados
                                </h3>
                                <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/5">
                                    Alta Rentabilidad
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {result.avatares.map((avatar, i) => (
                                    <Card key={i} className="group overflow-hidden bg-[#15151A] border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <User className="h-24 w-24" />
                                        </div>

                                        <CardHeader className="pb-2 relative z-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {i + 1}
                                                </div>
                                                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 pointer-events-none">
                                                    Avatar
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-black text-white leading-tight">
                                                {avatar.nombre}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-5 relative z-10 pt-4">
                                            {/* Pain & Pleasure */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Sus Miedos
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {avatar.miedos.map((m, idx) => (
                                                            <li key={idx} className="text-gray-400 leading-tight">• {m}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Heart className="h-3 w-3" /> Sus Deseos
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {avatar.deseos.map((d, idx) => (
                                                            <li key={idx} className="text-gray-400 leading-tight">• {d}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Resonance Phrase */}
                                            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 mt-2">
                                                <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Key className="h-3 w-3" /> La Frase que Abre su Mente
                                                </p>
                                                <p className="text-white font-medium italic leading-relaxed">
                                                    "{avatar.fraseResonancia}"
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
