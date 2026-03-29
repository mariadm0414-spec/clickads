"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
// @ts-ignore
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sparkles, Scan, AlertTriangle, CheckCircle, XCircle,
    Loader2, UploadCloud, X, Palette, Type, LayoutTemplate,
    Zap, Target, Smartphone, DollarSign, Lightbulb
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DesgloseItem { score: number; comentario: string; }
interface AnalysisResult {
    scoreTotal: number;
    fortalezas: string[];
    debilidades: string[];
    desglose: {
        disenoYJerarquia: DesgloseItem;
        paletaColores: DesgloseItem;
        copyYOferta: DesgloseItem;
    };
    scrollStopper: { score: number; tieneElementoDisruptivo: boolean; comentario: string; };
    anguloDeVenta: { emocionPrincipal: string; descripcion: string; };
    platformFit: { score: number; esNativo: boolean; zonaSegura: string; comentario: string; };
    claridadOferta: { score: number; ctaVisible: boolean; precioVisible: boolean; comentario: string; };
    quickWins: string[];
}

const scoreColor = (s: number) => s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400";
const progressColor = (s: number) => s >= 80 ? "bg-green-500" : s >= 60 ? "bg-yellow-500" : "bg-red-500";
const badgeVariant = (s: number): "default" | "secondary" | "destructive" => s >= 80 ? "default" : s >= 60 ? "secondary" : "destructive";

