"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Image as ImageIcon, Sparkles, X, ChevronRight, Download, ArrowLeft, Loader2, ChevronDown } from "lucide-react";

const RESEARCH_FIELDS = [
    { id: 1, title: "Nombre y Descripcion del Producto", desc: "Nombre comercial del producto, tipo de producto y descripción general de sus características principales." },
    { id: 2, title: "Promesa Central del Producto", desc: "La transformación o resultado principal que el producto promete al usuario de forma realista." },
    { id: 3, title: "Beneficios Específicos", desc: "Listado completo de todos los beneficios: físicos, estéticos, funcionales y emocionales." },
    { id: 4, title: "Características Clave del Producto", desc: "Datos técnicos, ingredientes, materiales, tamaños, funciones y componentes del producto." },
    { id: 5, title: "Tipo de Solución", desc: "Clasifica si el producto es una solución preventiva, correctiva, de mantenimiento, alivio u optimización." },
    { id: 6, title: "Mecanismo Diferencial Funcional", desc: "Cómo funciona el producto y qué lo hace diferente o más eficaz frente a otras opciones." },
    { id: 7, title: "Problemas que Resuelve", desc: "Todos los problemas, frustraciones o dificultades que el producto ayuda a resolver." },
    { id: 8, title: "Anhelos o Deseos del Consumidor", desc: "Deseos profundos y aspiraciones del usuario: cómo quiere verse, sentirse o ser percibido." },
    { id: 9, title: "Dolores Profundos del Consumidor", desc: "Frustraciones y dificultades profundas que experimenta el usuario y que el producto soluciona." },
    { id: 10, title: "Miedos Ocultos del Consumidor", desc: "Preocupaciones internas que el consumidor no expresa pero influyen en su decisión de compra." },
    { id: 11, title: "Resultado Principal Deseado", desc: "El resultado final más importante que el usuario realmente quiere lograr con el producto." },
    { id: 12, title: "Tipo de Transformación", desc: "Define si la transformación es física, estética, funcional, emocional o una combinación." },
    { id: 13, title: "Transformación de Antes y Después", desc: "Cómo se siente el usuario antes de usar el producto y cómo se sentiría después." },
    { id: 14, title: "Naturaleza del Valor", desc: "Tipo de valor que entrega: ahorro de tiempo, dinero, comodidad, mejora estética o bienestar." },
    { id: 15, title: "Modo de Uso", desc: "Cómo se utiliza o aplica el producto, frecuencia y cómo se integra en la rutina diaria." },
    { id: 16, title: "Errores de Uso", desc: "Errores comunes al usar este tipo de producto que podrían impedir buenos resultados." },
    { id: 17, title: "Restricciones y Advertencias", desc: "Advertencias éticas, regulatorias o limitaciones importantes del producto." },
    { id: 18, title: "Categoría Mental del Producto", desc: "Cómo clasifica el consumidor este producto en su mente: herramienta, tratamiento, accesorio, etc." },
    { id: 19, title: "Criterios de Decisión del Comprador", desc: "Los factores más importantes que el comprador evalúa para decidir si compra o no." },
    { id: 20, title: "Disparadores de Compra", desc: "Situaciones, momentos o eventos que activan la necesidad de buscar o comprar el producto." },
    { id: 21, title: "Objeciones Comunes del Consumidor", desc: "Dudas, miedos o creencias que frenan la compra: económicas, emocionales o psicológicas." },
    { id: 22, title: "Barrera Principal de Acción", desc: "La razón principal por la que el consumidor podría posponer la compra." },
    { id: 23, title: "Nivel de Explicación Necesario", desc: "Qué tan fácil es entender el producto para comprarlo y usarlo correctamente." },
    { id: 24, title: "Señales de Credibilidad", desc: "Qué necesita ver el consumidor para confiar en que el producto vale la pena." },
    { id: 25, title: "Evidencias o Pruebas", desc: "Estudios, testimonios o argumentos que respaldan la efectividad del producto." },
    { id: 26, title: "Factor de Gratificación", desc: "Si el producto ofrece resultados inmediatos, progresivos o una combinación de ambos." },
    { id: 27, title: "Oportunidades Estratégicas", desc: "Oportunidades prácticas de marketing y comunicación basadas en el análisis completo." },
    { id: 28, title: "Insights Psicológicos Clave", desc: "Los factores psicológicos más importantes que explican por qué alguien compraría este producto." },
    { id: 29, title: "Resumen", desc: "Síntesis completa del producto: qué es, cómo funciona, a quién ayuda y su propuesta de valor." },
    { id: 30, title: "Públicos Objetivos", desc: "Todos los perfiles de usuarios que podrían beneficiarse de este producto." }
];

