"use client";

import React, { useState, useRef } from "react";
import { Plus, Image as ImageIcon, Sparkles, X, ChevronDown, Layout, Loader2, Download, RefreshCcw } from "lucide-react";

type OutputSize = "Tamaño Original (1792x2400)" | "Facebook/LinkedIn (1200x628)" | "Instagram Cuadrado (1080x1080)" | "Instagram Stories (1080x1920)" | "YouTube/HD (1920x1080)" | "Banner Mediano (300x250)" | "Leaderboard (728x90)" | "Skyscraper (160x600)" | "Personalizado";
type Language = "Español" | "Inglés" | "Portugués";

const SIZES: OutputSize[] = [
    "Tamaño Original (1792x2400)",
    "Facebook/LinkedIn (1200x628)",
    "Instagram Cuadrado (1080x1080)",
    "Instagram Stories (1080x1920)",
    "YouTube/HD (1920x1080)",
    "Banner Mediano (300x250)",
    "Leaderboard (728x90)",
    "Skyscraper (160x600)",
    "Personalizado"
];

const CATEGORIES = ["Hero", "Oferta", "Antes/Después", "Beneficios", "Tabla Comparativa", "Prueba de Autoridad", "Testimonios", "Modo de Uso"];

const DUMMY_TEMPLATES: Record<string, { id: string; name: string; bg: string }[]> = {
    "Hero": [
        { id: "h1", name: "Impacto Visual", bg: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80')" },
        { id: "h2", name: "Rendimiento Máximo", bg: "url('https://images.unsplash.com/photo-1526506114869-c6e31761e053?w=400&q=80')" },
        { id: "h3", name: "Energía Sostenida", bg: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80')" },
        { id: "h4", name: "Recuperación Rápida", bg: "url('https://images.unsplash.com/photo-1541534741688-6078c6bbf0f5?w=400&q=80')" },
        { id: "h5", name: "Fuerza Absoluta", bg: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80')" }
    ],
    "Oferta": [
        { id: "o1", name: "Escasez Relámpago", bg: "url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&q=80')" },
        { id: "o2", name: "Descuento VIP", bg: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80')" },
        { id: "o3", name: "Black Friday", bg: "url('https://images.unsplash.com/photo-1603532648955-02a70089d91c?w=400&q=80')" },
        { id: "o4", name: "Paquete Mayorista", bg: "url('https://images.unsplash.com/photo-1556740738-f6d8c36195fb?w=400&q=80')" }
    ],
    "Antes/Después": [
        { id: "ad1", name: "Transformación", bg: "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80')" },
        { id: "ad2", name: "Evolución", bg: "url('https://images.unsplash.com/photo-1522898467123-64a6f23dbb77?w=400&q=80')" },
        { id: "ad3", name: "Progreso Total", bg: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80')" }
    ],
    "Beneficios": [
        { id: "b1", name: "Lista Premium", bg: "url('https://images.unsplash.com/photo-1507398941214-3a24e5ce6615?w=400&q=80')" },
        { id: "b2", name: "Grid Nutricional", bg: "url('https://images.unsplash.com/photo-1493612278195-61f49ce3240b?w=400&q=80')" },
        { id: "b3", name: "Ingredientes", bg: "url('https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&q=80')" },
        { id: "b4", name: "Fórmula Activa", bg: "url('https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80')" }
    ],
    "Tabla Comparativa": [
        { id: "tc1", name: "Versus Directo", bg: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80')" },
        { id: "tc2", name: "Nosotros vs Ellos", bg: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80')" }
    ],
    "Prueba de Autoridad": [
        { id: "pa1", name: "Logos Media", bg: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80')" },
        { id: "pa2", name: "Certificaciones", bg: "url('https://images.unsplash.com/photo-1556761175-5973dd0f32d7?w=400&q=80')" }
    ],
    "Testimonios": [
        { id: "t1", name: "Reseña Elite", bg: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')" },
        { id: "t2", name: "Usuario Feliz", bg: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80')" },
        { id: "t3", name: "Historia de Éxito", bg: "url('https://images.unsplash.com/photo-1513258496099-48162023ceaec?w=400&q=80')" }
    ],
    "Modo de Uso": [
        { id: "mu1", name: "Pasos 1-2-3", bg: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80')" },
        { id: "mu2", name: "Rutina Diaria", bg: "url('https://images.unsplash.com/photo-1461511669078-d92bf28a8d11?w=400&q=80')" }
    ]
};

export default function LandingBuilder() {
    const [images, setImages] = useState<(string | null)[]>([null, null, null]);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Hero");
    const [outputSize, setOutputSize] = useState<OutputSize>("Tamaño Original (1792x2400)");
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [language, setLanguage] = useState<Language>("Español");

    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleGenerate = async () => {
        const userStr = localStorage.getItem("clickads_user");
        let userEmail = "";
        if (userStr) {
            try { userEmail = JSON.parse(userStr).email || ""; } catch (e) { }
        }
        const apiKey = (userEmail ? localStorage.getItem(`clickads_api_key_${userEmail}`) : null) || localStorage.getItem("clickads_api_key_global");

        if (!apiKey) {
            alert("⚠️ Por favor configura tu API Key de Gemini en Configuración.");
            return;
        }
        if (!selectedTemplate) {
            alert("Selecciona una plantilla primero.");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            const mediaParts: any[] = [];
            images.filter(Boolean).forEach((img: any) => {
                const data = img.includes(",") ? img.split(",")[1] : img;
                const mimeType = img.includes("image/png") ? "image/png" : "image/jpeg";
                mediaParts.push({ inlineData: { data, mimeType } });
            });

            const prompt = `Diseña una sección de landing page. Categoría: ${activeCategory}. Plantilla de referencia: ${selectedTemplate.name}. Tamaño: ${outputSize}. Idioma: ${language}. Crea un diseño premium, profesional y persuasivo.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            } else {
                throw new Error("No se pudo generar la imagen.");
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadSection = () => {
        if (!resultImage) return;
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = `landing_${activeCategory.toLowerCase()}_section.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImages = [...images];
                newImages[index] = event.target?.result as string;
                setImages(newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const templatesToShow = DUMMY_TEMPLATES[activeCategory as keyof typeof DUMMY_TEMPLATES] || [];

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Inter', sans-serif", color: "#E5E7EB" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <p style={{ color: "#9CA3AF", fontSize: "16px" }}>Crea secciones de landing de alto rendimiento con IA. Selecciona una plantilla, sube tu producto y genera. Te quedan 2 de 3 secciones gratis.</p>
            </div>

            <div style={{ background: "#18181B", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                {/* Header */}
                {!resultImage && (
                    <>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#fff" }}>Generar Sección de Landing</h2>
                                <p style={{ margin: 0, color: "#9CA3AF", fontSize: "14px", marginTop: "4px" }}>Selecciona una plantilla de referencia y sube de 1 a 3 fotos de tu producto.</p>
                            </div>
                        </div>

                        {/* Main Two Columns */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                            {/* Photos Column */}
                            <div>
                                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>Fotos del Producto</div>
                                    <div style={{ fontSize: "12px", color: "#6B7280" }}>(agrega de 1 a 3 fotos de tu producto)</div>
                                </div>
                                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => fileInputRefs[idx].current?.click()}
                                            style={{
                                                width: "100px",
                                                height: "130px",
                                                border: "1px dashed rgba(255,255,255,0.15)",
                                                borderRadius: "12px",
                                                background: "rgba(255,255,255,0.02)",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                position: "relative",
                                                overflow: "hidden",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {img ? (
                                                <>
                                                    <img src={img} alt={`Imagen ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    <div onClick={(e) => removeImage(idx, e)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", borderRadius: "50%", padding: "4px", cursor: "pointer" }}>
                                                        <X size={12} color="#fff" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={20} color="#6B7280" style={{ marginBottom: "8px" }} />
                                                    <span style={{ fontSize: "12px", color: "#6B7280" }}>Imagen {idx + 1}</span>
                                                </>
                                            )}
                                            <input type="file" ref={fileInputRefs[idx]} onChange={(e) => handleImageUpload(idx, e)} style={{ display: "none" }} accept="image/*" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Template Column */}
                            <div>
                                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>Plantilla</div>
                                    <div style={{ fontSize: "12px", color: "#6B7280" }}>(selecciona de la galería)</div>
                                </div>
                                <div
                                    onClick={() => setIsModalOpen(true)}
                                    style={{
                                        background: "rgba(139, 92, 246, 0.05)",
                                        border: "1px solid #8B5CF6",
                                        borderRadius: "12px",
                                        height: "130px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(139, 92, 246, 0.05)"}
                                >
                                    {selectedTemplate ? (
                                        <div style={{ width: "100%", height: "100%", borderRadius: "10px", backgroundImage: selectedTemplate.bg, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", textAlign: "center", padding: "0" }}>
                                            <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", width: "100%", padding: "20px 10px 10px", borderRadius: "0 0 10px 10px" }}>
                                                {selectedTemplate.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                                                <ImageIcon size={24} color="#fff" />
                                            </div>
                                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>Seleccionar Plantilla</div>
                                            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>de la Galería EcomMagic</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Output Settings */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", background: "#27272A", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ position: "relative" }}>
                                <div style={{ fontSize: "13px", color: "#D4D4D8", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "14px" }}>↗</span> Tamaño de Salida
                                </div>
                                <div
                                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                                    style={{ background: "#18181B", border: isSizeOpen ? "1px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                                >
                                    {outputSize}
                                    <ChevronDown size={16} color="#9CA3AF" />
                                </div>
                                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px" }}>
                                    {outputSize.includes("(") ? outputSize.split("(")[1].replace(")", " px") : ""}
                                </div>

                                {/* Dropdown Menu */}
                                {isSizeOpen && (
                                    <div style={{ position: "absolute", top: "75px", left: 0, width: "100%", background: "#27272A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 10, maxHeight: "250px", overflowY: "auto" }}>
                                        {SIZES.map(s => (
                                            <div
                                                key={s}
                                                onClick={() => { setOutputSize(s); setIsSizeOpen(false); }}
                                                style={{ padding: "10px 16px", fontSize: "14px", color: "#E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", background: s === outputSize ? "rgba(255,255,255,0.05)" : "transparent" }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = s === outputSize ? "rgba(255,255,255,0.05)" : "transparent"}
                                            >
                                                {s === outputSize && <span style={{ color: "#D97706" }}>✓</span>}
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div style={{ fontSize: "13px", color: "#D4D4D8", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "14px" }}>🌐</span> Idioma de Salida
                                </div>
                                <div style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                                    {language}
                                    <ChevronDown size={16} color="#9CA3AF" />
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: isGenerating ? "#4C1D95" : "#6B21A8", // purple hover background in ecom-magic
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "15px",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: isGenerating ? "wait" : "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => { if (!isGenerating) e.currentTarget.style.background = "#581C87" }}
                            onMouseLeave={(e) => { if (!isGenerating) e.currentTarget.style.background = "#6B21A8" }}
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {isGenerating ? "Generando Magia..." : "Generar Sección"}
                        </button>
                        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#6B7280" }}>
                            2 de 3 secciones utilizadas este per...
                        </div>
                    </>
                )}

                {/* Result Block */}
                {resultImage && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                        <div style={{ width: "100%", maxWidth: "600px", background: "#09090B", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                            <img src={resultImage} alt="Sección de Landing" style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "600px" }}>
                            <button
                                onClick={downloadSection}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    background: "#8B5CF6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#8B5CF6"}
                            >
                                <Download size={18} /> Descargar Sección
                            </button>
                            <button
                                onClick={() => setResultImage(null)}
                                style={{
                                    padding: "16px 24px",
                                    background: "#27272A",
                                    color: "#fff",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#3F3F46"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#27272A"}
                            >
                                <RefreshCcw size={18} /> Generar Otra
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Template Selection Modal */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#18181B", width: "90%", maxWidth: "1000px", height: "80vh", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        {/* Modal Header */}
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px" }}>
                                    <Layout size={20} color="#fff" />
                                </div>
                                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 600 }}>Galería de Diseños</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "4px" }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Navigation */}
                        <div style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto", display: "flex", gap: "24px", alignItems: "center", minHeight: "60px" }}>
                            {CATEGORIES.map(cat => (
                                <div
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "100px",
                                        background: activeCategory === cat ? "#8B5CF6" : "transparent",
                                        color: activeCategory === cat ? "#fff" : "#9CA3AF",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>

                        {/* Modal Body / Gallery */}
                        <div style={{ padding: "32px 24px", flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                            {templatesToShow.length > 0 ? templatesToShow.map((tpl) => (
                                <div
                                    key={tpl.id}
                                    onClick={() => setSelectedTemplate(tpl)}
                                    style={{
                                        aspectRatio: "3/4",
                                        borderRadius: "12px",
                                        backgroundImage: tpl.bg,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        cursor: "pointer",
                                        border: selectedTemplate?.id === tpl.id ? "3px solid #8B5CF6" : "3px solid transparent",
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: "15px",
                                        textAlign: "center",
                                        padding: "0",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                        position: "relative",
                                        transition: "transform 0.2s",
                                        overflow: "hidden"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))", width: "100%", padding: "40px 12px 16px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                                        {tpl.name}
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
                                    No hay diseños disponibles en esta categoría.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ color: "#9CA3AF", fontSize: "14px" }}>
                                Haz clic en un template para seleccionarlo
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={!selectedTemplate}
                                    style={{
                                        padding: "10px 20px",
                                        background: selectedTemplate ? "#6B21A8" : "#3F3F46",
                                        border: "none",
                                        color: selectedTemplate ? "#fff" : "#A1A1AA",
                                        borderRadius: "8px",
                                        cursor: selectedTemplate ? "pointer" : "not-allowed",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {selectedTemplate && <span>✓</span>} Usar Este Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