function ScoreBar({ score, label }: { score: number; label: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-gray-400">{label}</span>
                <span className={`font-bold ${scoreColor(score)}`}>{score}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${progressColor(score)}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${ok ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
            {ok ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {label}
        </span>
    );
}

export default function CreativeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const dropped = acceptedFiles[0];
        if (dropped) {
            setFile(dropped);
            setPreview(URL.createObjectURL(dropped));
            setError(null);
            setResult(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'image/*': [] }, maxFiles: 1
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!file) { setError("Por favor sube una imagen."); return; }
        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const response = await fetch("/api/analyze-creative", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: reader.result }),
                });
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || `Error del Servidor: ${response.status}`);
                }
                setResult(await response.json());
            } catch (err: any) {
                setError(err.message || "Error al conectar con el servidor.");
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.onerror = () => { setError("Error al leer el archivo."); setIsAnalyzing(false); };
    };

    return (
        <div className="max-w-[1440px] mx-auto p-8 space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                    <Scan className="h-10 w-10 text-primary" />
                    Análisis de Creativos PRO
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Auditoría completa de Performance Marketing: Gancho, Ángulo de Venta, Platform Fit y más.
                </p>
            </div>

            <div className="space-y-12">
                {/* Upload Card */}
                <Card className="bg-[#15151A] border-white/10 max-w-3xl mx-auto">
                    <CardHeader className="text-center pb-2"><CardTitle>Sube tu Creativo</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {!file ? (
                            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}>
                                <input {...getInputProps()} />
                                <div className="bg-primary/10 p-3 rounded-full mb-3"><UploadCloud className="h-6 w-6 text-primary" /></div>
                                <p className="font-medium text-white text-sm">{isDragActive ? "Suelta aquí..." : "Arrastra tu imagen (.jpg, .png)"}</p>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                <button onClick={removeFile} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white p-1 rounded-full z-10 transition-colors"><X className="h-4 w-4" /></button>
                                <div className="h-64 w-full flex items-center justify-center bg-black/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertTriangle className="h-4 w-4 shrink-0" />{error}
                            </div>
                        )}
                        <Button className="w-full h-12 font-black text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={handleAnalyze} disabled={isAnalyzing || !file}>
                            {isAnalyzing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analizando...</> : <><Sparkles className="mr-2 h-5 w-5" /> ANALIZAR CREATIVO PRO</>}
                        </Button>
                    </CardContent>
                </Card>

                {/* Skeleton */}
                {isAnalyzing && !result && (
                    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
                        <Skeleton className="h-36 w-full rounded-xl bg-white/5" />
                        <div className="grid md:grid-cols-2 gap-6"><Skeleton className="h-52 rounded-xl bg-white/5" /><Skeleton className="h-52 rounded-xl bg-white/5" /></div>
                        <div className="grid md:grid-cols-3 gap-5"><Skeleton className="h-40 rounded-xl bg-white/5" /><Skeleton className="h-40 rounded-xl bg-white/5" /><Skeleton className="h-40 rounded-xl bg-white/5" /></div>
                        <div className="grid md:grid-cols-2 gap-6"><Skeleton className="h-44 rounded-xl bg-white/5" /><Skeleton className="h-44 rounded-xl bg-white/5" /></div>
                        <Skeleton className="h-36 w-full rounded-xl bg-white/5" />
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5">

                        {/* ── SCORE TOTAL ── */}
                        <Card className="bg-[#15151A] border-white/10">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-primary/30 bg-primary/5 shadow-lg shadow-primary/10">
                                        <span className={`text-5xl font-black ${scoreColor(result.scoreTotal)}`}>{result.scoreTotal}</span>
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Score</span>
                                    </div>
                                    <div className="flex-1 w-full space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-semibold text-white">Potencial de Conversión</span>
                                                <span className={`text-sm font-black ${scoreColor(result.scoreTotal)}`}>{result.scoreTotal}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ${progressColor(result.scoreTotal)}`} style={{ width: `${result.scoreTotal}%` }} />
                                            </div>
                                        </div>
                                        <Badge variant={badgeVariant(result.scoreTotal)} className="text-sm px-3 py-1">
                                            {result.scoreTotal >= 80 ? "✅ Creativo Fuerte" : result.scoreTotal >= 60 ? "⚠️ Necesita Mejoras" : "❌ Creativo Débil"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── FORTALEZAS / DEBILIDADES ── */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-[#15151A] border-green-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-green-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <CheckCircle className="h-5 w-5" /> Fortalezas
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-green-500/10 mb-4" />
                                <CardContent className="space-y-3">
                                    {result.fortalezas.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /><span>{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card className="bg-[#15151A] border-red-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-red-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <XCircle className="h-5 w-5" /> Debilidades
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-red-500/10 mb-4" />
                                <CardContent className="space-y-3">
                                    {result.debilidades.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /><span>{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── DESGLOSE TÉCNICO ── */}
                        <div>
                            <h3 className="text-base font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <LayoutTemplate className="h-5 w-5 text-primary" /> Desglose Técnico
                            </h3>
                            <div className="grid md:grid-cols-3 gap-5">
                                {[
                                    { label: "Diseño y Jerarquía", icon: <LayoutTemplate className="h-4 w-4 text-purple-400" />, data: result.desglose.disenoYJerarquia, border: "border-purple-500/20" },
                                    { label: "Paleta de Colores", icon: <Palette className="h-4 w-4 text-blue-400" />, data: result.desglose.paletaColores, border: "border-blue-500/20" },
                                    { label: "Copy y Oferta", icon: <Type className="h-4 w-4 text-orange-400" />, data: result.desglose.copyYOferta, border: "border-orange-500/20" },
                                ].map((item, i) => (
                                    <Card key={i} className={`bg-[#15151A] border ${item.border}`}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">{item.icon}<CardTitle className="text-sm font-bold text-white">{item.label}</CardTitle></div>
                                                <Badge variant={badgeVariant(item.data.score)} className="text-sm font-black">{item.data.score}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${progressColor(item.data.score)}`} style={{ width: `${item.data.score}%` }} />
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">{item.data.comentario}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* ── SCROLL STOPPER + ÁNGULO DE VENTA ── */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Scroll Stopper */}
                            <Card className="bg-[#15151A] border-yellow-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-yellow-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <Zap className="h-5 w-5" /> Scroll-Stopper
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-yellow-500/10 mb-4" />
                                <CardContent className="space-y-4">
                                    <ScoreBar score={result.scrollStopper.score} label="Poder de Atención" />
                                    <StatusPill ok={result.scrollStopper.tieneElementoDisruptivo} label={result.scrollStopper.tieneElementoDisruptivo ? "Elemento disruptivo detectado" : "Sin elemento disruptivo"} />
                                    <p className="text-xs text-gray-400 leading-relaxed">{result.scrollStopper.comentario}</p>
                                </CardContent>
                            </Card>

                            {/* Ángulo de Venta */}
                            <Card className="bg-[#15151A] border-pink-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-pink-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <Target className="h-5 w-5" /> Ángulo de Venta
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-pink-500/10 mb-4" />
                                <CardContent className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2">
                                        <Target className="h-4 w-4 text-pink-400" />
                                        <span className="text-sm font-black text-pink-300">{result.anguloDeVenta.emocionPrincipal}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{result.anguloDeVenta.descripcion}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── PLATFORM FIT + CLARIDAD OFERTA ── */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Platform Fit */}
                            <Card className="bg-[#15151A] border-cyan-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-cyan-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <Smartphone className="h-5 w-5" /> Platform Fit
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-cyan-500/10 mb-4" />
                                <CardContent className="space-y-4">
                                    <ScoreBar score={result.platformFit.score} label="Adaptación a Red Social" />
                                    <div className="flex gap-2 flex-wrap">
                                        <StatusPill ok={result.platformFit.esNativo} label={result.platformFit.esNativo ? "Contenido Nativo" : "Parece Banner"} />
                                        <StatusPill ok={result.platformFit.zonaSegura.includes("OK")} label={`Zona Segura: ${result.platformFit.zonaSegura.includes("OK") ? "OK" : "RIESGO"}`} />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{result.platformFit.comentario}</p>
                                </CardContent>
                            </Card>

                            {/* Claridad de Oferta */}
                            <Card className="bg-[#15151A] border-emerald-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-emerald-400 flex items-center gap-2 text-base uppercase tracking-wider">
                                        <DollarSign className="h-5 w-5" /> Claridad de Oferta
                                    </CardTitle>
                                </CardHeader>
                                <Separator className="bg-emerald-500/10 mb-4" />
                                <CardContent className="space-y-4">
                                    <ScoreBar score={result.claridadOferta.score} label="Claridad de Conversión" />
                                    <div className="flex gap-2 flex-wrap">
                                        <StatusPill ok={result.claridadOferta.ctaVisible} label={result.claridadOferta.ctaVisible ? "CTA Visible" : "CTA Ausente"} />
                                        <StatusPill ok={result.claridadOferta.precioVisible} label={result.claridadOferta.precioVisible ? "Precio Visible" : "Precio Ausente"} />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{result.claridadOferta.comentario}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── QUICK WINS ── */}
                        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-primary flex items-center gap-2 text-base uppercase tracking-wider">
                                    <Lightbulb className="h-5 w-5" /> ⚡ Quick Wins — Acciones Inmediatas
                                </CardTitle>
                            </CardHeader>
                            <Separator className="bg-primary/10 mb-4" />
                            <CardContent className="space-y-3">
                                {result.quickWins.map((win, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center">{i + 1}</span>
                                        <span className="text-sm text-gray-200 font-medium">{win}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                    </div>
                )}
            </div>
        </div>
    );
}