interface ProductResearchData {
    id: string;
    name: string;
    description: string;
    image: string | null;
    createdAt: number;
    results: string[]; // array of 30 answers
}

export default function ProductResearch() {
    const [researches, setResearches] = useState<ProductResearchData[]>([]);
    const [selectedResearch, setSelectedResearch] = useState<ProductResearchData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Form State
    const [newProductName, setNewProductName] = useState("");
    const [newProductDesc, setNewProductDesc] = useState("");
    const [newProductImage, setNewProductImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(1); // Open first by default

    useEffect(() => {
        const saved = localStorage.getItem("clickads_researches");
        if (saved) {
            setResearches(JSON.parse(saved));
        }
    }, []);

    const saveResearches = (data: ProductResearchData[]) => {
        setResearches(data);
        localStorage.setItem("clickads_researches", JSON.stringify(data));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewProductImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateResearch = async () => {
        if (!newProductName.trim()) {
            alert("Es necesario un Nombre de Producto.");
            return;
        }

        const userStr = localStorage.getItem("clickads_user");
        let userEmail = "";
        if (userStr) {
            try { userEmail = JSON.parse(userStr).email || ""; } catch (e) { }
        }

        const apiKey = (userEmail ? localStorage.getItem(`clickads_api_key_${userEmail}`) : null) || localStorage.getItem("clickads_api_key_global");

        if (!apiKey) {
            alert("⚠️ Por favor configura tu API Key de Gemini en Configuración para usar la IA.");
            return;
        }

        setIsModalOpen(false);
        setIsGenerating(true);
        setSelectedResearch(null);

        try {
            const res = await fetch("/api/vertex-ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProductName,
                    description: newProductDesc,
                    image: newProductImage,
                    apiKey
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const newId = Math.random().toString(36).substring(7);
            const newResearch: ProductResearchData = {
                id: newId,
                name: newProductName,
                description: newProductDesc,
                image: newProductImage,
                createdAt: Date.now(),
                results: data.results // Array of 30 items
            };

            saveResearches([newResearch, ...researches]);
            setSelectedResearch(newResearch);

            // Re-init state
            setNewProductName("");
            setNewProductDesc("");
            setNewProductImage(null);

        } catch (error: any) {
            alert("Error al generar investigación: " + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const deleteResearch = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de que quieres eliminar esta investigación?")) {
            saveResearches(researches.filter(r => r.id !== id));
            if (selectedResearch?.id === id) setSelectedResearch(null);
        }
    };

    if (isGenerating) {
        return (
            <div style={{ height: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", color: "#E5E7EB" }}>
                <div style={{ position: "relative", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={60} color="#8B5CF6" className="animate-spin" />
                    <Sparkles size={24} color="#D946EF" style={{ position: "absolute", animation: "pulse 2s infinite" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>Generando Investigación Profesional</h2>
                    <p style={{ color: "#9CA3AF" }}>El analista experto de IA está estudiando el mercado... (Esto puede tomar hasta 30 segundos)</p>
                </div>
            </div>
        );
    }

    if (selectedResearch) {
        return (
            <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "100px", fontFamily: "'Inter', sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        <button
                            onClick={() => setSelectedResearch(null)}
                            style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, padding: "8px 0" }}
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "12px" }}>
                                {selectedResearch.name}
                            </h1>
                            <div style={{ color: "#9CA3AF", fontSize: "14px", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span>Realizado con Gemini Pro</span>
                                <span>•</span>
                                <span>{new Date(selectedResearch.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => window.print()}
                    >
                        <Download size={16} /> Descargar PDF
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {RESEARCH_FIELDS.map((field, index) => {
                        const isOpen = activeAccordion === field.id;
                        const answer = selectedResearch.results[index] || "Generando...";

                        return (
                            <div key={field.id} style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" }}>
                                <div
                                    onClick={() => setActiveAccordion(isOpen ? null : field.id)}
                                    style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isOpen ? "rgba(139, 92, 246, 0.05)" : "transparent", transition: "all 0.2s" }}
                                >
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                                            <div style={{ color: "#8B5CF6", fontWeight: 900, fontSize: "14px", letterSpacing: "1px", background: "rgba(139, 92, 246, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                                                {String(field.id).padStart(2, '0')}
                                            </div>
                                            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: 0 }}>{field.title}</h3>
                                        </div>
                                        <div style={{ color: "#6B7280", fontSize: "14px", marginLeft: "48px" }}>{field.desc}</div>
                                    </div>
                                    <ChevronDown size={20} color="#9CA3AF" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
                                </div>
                                {isOpen && (
                                    <div style={{ padding: "0 24px 32px 72px", color: "#D1D5DB", fontSize: "15px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                                        {answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "100px", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, color: "#fff" }}>Investigación de Producto</h1>
                    <p style={{ color: "#9CA3AF", fontSize: "16px", marginTop: "8px" }}>Organiza tus productos y genera investigaciones profesionales con IA</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: "#8B5CF6", color: "#fff", border: "none", padding: "14px 24px", borderRadius: "12px", fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#8B5CF6"}
                >
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {/* Nuevo Producto Card */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "320px", cursor: "pointer", transition: "0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#18181B"}
                >
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                        <Plus size={32} />
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>Agregar producto</div>
                    <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>Crea un nuevo producto</div>
                </div>

                {/* Lista de Researches Generados */}
                {researches.map(res => (
                    <div
                        key={res.id}
                        onClick={() => setSelectedResearch(res)}
                        style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                    >
                        <div style={{ height: "200px", width: "100%", background: "#09090B", position: "relative", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            {res.image ? (
                                <img src={res.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#3F3F46" }}>
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <button
                                onClick={(e) => deleteResearch(res.id, e)}
                                style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{res.name}</div>
                            <div style={{ background: "rgba(139, 92, 246, 0.1)", color: "#A78BFA", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, display: "inline-block" }}>
                                1 invest. de producto
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Crear Producto */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
                    <div style={{ background: "#18181B", width: "90%", maxWidth: "600px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ margin: 0, color: "#fff", fontSize: "20px", fontWeight: 800 }}>Crear Nuevo Producto</h3>
                                <p style={{ margin: 0, color: "#9CA3AF", fontSize: "14px", marginTop: "4px" }}>Ingresa los datos del producto para comenzar a generar investigaciones profesionales</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", alignSelf: "flex-start" }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div>
                                <label style={{ display: "block", color: "#D1D5DB", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Nombre del Producto</label>
                                <input
                                    style={{ width: "100%", background: "#09090B", border: "1px solid rgba(139,92,246,0.5)", borderRadius: "12px", padding: "16px", color: "#fff", fontSize: "15px", outline: "none" }}
                                    placeholder="Ej: Juguete masticable para perro"
                                    value={newProductName}
                                    onChange={(e) => setNewProductName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#D1D5DB", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Descripcion (opcional)</label>
                                <textarea
                                    style={{ width: "100%", background: "#09090B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "#fff", fontSize: "15px", outline: "none", minHeight: "100px", resize: "none" }}
                                    placeholder="Breve descripcion del producto..."
                                    value={newProductDesc}
                                    onChange={(e) => setNewProductDesc(e.target.value)}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#D1D5DB", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Imagen del Producto *</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ width: "100%", height: "140px", background: "#09090B", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden" }}
                                >
                                    {newProductImage ? (
                                        <>
                                            <img src={newProductImage} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                                            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.8)", padding: "4px", borderRadius: "8px", color: "#ef4444" }} onClick={(e) => { e.stopPropagation(); setNewProductImage(null); }}>
                                                <X size={16} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadIcon />
                                            <div style={{ color: "#9CA3AF", fontSize: "14px", fontWeight: 600, marginTop: "12px" }}>Haz clic para subir imagen</div>
                                            <div style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>PNG, JPG, WebP (max 10MB)</div>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ padding: "14px 24px", background: "transparent", border: "none", color: "#9CA3AF", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateResearch}
                                style={{ padding: "14px 32px", background: "#6B21A8", border: "none", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}
                            >
                                Crear Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
