"use client";

import { useState } from "react";
import { VIDEO_DURATIONS, VIDEO_STYLES, VIRAL_ANGLES, VideoScript } from "@/lib/types/video";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useKnowledge } from "@/lib/knowledge-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Video,
    Copy,
    Check,
    Loader2,
    Sparkles,
    Clapperboard,
    Play,
    Zap,
    Maximize2,
    MinusSquare,
    PlusSquare
} from "lucide-react";

export default function VideoScriptsPage() {
    const { getKnowledgeContext } = useKnowledge();

    const [productoDescripcion, setProductoDescripcion] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("30s");
    const [selectedStyle, setSelectedStyle] = useState("ugc");
    const [dayWeek, setDayWeek] = useState("");
    const [milestone, setMilestone] = useState("");
    const [selectedAngle, setSelectedAngle] = useState("");
    const [quantity, setQuantity] = useState(3);

    const [isGenerating, setIsGenerating] = useState(false);
    const [scripts, setScripts] = useState<VideoScript[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);


    const handleGenerate = async () => {
        if (!productoDescripcion) {
            setError("Por favor describe tu producto");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setScripts([]);

        try {
            const response = await fetch("/api/generate-scripts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productoDescripcion,
                    duration: selectedDuration,
                    style: selectedStyle,
                    angle: selectedAngle,
                    dayWeek,
                    milestone,
                    quantity,
                    knowledgeContext: getKnowledgeContext()
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al generar guiones");

            setScripts(data.scripts);
        } catch (err: any) {
            setError(err.message || "Error al conectar con la IA");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="max-w-[1440px] mx-auto w-[95%] space-y-8 py-6">
            <div className="border-b border-border/50 pb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Clapperboard className="h-8 w-8 text-primary" /> Scripts de Video Viral
                </h1>
                <p className="text-muted-foreground">
                    Generador de guiones optimizados para retención y viralidad
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-card/50 border-border/50 sticky top-6">
                        <CardHeader className="pb-3 text-center border-b border-border/50">
                            <CardTitle className="text-sm uppercase tracking-widest text-primary font-black">
                                Studio AI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div>
                                <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Producto / Servicio</Label>
                                <Textarea
                                    placeholder="Describe tu producto, beneficios y qué quieres lograr con este video..."
                                    value={productoDescripcion}
                                    onChange={(e) => {
                                        setProductoDescripcion(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    className="bg-background/50 border-border/50 focus:border-primary/50 text-base py-4 transition-all duration-200"
                                    rows={6}
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Estilo de Video</Label>
                                <div className="space-y-2">
                                    {VIDEO_STYLES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedStyle(s.id)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${selectedStyle === s.id
                                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "bg-[#15151A] border-border/50 hover:border-primary/50 text-muted-foreground"
                                                }`}
                                        >
                                            <p className="font-bold text-sm">{s.label}</p>
                                            <p className="text-[10px] opacity-70 leading-tight mt-1">{s.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedStyle === "series" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="mb-1 block text-[10px] font-bold uppercase">Día / Semana Actual</Label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Día 12"
                                                value={dayWeek}
                                                onChange={(e) => setDayWeek(e.target.value)}
                                                className="w-full bg-background/50 border border-border/50 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1 block text-[10px] font-bold uppercase">Hito de Hoy</Label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Vendí $100"
                                                value={milestone}
                                                onChange={(e) => setMilestone(e.target.value)}
                                                className="w-full bg-background/50 border border-border/50 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedStyle === "mixed" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                                    <Label className="block text-xs font-bold uppercase text-muted-foreground flex items-center justify-between">
                                        <span>Seleccionar Ángulo (Opcional)</span>
                                        {selectedAngle && (
                                            <span
                                                className="text-[10px] text-primary cursor-pointer hover:underline"
                                                onClick={(e) => { e.stopPropagation(); setSelectedAngle(""); }}
                                            >
                                                Borrar selección
                                            </span>
                                        )}
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {VIRAL_ANGLES.map((angle) => (
                                            <button
                                                key={angle.id}
                                                onClick={() => setSelectedAngle(selectedAngle === angle.id ? "" : angle.id)}
                                                className={`p-2 rounded-lg text-left border transition-all ${selectedAngle === angle.id
                                                        ? "bg-purple-500/20 border-purple-500 text-purple-200"
                                                        : "bg-[#15151A] border-border/50 text-muted-foreground hover:border-purple-500/50"
                                                    }`}
                                            >
                                                <div className="text-[10px] font-bold leading-tight">{angle.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                    {!selectedAngle && (
                                        <p className="text-[10px] text-muted-foreground italic text-center opacity-70">
                                            Sin selección: La IA generará 3 ángulos diferentes automáticamente.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Duración</Label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {VIDEO_DURATIONS.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => setSelectedDuration(d.id)}
                                                className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${selectedDuration === d.id
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-[#15151A] border-border/50 hover:border-primary/50"
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Cantidad</Label>
                                    <div className="flex items-center justify-between bg-[#15151A] rounded-lg border border-border/50 p-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-1 hover:text-primary transition-colors"
                                        >
                                            <MinusSquare className="h-4 w-4" />
                                        </button>
                                        <span className="font-bold text-sm w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(3, quantity + 1))}
                                            className="p-1 hover:text-primary transition-colors"
                                        >
                                            <PlusSquare className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !productoDescripcion}
                                className="w-full h-14 bg-gradient-to-r from-primary via-purple-600 to-primary background-animate text-lg font-black shadow-xl shadow-primary/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                        PROCESANDO...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-3" />
                                        GENERAR SCRIPTS
                                    </>
                                )}
                            </Button>

                            {error && (
                                <p className="text-[10px] text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-bounce">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Teleprompter Results Area */}
                <div className="lg:col-span-8 space-y-8">
                    {scripts.length === 0 && !isGenerating ? (
                        <div className="h-[600px] flex flex-col items-center justify-center p-20 text-center border-4 border-dashed border-border/20 rounded-[40px] bg-card/5">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                <Video className="h-24 w-24 text-primary relative z-10 opacity-40" />
                            </div>
                            <h3 className="text-3xl font-black mb-4">¿Listo para ser viral?</h3>
                            <p className="text-muted-foreground max-w-md text-lg">
                                Configura tu video y deja que nuestra IA genere guiones diseñados para el algoritmo.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <span className="flex items-center gap-2 text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                                    <Zap className="h-3 w-3" /> RETENCIÓN 98%
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">
                                    <Maximize2 className="h-3 w-3" /> TELEPROMPTER READY
                                </span>
                            </div>
                        </div>
                    ) : isGenerating ? (
                        <div className="space-y-8">
                            {[1, 2].map(i => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="h-12 bg-white/5 rounded-2xl w-1/4" />
                                    <div className="h-[400px] bg-white/5 rounded-[40px]" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-12 pb-20">
                            {scripts.map((script, idx) => (
                                <div key={idx} className="space-y-4 group animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black bg-primary text-primary-foreground px-3 py-1 rounded-full">
                                                SCR {idx + 1}
                                            </span>
                                            <h3 className="text-xl font-black text-white/90 uppercase tracking-tight">
                                                {script.title}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full gap-2 border-border/50 bg-background/50"
                                                onClick={() => setIsZoomed(!isZoomed)}
                                            >
                                                <Maximize2 className="h-4 w-4" />
                                                {isZoomed ? "Fuente Normal" : "Zoom Teleprompter"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full border-border/50 bg-background/50"
                                                onClick={() => copyToClipboard(script.audio_voiceover, idx)}
                                            >
                                                {copiedIndex === idx ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Card className="bg-[#0D0D12] border-border/30 rounded-[40px] shadow-2xl overflow-hidden border-t-2 border-t-primary/20">
                                        <div className="p-8 lg:p-12 relative bg-gradient-to-br from-black to-[#0D0D12]">
                                            {/* Header Info */}
                                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Play className="h-3 w-3" /> Locución</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span>{script.duration_estimate}</span>
                                                </div>
                                            </div>

                                            {/* Main Script */}
                                            <div className="space-y-6">
                                                <div className={`font-medium text-white tracking-tight leading-[1.8] teleprompter-text max-h-[600px] overflow-y-auto pr-8 custom-scrollbar transition-all duration-300 ${isZoomed ? "text-3xl lg:text-4xl" : "text-xl"
                                                    }`}>
                                                    {script.audio_voiceover.split('\n').map((line, i) => {
                                                        const isBlank = line.trim() === "";
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`${isBlank ? "h-8" : "mb-6"} hover:text-primary transition-colors cursor-default`}
                                                            >
                                                                {line}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase">
                                                <span>Listo para grabar • Modo Lectura</span>
                                                {script.hook && <span className="text-primary tracking-widest uppercase">Hook detectado</span>}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .teleprompter-text {
                    font-family: 'Inter', sans-serif;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--primary);
                }
                .background-animate {
                    background-size: 400%;
                    animation: AnimationName 10s ease infinite;
                }
                @keyframes AnimationName {
                    0%, 100% { background-position: 0% 50% }
                    50% { background-position: 100% 50% }
                }
            `}</style>
        </div>
    );
}
