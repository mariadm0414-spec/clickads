"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Sparkles, Zap, Shield, Clock, Brain, AlertCircle, ShoppingCart, MessageSquare, Plus, Database, Download } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────
const CHECKOUT_URL = "/dashboard";
const WHATSAPP_URL = "https://wa.link/pyi5n8";

// ── Components ─────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: "#0D0D14", border: `1px solid ${open ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: open ? "#A78BFA" : "#fff", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600, textAlign: "left", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer" }}>
                {q}
                <Plus size={20} style={{ color: "#8B5CF6", transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }} />
            </button>
            <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.35s ease, padding 0.25s ease", padding: open ? "0 24px 20px" : "0 24px" }}>
                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.75 }}>{a}</p>
            </div>
        </div>
    );
}

function BeforeAfterSlider({
    before, after, beforeLabel = "FOTO CELULAR", afterLabel = "CREATIVO IA",
}: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
    const [pos, setPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const clamp = (v: number) => Math.min(Math.max(v, 2), 98);
    const updatePos = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPos(clamp(((clientX - rect.left) / rect.width) * 100));
    };

    useEffect(() => {
        let frame: number;
        let t = 0;
        const animate = () => {
            t += 0.02;
            setPos(50 + Math.sin(t) * 20);
            if (t < Math.PI * 1) frame = requestAnimationFrame(animate);
            else setPos(50);
        };
        const timeout = setTimeout(() => { frame = requestAnimationFrame(animate); }, 800);
        return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", userSelect: "none", cursor: "ew-resize", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(139,92,246,0.2)", aspectRatio: "4/5" }}
            onMouseMove={e => dragging.current && updatePos(e.clientX)}
            onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={e => updatePos(e.touches[0].clientX)}
            onTouchStart={e => updatePos(e.touches[0].clientX)}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={after} alt="Después" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", background: "rgba(139,92,246,0.85)", backdropFilter: "blur(6px)", color: "#fff", padding: "5px 12px", borderRadius: 100, zIndex: 10 }}>{afterLabel}</div>
            </div>
            <div style={{
                position: "absolute", inset: 0,
                clipPath: `inset(0 ${100 - pos}% 0 0)`,
                zIndex: 2,
            }}>
                <img src={before} alt="Antes" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.55) brightness(0.82)" }} />
                <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", color: "#9CA3AF", padding: "5px 12px", borderRadius: 100, zIndex: 10 }}>{beforeLabel}</div>
            </div>
            <div style={{
                position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 3, background: "#fff", boxShadow: "0 0 12px rgba(255,255,255,0.8)", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 20,
            }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 44, height: 44, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#111", fontWeight: 900 }}>&#8644;</div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                .gradient-text { background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .btn-primary { background: #8B5CF6; color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; transition: all 0.2s; align-items: center; gap: 8px; border: none; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139,92,246,0.4); }
                .btn-cta { font-size: 20px; padding: 24px 48px; border-radius: 20px; box-shadow: 0 0 40px rgba(139,92,246,0.3); }
                
                .pain-card { background: rgba(255, 68, 68, 0.03); border: 1px solid rgba(255, 68, 68, 0.1); border-radius: 24px; padding: 32px; transition: all 0.3s; }
                .pain-card:hover { border-color: rgba(255, 68, 68, 0.3); background: rgba(255, 68, 68, 0.06); }

                .feature-card { background: rgba(139,92,246,0.03); border: 1px solid rgba(139,92,246,0.1); border-radius: 24px; padding: 32px; transition: all 0.3s; }
                .feature-card:hover { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.06); }

                @media (max-width: 768px) {
                    .mobile-stack { flex-direction: column !important; }
                    .mobile-hide { display: none !important; }
                    .mobile-text-center { text-align: center !important; }
                    .mobile-full { width: 100% !important; }
                }

                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .scroll-container {
                    display: flex;
                    width: max-content;
                    animation: scroll 40s linear infinite;
                }
                .scroll-container-reverse {
                    display: flex;
                    width: max-content;
                    animation: scroll-reverse 45s linear infinite;
                }
                .scroll-container:hover, .scroll-container-reverse:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Header */}
            <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(3,3,3,0.85)", backdropFilter: "blur(12px)", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src="/logo.png" alt="ClickAds" style={{ height: 40, width: "auto" }} />
                        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em" }}>ClickAds</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <Link href="/login" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>ACCEDER A LA APP</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: "100px 24px 60px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#A78BFA", fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-block", marginBottom: 24 }}>
                    La APP #1 para Dropshipping & Ecommerce 🚀
                </div>
                <h1 style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.05em", marginBottom: 32 }}>
                    Transforma tus fotos de celular en <br />
                    <span className="gradient-text">más de 100 creativos irresistibles</span><br />
                    que venden, ¡en solo 10 minutos!
                </h1>
                <p style={{ fontSize: 20, color: "#9CA3AF", maxWidth: 850, margin: "0 auto 48px", lineHeight: 1.6 }}>
                    Deja de pelear con Canva y diseñadores lentos. Genera imágenes listas para Meta Ads con los ángulos de venta que realmente convierten.<br /><br />
                    <strong style={{ color: "#A78BFA" }}>Sin límites de creación. Úsala para todos tus productos.</strong>
                </p>

                <div style={{ maxWidth: 800, margin: "0 auto 64px", borderRadius: 32, overflow: "hidden", boxShadow: "0 30px 60px rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                        <iframe
                            src="https://www.youtube.com/embed/ft4eGbFstrA"
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div style={{ display: "flex", gap: 16, justifyContent: "center" }} className="mobile-stack">
                    <Link href="/login" className="btn-primary btn-cta">ACCEDER A LA APP</Link>
                </div>

            </section>

            {/* Pain Points (Los Dolores) */}
            <section style={{ padding: "100px 24px", background: "#030303" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>¿Tienes un Ecommerce<br />o haces Dropshipping?</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 48, opacity: 0.8 }}>Entonces seguro te pasa esto...</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { icon: "🗓️", text: "Contratas un diseñador que se demora 8 dias para entregarte imagenes por lo cual no puedes testear todos los dias" },
                            { icon: "🎨", text: "Pasas todo el dia en canva" },
                            { icon: "📈", text: "Eres muy bueno haciendo ADS pero no creativos" },
                            { icon: "🤖", text: "Escribes un prompt en ChatGPT y te genera una imagen completamente diferente a lo que quieres" },
                            { icon: "❌", text: "ChatGPT y Gemini te dan imagenes básicas que no venden" },
                            { icon: "⏳", text: "Te enfocas mucho en crear imágenes y descuidas las otras áreas de tu negocio" },
                            { icon: "💰", text: "No tienes como pagarle 2 millones de pesos mensuales para pagarle a un diseñador" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#0D0D14",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: 20,
                                    padding: "24px 32px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 20,
                                    textAlign: "left"
                                }}
                            >
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <span style={{ fontSize: 18, fontWeight: 500, color: "#E5E7EB" }}>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: 64,
                        background: "rgba(255, 68, 68, 0.03)",
                        border: "1px solid rgba(255, 68, 68, 0.1)",
                        borderRadius: 32,
                        padding: "60px 40px"
                    }}>
                        <h3 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.3 }}>
                            El problema no eres tú. <br />
                            <span style={{ color: "#FF4444", background: "rgba(255, 68, 68, 0.15)", padding: "0 10px", borderRadius: 8 }}>
                                El problema es que creativos mediocres no venden.
                            </span>
                        </h3>
                    </div>

                    {/* Secret Section */}
                    <div style={{ marginTop: 80, textAlign: "center" }}>
                        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#A78BFA", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                            <Zap size={10} /> LA CRUDA VERDAD
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>El secreto de los Ecommerce y Dropshippers que más venden</h2>
                        <p style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 48, opacity: 0.9 }}>
                            Los que más venden testean creativos nuevos <span style={{ color: "#A78BFA", fontWeight: 800 }}>TODO EL TIEMPO.</span>
                        </p>

                        <div style={{ display: "flex", gap: 20, marginBottom: 48 }} className="mobile-stack">
                            {/* Reality Card */}
                            <div style={{
                                flex: 1,
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 24,
                                padding: 32,
                                textAlign: "left"
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.1em" }}>TU REALIDAD ACTUAL</span>
                                <p style={{ fontSize: 18, marginTop: 16, lineHeight: 1.5, color: "#E5E7EB" }}>
                                    Mientras tú tardas <span style={{ color: "#FF4444", fontWeight: 700 }}>3 horas</span> en un creativo...
                                </p>
                            </div>

                            {/* Competition Card */}
                            <div style={{
                                flex: 1,
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 24,
                                padding: 32,
                                textAlign: "left"
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#8B5CF6", letterSpacing: "0.1em" }}>LA COMPETENCIA</span>
                                <p style={{ fontSize: 18, marginTop: 16, lineHeight: 1.5, color: "#E5E7EB" }}>
                                    Tu competencia ya lanzó <span style={{ color: "#10B981", fontWeight: 700 }}>20 creativos</span> nuevos al mercado.
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: 18, color: "#9CA3AF", maxWidth: 750, margin: "0 auto", lineHeight: 1.6 }}>
                            Con <span style={{ color: "#fff", fontWeight: 700 }}>ClickAds</span>, vas a tener acceso al secreto mejor guardado de los que más facturan: <span style={{ color: "#A78BFA", fontWeight: 800 }}>VOLUMEN de creativos + testeo constante.</span>
                        </p>
                    </div>

                    {/* Stats / Math Section */}
                    <div style={{ marginTop: 100 }}>
                        <div style={{
                            background: "linear-gradient(180deg, #0D0D14 0%, #08080C 100%)",
                            border: "1px solid rgba(139,92,246,0.15)",
                            borderRadius: 40,
                            padding: "80px 40px",
                            textAlign: "center",
                            maxWidth: 900,
                            margin: "0 auto"
                        }}>
                            <h2 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 900, marginBottom: 24 }}>Necesitas 100 creativos.</h2>
                            <p style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 40, fontWeight: 500 }}>
                                La matemática es simple: <span style={{ color: "#fff" }}>Solo 3 de cada 10 creativos la rompen.</span>
                            </p>

                            <div style={{
                                background: "rgba(3,3,3,0.5)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 24,
                                padding: "40px 20px",
                                marginBottom: 48
                            }}>
                                <p style={{ fontSize: 22, color: "#9CA3AF", marginBottom: 8, fontWeight: 600 }}>Si testeas 5, es lotería.</p>
                                <p style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>
                                    Si testeas 100, <span style={{ color: "#A78BFA" }}>es estadística.</span>
                                </p>
                                <p style={{ fontSize: 20, color: "#A78BFA", fontWeight: 700, marginTop: 4 }}>La rompes completamente.</p>
                            </div>

                            <Link href="/login" className="btn-primary" style={{ background: "#fff", color: "#030303", padding: "18px 40px", borderRadius: 100, fontWeight: 900, fontSize: 18, border: "none" }}>
                                ACCEDER A LA APP
                            </Link>
                        </div>
                    </div>

                    {/* Generic Tools Section */}
                    <div style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 24, maxWidth: 800, margin: "80px auto 0" }}>
                        <div style={{
                            background: "#0D0D14",
                            border: "1px solid rgba(255, 68, 68, 0.1)",
                            borderRadius: 32,
                            padding: "60px 40px",
                            textAlign: "center"
                        }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "rgba(255, 68, 68, 0.1)",
                                color: "#FF4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px"
                            }}>
                                <AlertCircle size={24} />
                            </div>
                            <h3 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, marginBottom: 16 }}>
                                Herramientas Genéricas como ChatGPT = <span style={{ color: "#FF4444" }}>Creativos Genéricos</span>
                            </h3>
                            <p style={{ fontSize: 18, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
                                Canva, Midjourney, ChatGPT... todo lindo, pero nada vende. Porque no están diseñados para ads que conviertan.
                            </p>
                        </div>

                        <div style={{
                            background: "#0D0D14",
                            border: "1px solid rgba(139,92,246,0.1)",
                            borderRadius: 32,
                            padding: "60px 40px",
                            textAlign: "center"
                        }}>
                            <blockquote style={{ fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, fontStyle: "italic", marginBottom: 24, color: "#E5E7EB" }}>
                                "Mientras tú perfeccionas un diseño, <br className="mobile-hide" />
                                tu competencia ya testeó 50."
                            </blockquote>
                            <Link href="/dashboard" style={{ color: "#A78BFA", textDecoration: "none", fontWeight: 700, fontSize: 18, display: "inline-flex", alignItems: "center", gap: 8 }}>
                                Hay una forma mejor <span style={{ fontSize: 22 }}>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>





            {/* Deluxe Showcase Section */}
            <section style={{ padding: "120px 24px", background: "linear-gradient(180deg, #0D0D14 0%, #030303 100%)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="mobile-stack">
                    <div style={{ textAlign: "left" }}>
                        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#A78BFA", fontSize: 10, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <Sparkles size={12} /> GENERADOR DE IMÁGENES CON IA
                        </div>
                        <h2 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
                            Del celular <span className="gradient-text">al anuncio<br />de lujo</span> en segundos
                        </h2>
                        <p style={{ fontSize: 18, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 40 }}>
                            Sube la foto de tu producto, describe el estilo que quieres y nuestra IA genera **múltiples variaciones profesionales** listas para publicar en Meta Ads. Sin diseñador, sin Photoshop.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
                            {[
                                { icon: "📸", text: "Foto de celular → Creativo de agencia" },
                                { icon: "🎨", text: "Fondos, estilos y ángulos automáticos" },
                                { icon: "⚡", text: "4 variaciones en menos de 30 segundos" },
                                { icon: "🔍", text: "Integrado con el módulo Espía" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 16, fontWeight: 600, color: "#E5E7EB" }}>
                                    <div style={{ color: "#8B5CF6" }}>✓</div> {item.text}
                                </div>
                            ))}
                        </div>

                        <Link href="/login" className="btn-primary" style={{ padding: "18px 40px", borderRadius: 16, fontSize: 18 }}>
                            ACCEDER A LA APP
                        </Link>
                    </div>

                    <div style={{ position: "relative" }}>
                        <BeforeAfterSlider
                            before="/100ecom/antes-coffee.jpg"
                            after="/100ecom/coffee_final_ad.jpg"
                            beforeLabel="ANTES"
                            afterLabel="DESPUÉS IA"
                        />
                    </div>
                </div>
            </section>

            {/* The Solution */}
            <section style={{ padding: "100px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: 16 }}>
                    La Solución: <span className="gradient-text">ClickADS</span>
                </h2>
                <p style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 60, fontWeight: 500 }}>
                    Una APP de Volumen Extremo de Creativos para Productos Físicos
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto 60px" }} className="mobile-stack">
                    {[
                        {
                            num: "01",
                            title: "1. Subes tu producto",
                            desc: "Carga la info básica, copy y branding. El sistema entiende tu oferta.",
                            icon: "📤"
                        },
                        {
                            num: "02",
                            title: "2. Elige estilos y ángulos",
                            desc: "Selecciona entre múltiples ángulos de venta probados psicológicamente.",
                            icon: "🎨"
                        },
                        {
                            num: "03",
                            title: "3. Descargas tu pack listo",
                            desc: "Obten +100 creativos optimizados para Meta Ads en minutos.",
                            icon: "📥"
                        }
                    ].map(step => (
                        <div key={step.num} style={{
                            background: "#0D0D14",
                            border: "1px solid rgba(139,92,246,0.1)",
                            borderRadius: 32,
                            padding: 40,
                            textAlign: "left",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", top: 10, right: 20, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}>{step.num}</div>
                            <div style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24 }}>{step.icon}</div>
                            <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{step.title}</h4>
                            <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.6 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 32,
                    padding: "48px 24px",
                    maxWidth: 800,
                    margin: "0 auto"
                }}>
                    <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800 }}>
                        Genera <span style={{ color: "#fff" }}>100 creativos estáticos</span> en <span style={{ color: "#A78BFA" }}>~10 minutos.</span><br />
                        Listos para testear en <span style={{ color: "#8B5CF6" }}>Meta Ads.</span>
                    </p>
                </div>

                <div style={{ display: "flex", gap: 16, maxWidth: 800, margin: "24px auto 0" }} className="mobile-stack">
                    {[
                        { val: "100+", label: "CREATIVOS" },
                        { val: "10 Min", label: "TIEMPO PROMEDIO" },
                        { val: "5+", label: "ÁNGULOS DE VENTA" }
                    ].map(stat => (
                        <div key={stat.label} style={{
                            flex: 1,
                            background: "rgba(13,13,20,0.5)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 20,
                            padding: "24px 16px",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{stat.val}</div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "#4B5563", letterSpacing: "0.1em" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Section */}
                <div style={{ marginTop: 140, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Resultados reales de <span className="gradient-text">personas reales</span></h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>Mira cómo otros ya están escalando con ClickAds.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, maxWidth: 1200, margin: "0 auto" }}>
                        {[
                            {
                                id: "Fcv-TIg_jjk",
                                name: "Julian",
                                role: "CEO de Plant PWR",
                                title: "Testimonio Julian"
                            },
                            {
                                id: "gN3GnIJfPmI",
                                name: "Sofia Baena",
                                role: "CEO de varios Ecommerce",
                                title: "Testimonio Sofia Baena"
                            }
                        ].map((video, idx) => (
                            <div key={idx} style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 32, padding: 24, textAlign: "left" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                    <div>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{video.title}</h4>
                                        <p style={{ fontSize: 12, color: "#8B5CF6", fontWeight: 700 }}>{video.name} - {video.role}</p>
                                    </div>
                                    <MessageSquare size={20} color="rgba(255,255,255,0.3)" />
                                </div>
                                <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "9/16", background: "#000" }}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video.id}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        style={{ border: "none" }}
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: 120 }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
                        Ok, pero... ¿qué hace a esto distinto?
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 60, opacity: 0.8 }}>
                        La diferencia no es "usar IA". La diferencia es el <span style={{ color: "#fff", fontWeight: 700 }}>mecanismo:</span>
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }} className="mobile-stack">
                        {[
                            {
                                icon: "🏭",
                                title: "1) Volumen industrial",
                                desc: "100 creativos en minutos (no en días). Tu semana de testing aparece de golpe. Olvídate del cuello de botella creativo."
                            },
                            {
                                icon: "📐",
                                title: "2) Multi-ángulo real",
                                desc: "No te tira variaciones cosméticas. Te genera ángulos distintos: dolor, deseo, objeción, transformación, urgencia."
                            },
                            {
                                icon: "📦",
                                title: "3) Diseñado para productos fisicos",
                                desc: "Para Ecommerce o Dropshipping. Productos fisicos que se venden con claridad + promesa + prueba + emoción. No son diseños simples que no convierten."
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 32,
                                padding: 40,
                                textAlign: "left"
                            }}>
                                <div style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24 }}>{item.icon}</div>
                                <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{item.title}</h4>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Testimonials Section */}
                <div style={{ marginTop: 140, marginBottom: 60, textAlign: "center" }}>
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10B981", fontSize: 10, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        🙌 Resultados Reales
                    </div>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 64 }}>Lo que dicen los grupos de WhatsApp</h2>

                    <div style={{ maxWidth: "100%", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 150, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 150, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        <div className="scroll-container" style={{ gap: 24, padding: "20px 0" }}>
                            {[
                                "IMG_8120.jpg", "IMG_8121.jpg", "IMG_8146.jpg", "IMG_8151.jpg", "IMG_8153.jpg",
                                "IMG_8120.jpg", "IMG_8121.jpg", "IMG_8146.jpg", "IMG_8151.jpg", "IMG_8153.jpg" // Duplicated for seamless loop
                            ].map((img, i) => (
                                <div key={i} style={{
                                    width: 450,
                                    height: 450,
                                    flexShrink: 0,
                                    borderRadius: 32,
                                    overflow: "hidden",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "#0D0D14",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                                }}>
                                    <img src={`/testimonials/${img}`} alt="WhatsApp Testimonial" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Everything Included Section */}
                <div style={{ marginTop: 140, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Todo Lo Que Incluye Tu Acceso</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>El sistema completo para escalar tu operación creativa.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-stack">
                        {[
                            {
                                num: "1",
                                title: "Generador de Volumen Industrial",
                                desc: "Acceso instantáneo a la herramienta que crea 100 creativos en un click. Olvídate de esperar días por diseños o depender de la 'inspiración'. Tu semana de testing aparece de golpe, lista para subir a Meta Ads.",
                                icon: <Zap size={20} />
                            },
                            {
                                num: "2",
                                title: "El Angle-Splitter Automático",
                                desc: "No solo cambia colores. El sistema genera variantes basadas en psicología de ventas: dolor, deseo, objeción, transformación, urgencia, autoridad.",
                                icon: <Plus size={20} />
                            },
                            {
                                num: "3",
                                title: "Base de Conocimiento Integrada",
                                desc: "Sube tu copy, tu branding, tu tono de voz. El sistema aprende tu marca y genera creativos que suenan como tú, manteniendo la coherencia visual y verbal.",
                                icon: <Database size={20} />
                            },
                            {
                                num: "4",
                                title: "Exportación Directa a Meta Ads",
                                desc: "Descarga todos los creativos en formato optimizado para Meta Ads (4:5 y 9:16). Sin retoques, sin conversiones, sin pasos extra. De la herramienta a la campaña.",
                                icon: <Download size={20} />
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "left"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                    <div style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#8B5CF6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Componente #{item.num}</div>
                                        <h4 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{item.title}</h4>
                                    </div>
                                </div>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section style={{ padding: "100px 24px" }}>

                {/* Gallery Section */}
                <div style={{ marginTop: 140, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
                        Estos son algunos de los 100 creativos que puedes lograr en 10 minutos
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>
                        Imágenes de alto impacto creadas en tiempo récord, listas para Meta Ads
                    </p>

                    <div style={{ maxWidth: 1400, margin: "0 auto", overflow: "hidden", position: "relative" }}>
                        {/* Gradient Fades for Smooth Scroll Appearance */}
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        {/* Row 1 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginBottom: 20 }}>
                            {[
                                "100Ecom_Creativo_1.png", "Ad_0_(3).jpg", "ClickAds_Creativo_2.png", "Ad_1_(2).jpg",
                                "100Ecom_Creativo_4.png", "ClickAds_Creativo_5.png", "Ad_2_(2).jpg", "100Ecom_Creativo_3.png",
                                // Duplicate for infinite effect
                                "100Ecom_Creativo_1.png", "Ad_0_(3).jpg", "ClickAds_Creativo_2.png", "Ad_1_(2).jpg",
                                "100Ecom_Creativo_4.png", "ClickAds_Creativo_5.png", "Ad_2_(2).jpg", "100Ecom_Creativo_3.png"
                            ].map((img, i) => (
                                <div key={`r1-${i}`} style={{ borderRadius: 24, overflow: "hidden", width: 320, height: 320, flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 2 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "ClickAds_Creativo_1.png", "Ad_0_(4).jpg", "100Ecom_Creativo_2.png", "Ad_1_(3).jpg",
                                "ClickAds_Creativo_3.png", "100Ecom_Creativo_5.png", "Ad_3_(2).jpg", "ClickAds_Creativo_4.png",
                                // Duplicate for infinite effect
                                "ClickAds_Creativo_1.png", "Ad_0_(4).jpg", "100Ecom_Creativo_2.png", "Ad_1_(3).jpg",
                                "ClickAds_Creativo_3.png", "100Ecom_Creativo_5.png", "Ad_3_(2).jpg", "ClickAds_Creativo_4.png"
                            ].map((img, i) => (
                                <div key={`r2-${i}`} style={{ borderRadius: 24, overflow: "hidden", width: 320, height: 320, flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bonus Section */}
                <div style={{ marginTop: 140, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Pero eso no es todo...</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>También recibes estos <span style={{ color: "#A78BFA", fontWeight: 800 }}>BONUS GRATIS</span> al unirte hoy.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-stack">
                        {[
                            {
                                num: "1",
                                title: "Plantillas de Copy para Ads",
                                desc: "+50 plantillas de copy probadas para productos digitales. Solo copiar, pegar y adaptar.",
                                val: "$27",
                                icon: <MessageSquare size={20} />
                            },
                            {
                                num: "2",
                                title: "Guía de Ángulos de Venta",
                                desc: "El framework completo para encontrar los ángulos que más venden en tu nicho.",
                                val: "$17",
                                icon: <Zap size={20} />
                            },
                            {
                                num: "3",
                                title: "Acceso a Comunidad Privada",
                                desc: "Grupo exclusivo de dueños de ECommerce y Dropshipping compartiendo resultados y estrategias.",
                                val: "$12",
                                icon: <ShoppingCart size={20} />
                            },
                            {
                                num: "4",
                                title: "Updates de por Vida",
                                desc: "Cada nueva función, template y mejora que agreguemos. Sin costo extra. Para siempre.",
                                val: "Incalculable",
                                icon: <Sparkles size={20} />
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: "#0D0D14",
                                border: "1px solid rgba(139,92,246,0.1)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "left"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                    <div style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#8B5CF6", letterSpacing: "0.1em" }}>BONUS #{item.num}</div>
                                </div>
                                <h4 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{item.title}</h4>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 20 }}>{item.desc}</p>
                                <div style={{ fontSize: 14, color: "#4B5563" }}>Valor: <span style={{ color: "#fff", fontWeight: 700 }}>{item.val}</span></div>
                            </div>
                        ))}
                    </div>

                    {/* SUPER BONUS EXTRA */}
                    <div style={{
                        marginTop: 40,
                        background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 100%)",
                        border: "1px solid #8B5CF6",
                        borderRadius: 32,
                        padding: "48px 32px",
                        maxWidth: 1100,
                        margin: "40px auto 0",
                        textAlign: "center"
                    }}>
                        <div style={{ background: "#8B5CF6", color: "#fff", fontSize: 12, fontWeight: 900, padding: "6px 16px", borderRadius: 100, display: "inline-block", marginBottom: 20 }}>SUPER BONUS EXTRA</div>
                        <p style={{ fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 800, color: "#fff", lineHeight: 1.4 }}>
                            Tendrás clases dentro de la plataforma de como manejar la herramienta y de expertos en creativos y Ecommerce todo el tiempo.
                        </p>
                    </div>
                </div>
            </section>






            {/* Pricing Section */}
            <section style={{ padding: "120px 24px", background: "linear-gradient(to bottom, #030303, #0A0A0F)" }} id="precio">
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>Elige tu plan y empieza a escalar hoy</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64 }}>Acceso por 30 días. Cancela o pausa cuando quieras.</p>

                    {/* Inclusion Breakdown List */}
                    <div style={{
                        background: "rgba(139,92,246,0.03)",
                        border: "1px solid rgba(139,92,246,0.1)",
                        borderRadius: 32,
                        padding: "32px",
                        marginBottom: -40,
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 600,
                        margin: "0 auto 24px",
                        textAlign: "left"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#8B5CF6", letterSpacing: "0.1em", marginBottom: 24, textAlign: "center" }}>TODO LO QUE INCLUYE:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { t: "Generador de Volumen Industrial", v: "$350.000" },
                                { t: "Angle-Splitter Automático", v: "$173.352" },
                                { t: "Base de Conocimiento", v: "$99.347" },
                                { t: "Exportación a Meta Ads", v: "$62.910" },
                                { t: "BONUS: Plantillas de Copy", v: "$100.347" },
                                { t: "BONUS: Guía de Ángulos", v: "$82.310" },
                                { t: "BONUS: Comunidad Privada", v: "$149.421" },
                                { t: "BONUS: Updates de por Vida", v: "Incalculable" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                                    <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ color: "#10B981" }}>✓</div> {item.t}
                                    </div>
                                    <div style={{ color: "#4B5563", textDecoration: item.v !== "Incalculable" ? "line-through" : "none" }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Pricing Card */}
                    <div style={{
                        background: "#0D0D14",
                        border: "2px solid #8B5CF6",
                        borderRadius: 40,
                        padding: "60px 40px",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 20px 50px rgba(139,92,246,0.1)"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "8px 24px",
                            background: "#8B5CF6",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: 12,
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16
                        }}>OFERTA DE LANZAMIENTO</div>

                        <div style={{ marginBottom: 40, marginTop: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <span style={{ fontSize: "clamp(60px, 10vw, 80px)", fontWeight: 900, letterSpacing: "-0.02em" }}>$19.99</span>
                            </div>
                            <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 16 }}>Acceso por 30 días · Sin permanencia</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left", maxWidth: 400, margin: "0 auto 48px" }}>
                            {[
                                "Acceso inmediato a la plataforma",
                                "Todos los bonus incluidos",
                                "Cancela o pausa cuando quieras",
                                "Prueba un mes sin compromiso"
                            ].map(feat => (
                                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "#D1D5DB" }}>
                                    <div style={{ color: "#8B5CF6" }}>✓</div> {feat}
                                </div>
                            ))}
                        </div>

                        <Link href="/login" className="btn-primary btn-cta" style={{ width: "100%", justifyContent: "center", borderRadius: 16 }}>ACCEDER A LA APP</Link>

                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 20, color: "#25D366", textDecoration: "none", fontSize: 15, fontWeight: 700, borderBottom: "1px solid rgba(37, 211, 102, 0.3)", paddingBottom: 2 }}>
                            ¿Dudas? Escribeme por WhatsApp
                        </a>

                        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                            <div style={{ fontSize: 12, color: "#4B5563", display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%" }}></div> PAGO SEGURO
                            </div>
                            <div style={{ fontSize: 12, color: "#4B5563", display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%" }}></div> ACCESO INMEDIATO
                            </div>
                            <div style={{ fontSize: 12, color: "#4B5563", display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%" }}></div> CANCELA CUANDO QUIERAS
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: "100px 24px" }} id="faq">
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 32, fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Preguntas Frecuentes</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            {
                                q: "¿Necesito ser diseñador o copywriter?",
                                a: "No. Necesitas criterio para testear y medir. ClickAds te entrega volumen y estructura profesional para que tus anuncios conviertan."
                            },
                            {
                                q: "¿Esto me garantiza ventas?",
                                a: "No vendemos magia. Te damos lo que hoy te falta: volumen + ángulos + velocidad. Lo que hagas con eso (testear en serio) define el resultado de tu Ecommerce o Dropshipping."
                            },
                            {
                                q: "¿Puedo crear videos con esta herramienta?",
                                a: "Por ahora genera imágenes estáticas de alto impacto para Meta Ads. Es lo que más impacto tiene en testing de volumen industrial."
                            },
                            {
                                q: "¿Sirve para más de un producto digital?",
                                a: "Sí, no tiene límites. Puedes usarla para todos tus productos físicos, dropshipping o incluso ofertas digitales."
                            },
                            {
                                q: "¿Tiene suscripción mensual?",
                                a: "Es una suscripción mensual. Pagas mes a mes y puedes cancelar o pausar cuando quieras, sin permanencia ni penalidades."
                            },
                            {
                                q: "¿Ya probé Canva/ChatGPT... por qué esto sería distinto?",
                                a: "Porque esas herramientas te ponen en modo 'artesano'. ClickAds te pone en modo testing: 100 piezas, ahora, para encontrar ganadores rápido."
                            },
                            {
                                q: "¿Tiene algún límite de creación?",
                                a: "No. Como conectas tu propia API de Google AI Studio (que es gratuita en su capa estándar), no tienes límites arbitrarios de la plataforma."
                            },
                            {
                                q: "¿Hay algún plan gratuito para probar?",
                                a: "No ofrecemos plan free. Ofrecemos algo mejor: Garantía de Funcionamiento. Si la app presenta errores técnicos que impidan su uso, te devolvemos el 100% de tu dinero. ClickAds NO es para curiosos, es para dueños de negocios que quieren escalar con volumen real."
                            }
                        ].map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: "80px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 24 }}>
                    <img src="/logo.png" alt="ClickAds" style={{ height: 50, width: "auto" }} />
                    <span style={{ fontSize: 24, fontWeight: 900 }}>ClickAds</span>
                </div>
                <p style={{ color: "#4B5563", fontSize: 14, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
                    Revolucionando el testeo de creativos con Inteligencia Artificial Industrial.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 14, color: "#9CA3AF" }}>
                    <a href={WHATSAPP_URL} style={{ textDecoration: "none", color: "inherit" }}>Soporte WhatsApp</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Términos</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacidad</a>
                </div>
                <p style={{ color: "#222", fontSize: 12, marginTop: 40 }}>© 2025 ClickAds. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
