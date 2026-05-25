"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Sparkles, Zap, Shield, Clock, Brain, AlertCircle, ShoppingCart, MessageSquare, Plus, Database, Download, Wifi, Battery, ChevronLeft, ChevronRight, Video, ShieldAlert, Layout, Calendar } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────
const MONTHLY_CHECKOUT_URL = "https://pay.hotmart.com/A105984728W?bid=1779682216358";
const ANNUAL_CHECKOUT_URL = "https://pay.hotmart.com/A105984728W?bid=1779682216358";
const WHATSAPP_URL = "https://wa.link/6y79xi";

// ── Components ─────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: "#0D0D14", border: `1px solid ${open ? "rgba(254, 214, 39,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s", position: "relative", zIndex: 10 }}>
            <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: open ? "#ffe054" : "#fff", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600, textAlign: "left", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer" }}>
                {q}
                <Plus size={20} style={{ color: "#fed627", transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }} />
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
            style={{ position: "relative", userSelect: "none", cursor: "ew-resize", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(254, 214, 39,0.2)", aspectRatio: "4/5" }}
            onMouseMove={e => dragging.current && updatePos(e.clientX)}
            onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={e => updatePos(e.touches[0].clientX)}
            onTouchStart={e => updatePos(e.touches[0].clientX)}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={after} alt="Después" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", background: "rgba(254, 214, 39,0.85)", backdropFilter: "blur(6px)", color: "#fff", padding: "5px 12px", borderRadius: 100, zIndex: 10 }}>{afterLabel}</div>
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

function NotificationToast() {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);
    const notifications = [
        { name: "Martha Caicedo", plan: "Plan PRO Mensual" },
        { name: "Juan Quintero", plan: "Plan PRO Mensual" },
        { name: "Patricia S.", plan: "Plan PRO Mensual" },
        { name: "Carlos Ruiz", plan: "Plan PRO Mensual" },
        { name: "Sofia Baena", plan: "Plan PRO Mensual" },
        { name: "Diego Lopez", plan: "Plan PRO Mensual" },
        { name: "Andrés G.", plan: "Plan PRO Mensual" },
        { name: "Laura M.", plan: "Plan PRO Mensual" }
    ];

    useEffect(() => {
        const showNext = () => {
            setCurrent(Math.floor(Math.random() * notifications.length));
            setVisible(true);
            setTimeout(() => setVisible(false), 5000);
        };
        const timer = setTimeout(showNext, 4000);
        const interval = setInterval(showNext, 18000);
        return () => { clearTimeout(timer); clearInterval(interval); };
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed", bottom: 20, left: 20, zIndex: 10000,
            background: "rgba(13, 13, 20, 0.95)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)", color: "#fff",
            maxWidth: 320, animation: "slideInLeft 0.5s ease-out"
        }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #fed627, #cca31e)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF" }}>Nuevo usuario</span>
                    <span style={{ fontSize: 9, color: "#4B5563" }}>Ahora</span>
                </div>
                <div style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.3 }}>
                    <strong style={{ color: "#fff" }}>{notifications[current].name}</strong> acabo de comprar <strong style={{ color: "#ffe054" }}>"oferta pago unico"</strong>
                </div>
            </div>
            <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

// ── Galaxy Canvas Component ───────────────────────────────────────────────
function GalaxyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const stars: { x: number; y: number; r: number; speed: number; opacity: number; twinkle: number }[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Generate stars
        for (let i = 0; i < 220; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.2,
                speed: Math.random() * 0.25 + 0.05,
                opacity: Math.random() * 0.7 + 0.3,
                twinkle: Math.random() * Math.PI * 2
            });
        }

        let t = 0;
        const draw = () => {
            t += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.y += s.speed;
                if (s.y > canvas.height + 2) s.y = -2;
                const twinkleOpacity = s.opacity * (0.6 + 0.4 * Math.sin(t + s.twinkle));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                // Occasional red-tinted stars
                const redStar = Math.random() > 0.85;
                ctx.fillStyle = redStar
                    ? `rgba(248, 113, 113, ${twinkleOpacity})`
                    : `rgba(255, 255, 255, ${twinkleOpacity})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);
    return <canvas ref={canvasRef} id="galaxy-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }} />;
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
    const [cupos, setCupos] = useState(6);
    useEffect(() => {
        if (cupos > 2) {
            const timer = setTimeout(() => {
                setCupos(c => c - 1);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [cupos]);

    const [landingIndex, setLandingIndex] = useState(0);
    const landingImages = [
        "/Carruseles/postea_instagram_17796726_1779674035716.jpg", 
        "/Carruseles/postea_instagram_17796727_1779674038913.jpg", 
        "/Carruseles/postea_instagram_17796733_1779674043953.jpg",
        "/Carruseles/postea_instagram_17796734_1779674047428.jpg",
        "/Carruseles/postea_instagram_17796734_1779674048236.jpg"
    ];

    const nextLanding = () => setLandingIndex((prev) => (prev + 1) % landingImages.length);
    const prevLanding = () => setLandingIndex((prev) => (prev - 1 + landingImages.length) % landingImages.length);

    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden", position: "relative" }}>
            <GalaxyCanvas />
            <NotificationToast />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                .gradient-text { background: linear-gradient(135deg, #fed627 0%, #ffe054 50%, #fff0a8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .btn-primary { background: linear-gradient(135deg, #fed627, #cca31e); color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; transition: all 0.25s; align-items: center; gap: 8px; border: none; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(254, 214, 39,0.5); filter: brightness(1.1); }
                .btn-cta { font-size: 20px; padding: 24px 48px; border-radius: 20px; box-shadow: 0 0 50px rgba(254, 214, 39,0.4); }

                .pain-card { background: #0A0A08; border: 1px solid rgba(254, 214, 39, 0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .pain-card:hover { border-color: rgba(254, 214, 39, 0.4); background: #0F0F0B; }

                .feature-card { background: #0A0A12; border: 1px solid rgba(254, 214, 39,0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .feature-card:hover { border-color: rgba(254, 214, 39,0.4); background: #0E0E18; }

                /* Galaxy starfield canvas */
                #galaxy-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.6; }

                /* Shooting star effect */
                @keyframes shootingStar {
                    0% { transform: translateX(0) translateY(0); opacity: 1; }
                    100% { transform: translateX(200px) translateY(200px); opacity: 0; }
                }

                @media (max-width: 768px) {
                    .mobile-stack { 
                        display: flex !important; 
                        flex-direction: column !important; 
                        gap: 24px !important;
                    }
                    .mobile-grid-1 {
                        display: grid !important;
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .mobile-pill { border-radius: 24px !important; }
                    .mobile-col-center { flex-wrap: wrap !important; }
                    .mobile-hide { display: none !important; }
                    .mobile-text-center { text-align: center !important; }
                    .mobile-center-flex { align-items: center !important; justify-content: center !important; text-align: center !important; }
                    .mobile-full { width: 100% !important; }
                    .mobile-full-padding { padding: 32px 20px !important; }
                    section { padding: 60px 20px !important; }
                    .hero-section { padding-top: 120px !important; }
                    .btn-cta { width: 100%; justify-content: center; padding: 20px !important; font-size: 18px !important; }
                    h1 { font-size: 32px !important; line-height: 1.2 !important; }
                    h2 { font-size: 26px !important; line-height: 1.2 !important; }
                    h3 { font-size: 22px !important; line-height: 1.2 !important; }
                    .scroll-card { width: 280px !important; height: 280px !important; }
                    .slider-container { width: 100% !important; max-width: 320px !important; margin: 0 auto !important; }
                    .hero-badge { white-space: normal !important; line-height: 1.4 !important; }
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
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 40px rgba(254, 214, 39,0.4), 0 0 80px rgba(254, 214, 39,0.15); }
                    50% { box-shadow: 0 0 60px rgba(254, 214, 39,0.6), 0 0 120px rgba(254, 214, 39,0.25); }
                }
                .pulse-btn { animation: pulse-glow 3s ease-in-out infinite; }
            `}</style>

            {/* Header */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(3,3,3,0.8)", backdropFilter: "blur(20px)", padding: "14px 24px", borderBottom: "1px solid rgba(254, 214, 39,0.15)", transition: "all 0.3s" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src="/logo.png" alt="PosteA" style={{ height: 44, objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <a href="#precio" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14, background: "linear-gradient(135deg, #fed627, #cca31e)", boxShadow: "0 4px 20px rgba(254, 214, 39,0.4)" }}>ACCEDER A LA APP</a>
                    </div>
                </div>
            </nav>

            {/* Galaxy Starfield Hero */}
            <section className="hero-section" style={{ padding: "140px 24px 80px", position: "relative", overflow: "hidden", background: "transparent", minHeight: "100vh", display: "flex", alignItems: "center" }}>
                {/* Animated Canvas Galaxy */}

                {/* Red/Orange Radial Glow */}
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(254, 214, 39,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }}></div>
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: "radial-gradient(ellipse at center, rgba(220, 38, 38,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }}></div>

                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2, width: "100%" }}>
                    <div
                        className="hero-badge"
                        style={{ background: "rgba(254, 214, 39,0.15)", border: "1px solid rgba(254, 214, 39,0.4)", color: "#fed627", fontSize: 13, fontWeight: 700, padding: "8px 24px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, maxWidth: "100%", backdropFilter: "blur(10px)", textTransform: "uppercase" }}
                    >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fed627" }}></span> TU ESTRATEGIA Y CONTENIDO SEMANAL EN UN SOLO CLIC
                    </div>

                    <h1 style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 32, color: "#fff" }}>
                        Genera todas las imagenes y carruseles de tu<br />
                        <span style={{ color: "#fed627" }}>marca para toda la semana</span><br />
                        <span style={{ color: "#6B7280" }}>en un solo clic y <span style={{ color: "#fed627" }}>EN MENOS DE 1 MINUTO.</span></span>
                    </h1>

                    <p style={{ fontSize: 18, color: "#9CA3AF", maxWidth: 750, margin: "0 auto 16px", lineHeight: 1.7, fontWeight: 500 }}>
                        El primer generador impulsado por IA diseñado para crear tus imágenes de marca,<br />
                        copys persuasivos y carruseles estructurados listos para publicar.<br />
                        Toda tu estrategia y contenido semanal a tu alcance al instante.
                    </p>
                    <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 750, margin: "0 auto 48px", lineHeight: 1.7, fontWeight: 500 }}>
                        Estrategia de contenido automatizada. Sin diseñadores. Sin redactores. Sin estrés.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40, flexWrap: "wrap", position: "relative", zIndex: 10 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {[
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                            ].map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="User"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        border: "2px solid #030303",
                                        marginLeft: i === 0 ? 0 : -12,
                                        background: "#1F2937",
                                        objectFit: "cover"
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>
                                ))}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF" }}>
                                <span style={{ color: "#fff0a8" }}>+1,200</span> marcas y creadores ya planifican su contenido con <span style={{ color: "#fff" }}>Postea</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ maxWidth: 800, margin: "0 auto 64px", borderRadius: 32, overflow: "hidden", border: "1px solid rgba(254, 214, 39,0.25)", boxShadow: "0 30px 80px rgba(254, 214, 39,0.2), 0 0 0 1px rgba(254, 214, 39,0.1)" }}>
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                            <iframe
                                src="https://www.loom.com/embed/9e220d8c52c54459884523fd84a73e9f"
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 64, marginBottom: 64, textAlign: "center" }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: "#4B5563", letterSpacing: "0.2em", marginBottom: 32 }}>DESARROLLADO PARA</p>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, flexWrap: "wrap", opacity: 0.8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9CA3AF" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
                                <span style={{ fontSize: 15, fontWeight: 700 }}>Meta Ads</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9CA3AF" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                                <span style={{ fontSize: 15, fontWeight: 700 }}>TikTok Ads</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9CA3AF" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77.42-1.56.42-4.81.42-4.81s0-3.25-.42-4.81zM10 15V9l5.2 3L10 15z" /></svg>
                                <span style={{ fontSize: 15, fontWeight: 700 }}>YouTube Ads</span>
                            </div>
                            <div style={{ background: "rgba(254, 214, 39,0.05)", border: "1px solid rgba(254, 214, 39,0.15)", padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 700, color: "#9CA3AF" }}>
                                ⚡ <span style={{ color: "#fff0a8" }}>+50,000</span> publicaciones generadas
                            </div>
                        </div>
                        <p style={{ marginTop: 48, fontSize: 16, color: "#9CA3AF", maxWidth: 600, margin: "48px auto 0", lineHeight: 1.6 }}>
                            Esta es la única app del mercado que crea tu estrategia semanal de <br />
                            <strong style={{ color: "#fff", borderBottom: "2px solid #fed627" }}>imágenes de marca, copys persuasivos y carruseles de alto engagement en un clic</strong>
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }} className="mobile-stack">
                        <a href="#precio" className="btn-primary btn-cta pulse-btn" style={{ background: "linear-gradient(135deg, #fed627 0%, #cca31e 100%)", borderRadius: 12, padding: "16px 32px", fontSize: 18, fontWeight: 700, boxShadow: "0 0 50px rgba(254, 214, 39,0.5), inset 0 1px 0 rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                            Crear mi estrategia semanal ahora →
                        </a>
                        <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 18, padding: "16px 32px", borderRadius: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}>
                            ▶ Ver como funciona
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Moved below Hero CTA */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3 }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Resultados reales de <span className="gradient-text">personas reales</span></h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 32, opacity: 0.7 }}>Mira cómo otros ya están escalando con Postea.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
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
                                        <p style={{ fontSize: 12, color: "#fed627", fontWeight: 700 }}>{video.name} - {video.role}</p>
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
            </section>

            {/* Gallery Section - Moved below Testimonials */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3, overflow: "hidden" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
                        Imágenes de marca y <span className="gradient-text">carruseles creados</span> para toda la semana
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40, opacity: 0.7 }}>
                        Mira algunas de las piezas generadas por Postea: diseños premium alineados con la identidad de tu marca y estructurados en formato vertical 4:5.
                    </p>

                    <div style={{ maxWidth: 1400, margin: "0 auto", overflow: "hidden", position: "relative" }}>
                        {/* Gradient Fades for Smooth Scroll Appearance */}
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        {/* Row 1 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginBottom: 20 }}>
                            {[
                                "instagram_post_5_1779678657210.jpg", "instagram_post_3_1779678649870.jpg", "instagram_post_2_1779678502245.jpg",
                                "instagram_post_1_1779678316095.jpg", "instagram_post_5_1779677933194.jpg", "instagram_post_3_1779677925232.jpg",
                                "instagram_post_2_1779677919636.jpg", "instagram_post_1_1779677915198.jpg", "instagram_post_2_1779677442846.jpg",
                                // Duplicate for infinite effect
                                "instagram_post_5_1779678657210.jpg", "instagram_post_3_1779678649870.jpg", "instagram_post_2_1779678502245.jpg",
                                "instagram_post_1_1779678316095.jpg", "instagram_post_5_1779677933194.jpg", "instagram_post_3_1779677925232.jpg",
                                "instagram_post_2_1779677919636.jpg", "instagram_post_1_1779677915198.jpg", "instagram_post_2_1779677442846.jpg"
                            ].map((img, i) => (
                                <div key={`r1-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 2 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "instagram_post_5_1779677089143.jpg", "instagram_post_3_1779676900797.jpg", "instagram_post_2_1779676896776.jpg",
                                "instagram_post_1_1779676888701.jpg", "postea_instagram_1779676645444.jpg", "postea_instagram_1779676638394.jpg",
                                "postea_instagram_1779676629197.jpg", "postea_instagram_1779676621130.jpg", "postea_instagram_1779676613276.jpg",
                                // Duplicate for infinite effect
                                "instagram_post_5_1779677089143.jpg", "instagram_post_3_1779676900797.jpg", "instagram_post_2_1779676896776.jpg",
                                "instagram_post_1_1779676888701.jpg", "postea_instagram_1779676645444.jpg", "postea_instagram_1779676638394.jpg",
                                "postea_instagram_1779676629197.jpg", "postea_instagram_1779676621130.jpg", "postea_instagram_1779676613276.jpg"
                            ].map((img, i) => (
                                <div key={`r2-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 3 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginTop: 20, marginBottom: 20 }}>
                            {[
                                "postea_instagram_1779676604516.jpg", "postea_instagram_1779676597117.jpg", "postea_instagram_1779676585588.jpg",
                                "instagram_post_3_1779678649870.jpg", "instagram_post_1_1779678316095.jpg", "instagram_post_3_1779677925232.jpg",
                                "instagram_post_1_1779677915198.jpg", "instagram_post_3_1779676900797.jpg", "postea_instagram_1779676645444.jpg",
                                // Duplicate for infinite effect
                                "postea_instagram_1779676604516.jpg", "postea_instagram_1779676597117.jpg", "postea_instagram_1779676585588.jpg",
                                "instagram_post_3_1779678649870.jpg", "instagram_post_1_1779678316095.jpg", "instagram_post_3_1779677925232.jpg",
                                "instagram_post_1_1779677915198.jpg", "instagram_post_3_1779676900797.jpg", "postea_instagram_1779676645444.jpg"
                            ].map((img, i) => (
                                <div key={`r3-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 4 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "instagram_post_5_1779678657210.jpg", "postea_instagram_1779676638394.jpg", "instagram_post_2_1779677919636.jpg",
                                "instagram_post_5_1779677089143.jpg", "postea_instagram_1779676621130.jpg", "instagram_post_2_1779676896776.jpg",
                                "instagram_post_5_1779677933194.jpg", "postea_instagram_1779676613276.jpg",
                                // Duplicate for infinite effect
                                "instagram_post_5_1779678657210.jpg", "postea_instagram_1779676638394.jpg", "instagram_post_2_1779677919636.jpg",
                                "instagram_post_5_1779677089143.jpg", "postea_instagram_1779676621130.jpg", "instagram_post_2_1779676896776.jpg",
                                "instagram_post_5_1779677933194.jpg", "postea_instagram_1779676613276.jpg"
                            ].map((img, i) => (
                                <div key={`r4-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Landing Page Showcase Section */}
            <section style={{ padding: "120px 24px", background: "transparent", position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center" }} className="mobile-stack">
                    <div className="mobile-text-center">
                        <div style={{ background: "rgba(254, 214, 39,0.1)", border: "1px solid rgba(254, 214, 39,0.2)", color: "#ffe054", fontSize: 13, fontWeight: 800, padding: "8px 20px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }} className="mobile-center-flex">
                            <Zap size={14} /> GENERADOR DE CARRUSELES IA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
                            Carruseles en Formato <br />
                            <span style={{ background: "rgba(254, 214, 39,0.15)", padding: "0 12px", borderRadius: 8 }}>Vertical 4:5</span> <br />
                            Estructurados para <span className="gradient-text">Vender</span>
                        </h2>
                        <p style={{ fontSize: 19, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 48, maxWidth: 540 }} className="mobile-center-flex">
                            El formato vertical 4:5 es el rey de la atención en redes sociales. Nuestra IA no solo genera imágenes hermosas, sino que estructura carruseles multi-deslizados con ganchos (hooks) y llamados a la acción (CTA) que convierten el scroll en seguidores y ventas.
                        </p>
                        <div style={{ display: "flex", gap: 16 }} className="mobile-center-flex">
                            <a href="#precio" className="btn-primary" style={{ padding: "18px 40px", borderRadius: 16, fontSize: 18, fontWeight: 900 }}>✦ ACCEDER A LA APP</a>
                        </div>
                    </div>

                    <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                        {/* Phone Mockup Frame */}
                        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                            {/* Arrow Left */}
                            <button
                                onClick={prevLanding}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                                className="hover-scale"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div style={{
                                width: 380,
                                borderRadius: 24,
                                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.9), 0 0 40px rgba(254, 214, 39,0.2)",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }} key={landingIndex}>
                                <img
                                    src={landingImages[landingIndex]}
                                    alt="Carousel Slide Example"
                                    style={{ width: "100%", display: "block" }}
                                />
                            </div>

                            {/* Arrow Right */}
                            <button
                                onClick={nextLanding}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                                className="hover-scale"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        {/* Instruction Text */}
                        <div style={{ position: "absolute", bottom: -50, fontSize: 11, color: "#6B7280", fontWeight: 800, letterSpacing: 2, background: "rgba(254, 214, 39,0.05)", padding: "4px 12px", borderRadius: 100 }}>↓ HAZ SCROLL PARA VER EL CARRUSEL</div>
                    </div>
                </div>
            </section>

            {/* Pain Points (Los Dolores) */}
            <section style={{ padding: "100px 24px", background: "transparent" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>¿Te cuesta crear contenido<br />constante para tu marca?</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 48, opacity: 0.8 }}>Seguro te enfrentas a estos dolores todos los días...</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { icon: "🗓️", text: "Pasas horas pensando qué publicar y al final de la semana no tienes nada listo" },
                            { icon: "🎨", text: "Terminas atrapado en Canva editando plantillas genéricas que no conectan" },
                            { icon: "✍️", text: "El bloqueo creativo te impide escribir copies persuasivos que de verdad enganchen" },
                            { icon: "📈", text: "Eres bueno operando tu negocio, pero crear contenido visual te quita todo el tiempo" },
                            { icon: "🤖", text: "Escribes comandos en IAs genéricas y te dan resultados plásticos y aburridos" },
                            { icon: "❌", text: "El feed de tu marca luce inconsistente y poco profesional ante tus clientes" },
                            { icon: "⏳", text: "Te enfocas tanto en el diseño que descuidas las ventas y la estrategia" },
                            { icon: "💰", text: "Pagas altos costos mensuales a diseñadores o redactores externos y entregan tarde" },
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
                                    position: "relative",
                                    zIndex: 10,
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
                        background: "rgba(254, 214, 39, 0.03)",
                        border: "1px solid rgba(254, 214, 39, 0.1)",
                        borderRadius: 32,
                        padding: "60px 40px"
                    }}>
                        <h3 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.3 }}>
                            El problema no eres tú. <br />
                            <span style={{ color: "#FF4444", background: "rgba(254, 214, 39, 0.15)", padding: "0 10px", borderRadius: 8 }}>
                                El problema es que publicar sin estrategia y con diseños aburridos no da resultados.
                            </span>
                        </h3>
                    </div>

                    {/* Comparison Section (The Truth) */}
                    <div style={{ marginTop: 100, textAlign: "center" }}>
                        <div style={{ background: "rgba(254, 214, 39,0.1)", border: "1px solid rgba(254, 214, 39,0.2)", color: "#ffe054", fontSize: 10, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <AlertCircle size={12} /> EL PROBLEMA ES...
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
                            La cruda verdad sobre la <span className="gradient-text">creación de contenido</span>
                        </h2>
                        <p style={{ fontSize: 20, color: "#9CA3AF", maxWidth: 850, margin: "0 auto 60px", lineHeight: 1.6 }}>
                            Mantener la constancia y la calidad en redes sociales es la parte más difícil de escalar una marca...
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 64 }} className="mobile-grid-1">
                            {/* Card 1: DIY */}
                            <div className="feature-card" style={{ textAlign: "left", background: "#0D0D14", position: "relative", zIndex: 10 }}>
                                <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, aspectRatio: "16/10" }}>
                                    <img src="/problemas/diy_creative_struggle_1774410418170.png" alt="DIY" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Hazlo tú mismo = <span style={{ color: "#FF4444" }}>Agotamiento</span></h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Horas diseñando y redactando copies</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>No tienes garantía de que vaya a funcionar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Agencies */}
                            <div className="feature-card" style={{ textAlign: "left", background: "#0D0D14", position: "relative", zIndex: 10 }}>
                                <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, aspectRatio: "16/10" }}>
                                    <img src="/problemas/expensive_agency_bill_1774410465150.png" alt="Agencias" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Agencias = <span style={{ color: "#FF4444" }}>Caras y Lentas</span></h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Cientos de dólares al mes en tarifas</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Largas esperas y procesos burocráticos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Big Brands */}
                            <div className="feature-card" style={{ textAlign: "left", background: "#0D0D14", position: "relative", zIndex: 10 }}>
                                <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, aspectRatio: "16/10" }}>
                                    <img src="/problemas/big_brands_ads_scale_1774410505031.png" alt="Grandes Marcas" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competir contra grandes marcas</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Publican contenido premium múltiples veces al día</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Tienen equipos de diseño dedicados</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: "#08080C",
                            border: "1px solid rgba(254, 214, 39,0.2)",
                            borderRadius: 32,
                            position: "relative",
                            zIndex: 5,
                            padding: "40px",
                            maxWidth: 900,
                            margin: "0 auto"
                        }}>
                            <p style={{ fontSize: 22, color: "#E5E7EB", lineHeight: 1.6 }}>
                                No es de extrañar que tantos emprendedores quemen su presupuesto sin ver retornos. <br />
                                <strong style={{ color: "#ffe054" }}>Pero existe una forma más rápida, inteligente y económica de ganar...</strong>
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Generic AI Comparison (The Real Problem) */}
            <section style={{ padding: "100px 24px", background: "transparent", borderTop: "1px solid rgba(254, 214, 39,0.1)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, marginBottom: 32, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.02em" }}>
                        El problema real... <br />
                        <span style={{ color: "#FF4444" }}>Usar IA genérica para crear el contenido de tu marca es como gritarle al mundo que no eres un negocio profesional.</span>
                    </h2>

                    <div style={{ color: "#9CA3AF", fontSize: 20, marginBottom: 56, lineHeight: 1.6, maxWidth: 840, margin: "0 auto 56px", fontWeight: 400 }}>
                        <p style={{ marginBottom: 24 }}>
                            Intentas ahorrar tiempo usando ChatGPT o Midjourney para tus redes sociales, pero la realidad es otra:
                        </p>
                        <p style={{ color: "#D1D5DB" }}>
                            Pasas horas redactando prompts complejos y editando imágenes sueltas que parecen "arte artificial" pero que no representan los colores ni la identidad real de tu marca.
                        </p>
                    </div>

                    <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40, color: "#fff" }}>La dolorosa realidad:</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 840, margin: "0 auto" }}>
                        {/* Bloque Naranja */}
                        <div style={{ background: "#160B03", border: "1px solid rgba(251,146,60,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#FED7AA", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Estética genérica y plástica:</strong> El contenido grita "creado por robot" a kilómetros, alejando a tus clientes reales y destruyendo la confianza.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Rojo */}
                        <div style={{ background: "#170505", border: "1px solid rgba(254, 214, 39,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#FECACA", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>💸</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Inconsistencia y bloqueo constante:</strong> Tienes que adivinar ideas nuevas cada día en lugar de tener un flujo estructurado para toda la semana.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Gris / Red Flag */}
                        <div style={{ background: "#0B0B0D", border: "1px solid rgba(107,114,128,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#E5E7EB", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>🚩</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Sin copys ni carruseles estructurados:</strong> Las IAs comunes solo te dan una imagen o un bloque de texto plano, no una secuencia coherente con storytelling.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Morado (Conclusión) */}
                        <div style={{ background: "#0D031A", border: "1px solid rgba(254, 214, 39,0.3)", padding: "26px 32px", borderRadius: 20, fontSize: 18, color: "#fff0a8", fontWeight: 500, lineHeight: 1.5, textAlign: "left", marginTop: 8, boxShadow: "0 0 40px rgba(254, 214, 39,0.08)", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 28, flexShrink: 0 }}>🎯</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Tu marca no es un experimento de prompts:</strong> Deja de probar suerte con herramientas que no entienden tu negocio. <strong style={{ color: "#ffe054" }}>Necesitas una estrategia coherente, no arte abstracto.</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>






            {/* Deluxe Showcase Section */}
            <section style={{ padding: "80px 24px", background: "transparent" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="mobile-grid-1">
                    {/* Left Column — Text */}
                    <div style={{ textAlign: "left" }} className="mobile-text-center">
                        <div style={{ background: "rgba(254, 214, 39,0.1)", border: "1px solid rgba(254, 214, 39,0.2)", color: "#ffe054", fontSize: 11, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }} className="mobile-center-flex">
                            <Sparkles size={12} /> GENERADOR DE CONTENIDO CON IA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                            De la idea <span className="gradient-text">a una marca<br />de lujo</span> en segundos
                        </h2>
                        <p style={{ fontSize: 17, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
                            Elige el estilo de tu marca, introduce tu idea y la IA creará imágenes premium adaptadas a tus colores corporativos junto con copys persuasivos listos para publicar.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }} className="mobile-center-flex">
                            {[
                                { text: "Estrategia semanal de un solo clic" },
                                { text: "Carruseles de alto engagement en 4:5" },
                                { text: "Copys persuasivos y hashtags optimizados" },
                                { text: "Estilos estéticos de lujo adaptados a tu marca" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, fontWeight: 600, color: "#E5E7EB" }}>
                                    <div style={{ color: "#fed627", fontSize: 20, fontWeight: 900, flexShrink: 0 }}>✓</div> {item.text}
                                </div>
                            ))}
                        </div>

                        <a href="#precio" className="btn-primary mobile-center-flex" style={{ padding: "18px 40px", borderRadius: 16, fontSize: 18, width: "100%", justifyContent: "center" }}>
                            ✦ ACCEDER A LA APP
                        </a>
                    </div>

                    {/* Right Column — Before/After Slider */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                        <div style={{ position: "relative", width: "100%" }} className="slider-container">
                            <BeforeAfterSlider
                                before="/100ecom/1.jpg"
                                after="/100ecom/2.jpg"
                                beforeLabel="ANTES"
                                afterLabel="DESPUÉS IA"
                            />
                        </div>
                        <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", fontStyle: "italic" }}>
                            Desliza para ver la transformación IA
                        </p>
                    </div>
                </div>
            </section>

            {/* Calendar Showcase Section */}
            <section style={{ padding: "80px 24px", background: "transparent" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="mobile-grid-1">
                    
                    {/* Left Column — Text */}
                    <div style={{ textAlign: "left" }} className="mobile-text-center">
                        <div style={{ background: "rgba(254, 214, 39,0.1)", border: "1px solid rgba(254, 214, 39,0.2)", color: "#ffe054", fontSize: 11, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }} className="mobile-center-flex">
                            <Calendar size={12} /> ORGANIZACIÓN PERFECTA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                            Un calendario visual <span className="gradient-text">para dominar<br />tus marcas</span>
                        </h2>
                        <p style={{ fontSize: 17, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
                            Mantén el orden absoluto de todas tus publicaciones. El Planificador de Contenido integrado te permite visualizar la estrategia de cada una de tus marcas mes a mes.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }} className="mobile-center-flex">
                            {[
                                { text: "Separa el contenido por marca o cliente" },
                                { text: "Visualiza tu estrategia mensual" },
                                { text: "Mantén un feed impecable y constante" },
                                { text: "Olvídate de hojas de cálculo desordenadas" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, fontWeight: 600, color: "#E5E7EB" }}>
                                    <div style={{ color: "#fed627", fontSize: 20, fontWeight: 900, flexShrink: 0 }}>✓</div> {item.text}
                                </div>
                            ))}
                        </div>

                        <a href="#precio" className="btn-primary mobile-center-flex" style={{ padding: "18px 40px", borderRadius: 16, fontSize: 18, width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #111, #1a1a1a)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
                            ✦ EMPEZAR A PLANIFICAR
                        </a>
                    </div>

                    {/* Right Column — Mockup */}
                    <div style={{ background: "#0D0D14", border: "1px solid rgba(254, 214, 39,0.15)", borderRadius: 32, padding: "32px", position: "relative", overflow: "hidden", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.9)" }}>
                        {/* Mockup UI */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                                <Calendar size={18} color="#fed627" /> Planificador de Contenido
                            </div>
                            <div style={{ background: "rgba(254, 214, 39,0.1)", color: "#fed627", padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Mayo 2026</div>
                        </div>
                        
                        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                            <div style={{ background: "rgba(254, 214, 39,0.05)", border: "1px solid rgba(254, 214, 39,0.3)", padding: "10px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ background: "#fed627", color: "#000", fontWeight: 900, fontSize: 10, padding: "4px 8px", borderRadius: 6 }}>BE</div>
                                <div style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>Belfan E-commerce</div>
                            </div>
                            <div style={{ background: "rgba(255, 255, 255,0.02)", border: "1px solid rgba(255, 255, 255,0.05)", padding: "10px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ background: "#333", color: "#fff", fontWeight: 900, fontSize: 10, padding: "4px 8px", borderRadius: 6 }}>MAR</div>
                                <div style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 700 }}>mar E-commerce</div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 16 }}>
                            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(day => (
                                <div key={day} style={{ fontSize: 10, color: "#6B7280", fontWeight: 800, textAlign: "center" }}>{day}</div>
                            ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} style={{ 
                                    aspectRatio: "1/1", 
                                    background: [2, 4, 9, 11].includes(i) ? "rgba(254, 214, 39, 0.08)" : "rgba(255,255,255,0.01)", 
                                    border: [2, 4, 9, 11].includes(i) ? "1px solid rgba(254, 214, 39, 0.3)" : "1px solid rgba(255,255,255,0.03)",
                                    borderRadius: 12,
                                    padding: 8,
                                    position: "relative"
                                }}>
                                    <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700 }}>{i + 1}</div>
                                    {[2, 4, 9, 11].includes(i) && (
                                        <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, height: 4, background: "#fed627", borderRadius: 2 }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Fade overlay */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #0D0D14, transparent)" }}></div>
                    </div>

                </div>
            </section>

            {/* The Solution */}
            <section style={{ padding: "100px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: 16 }}>
                    La Solución: <span className="gradient-text">Postea</span>
                </h2>
                <p style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 60, fontWeight: 500 }}>
                    Toda tu estrategia y contenido semanal en un solo clic
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto 60px" }} className="mobile-grid-1">
                    {[
                        {
                            num: "01",
                            title: "1. Describe tu marca",
                            desc: "Configura tus colores corporativos, tono de voz y estilo. Así la IA creará contenido alineado a tu identidad.",
                            icon: "📤"
                        },
                        {
                            num: "02",
                            title: "2. Haz un solo clic",
                            desc: "Nuestra IA planifica los días de publicación y genera imágenes de marca, copies persuasivos y carruseles.",
                            icon: "🎨"
                        },
                        {
                            num: "03",
                            title: "3. Descarga y publica",
                            desc: "Obtén todo ordenado día a día, listo para copiar, pegar y subir a tus redes sociales.",
                            icon: "📥"
                        }
                    ].map(step => (
                        <div key={step.num} style={{
                            background: "#0D0D14",
                            border: "1px solid rgba(254, 214, 39,0.1)",
                            borderRadius: 32,
                            padding: 40,
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", top: 10, right: 20, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}>{step.num}</div>
                            <div style={{ background: "rgba(254, 214, 39,0.15)", color: "#fed627", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{step.icon}</div>
                            <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{step.title}</h4>
                            <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.6 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: "rgba(254, 214, 39,0.05)",
                    border: "1px solid rgba(254, 214, 39,0.2)",
                    borderRadius: 32,
                    padding: "48px 24px",
                    maxWidth: 800,
                    margin: "0 auto"
                }}>
                    <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800 }}>
                        Genera <span style={{ color: "#fff" }}>toda tu estrategia semanal</span> en <span style={{ color: "#ffe054" }}>un solo clic.</span><br />
                        Lista para publicar y <span style={{ color: "#fed627" }}>conectar con tu audiencia.</span>
                    </p>
                </div>

                <div style={{ display: "flex", gap: 16, maxWidth: 800, margin: "24px auto 0" }} className="mobile-stack">
                    {[
                        { val: "Carruseles", label: "Y POSTS INDIVIDUALES" },
                        { val: "1 Clic", label: "TIEMPO DE ESPERA" },
                        { val: "Copys Listos", label: "PERSUASIVOS Y CON EMOCIÓN" }
                    ].map(stat => (
                        <div key={stat.label} style={{
                            flex: 1,
                            background: "#0A0A10",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 20,
                            padding: "24px 16px",
                            textAlign: "center",
                            position: "relative",
                            zIndex: 10
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{stat.val}</div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "#4B5563", letterSpacing: "0.1em" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonials moved up */}
                <div style={{ marginTop: 120 }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
                        Ok, pero... ¿qué hace a esto distinto?
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 60, opacity: 0.8 }}>
                        La diferencia no es "usar IA". La diferencia es el <span style={{ color: "#fff", fontWeight: 700 }}>mecanismo:</span>
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }} className="mobile-grid-1">
                        {[
                            {
                                icon: "🏭",
                                title: "1) Todo en Uno y Listo",
                                desc: "No son imágenes sueltas. En un solo clic obtienes la imagen de tu marca, el copy persuasivo y el carrusel completo para tus redes."
                            },
                            {
                                icon: "📐",
                                title: "2) Estructura de Carrusel Real",
                                desc: "Genera secuencias de diapositivas en formato vertical 4:5 con una narrativa que lleva al usuario desde el gancho inicial hasta la llamada a la acción final."
                            },
                            {
                                icon: "📦",
                                title: "3) Coherencia Visual",
                                desc: "El contenido generado respeta el estilo visual y paleta de tu marca, logrando un feed profesional y premium de forma automática."
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 32,
                                padding: 40,
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ background: "rgba(254, 214, 39,0.1)", color: "#fed627", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{item.icon}</div>
                                <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{item.title}</h4>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: 80, marginBottom: 40, textAlign: "center" }}>
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10B981", fontSize: 10, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        🙌 Resultados Reales
                    </div>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 40 }}>Lo que dicen los grupos de WhatsApp</h2>

                    <div style={{ maxWidth: "100%", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 150, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 150, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        <div className="scroll-container" style={{ gap: 24, padding: "20px 0" }}>
                            {[
                                "IMG_8120.jpg", "IMG_8121.jpg", "IMG_8146.jpg", "IMG_8151.jpg", "IMG_8153.jpg",
                                "IMG_8120.jpg", "IMG_8121.jpg", "IMG_8146.jpg", "IMG_8151.jpg", "IMG_8153.jpg" // Duplicated for seamless loop
                            ].map((img, i) => (
                                <div key={i} className="scroll-card" style={{
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
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>El sistema completo para dominar tus redes sociales y programar tu contenido.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-grid-1">
                        {[
                            {
                                num: "1",
                                title: "Generador de Estrategia Semanal",
                                desc: "Acceso instantáneo a la herramienta que planifica y crea el contenido completo para toda la semana de tu marca. Con un solo clic tienes la guía visual, copys y estructura listos.",
                                icon: <Zap size={20} />
                            },
                            {
                                num: "2",
                                title: "Creador de Carruseles 4:5",
                                desc: "Genera carruseles con storytelling optimizados para la máxima retención. El formato vertical perfecto para captar la atención de tu audiencia en Instagram, LinkedIn y TikTok.",
                                icon: <Plus size={20} />
                            },
                            {
                                num: "3",
                                title: "Redactor de Copys y Captions",
                                desc: "Textos y ganchos persuasivos diseñados para conectar con tus clientes ideales, listos para copiar, pegar y publicar junto con tus imágenes.",
                                icon: <Layout size={20} />
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: "#0D0D14",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                    <div style={{ background: "rgba(254, 214, 39,0.1)", color: "#fed627", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#fed627", letterSpacing: "0.1em", textTransform: "uppercase" }}>Componente #{item.num}</div>
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


                {/* Bonus Section */}
                <div style={{ marginTop: 140, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Pero eso no es todo...</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>También recibes estos <span style={{ color: "#ffe054", fontWeight: 800 }}>BONUS GRATIS</span> al unirte hoy.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-grid-1">
                        {[
                            {
                                num: "1",
                                title: "Calendario de Contenido de por Vida",
                                desc: "La estructura anual para saber exactamente qué publicar y en qué fechas clave para maximizar tus ventas.",
                                val: "$27",
                                icon: <Layout size={20} />
                            },
                            {
                                num: "2",
                                title: "Guía de Ganchos (Hooks) Virales",
                                desc: "Las mejores plantillas de ganchos que capturan la atención del usuario en los primeros 3 segundos.",
                                val: "$17",
                                icon: <Zap size={20} />
                            },
                            {
                                num: "3",
                                title: "Comunidad Privada de Postea",
                                desc: "Grupo exclusivo de marcas, emprendedores y creadores de contenido compartiendo tácticas, feedback y resultados.",
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
                                border: "1px solid rgba(254, 214, 39,0.1)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
                                    <div style={{ background: "rgba(254, 214, 39,0.1)", color: "#fed627", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#fed627", letterSpacing: "0.1em" }}>BONUS #{item.num}</div>
                                </div>
                                <h4 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{item.title}</h4>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 20 }}>{item.desc}</p>
                                <div style={{ fontSize: 14, color: "#4B5563" }}>Valor: <span style={{ color: "#fff", fontWeight: 700 }}>{item.val}</span></div>
                            </div>
                        ))}
                    </div>


                </div>
            </section>







            {/* Pricing Section */}
            <section style={{ padding: "120px 24px", background: "transparent", scrollMarginTop: "100px" }} id="precio" >
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>Empieza a planificar tu contenido hoy</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64 }}>Acceso inmediato a todas las herramientas. Sin contratos.</p>

                    {/* Inclusion Breakdown List */}
                    <div style={{
                        background: "#08080C",
                        border: "1px solid rgba(254, 214, 39,0.2)",
                        borderRadius: 32,
                        padding: "48px",
                        marginBottom: 64,
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 700,
                        margin: "0 auto 64px",
                        textAlign: "left"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#fed627", letterSpacing: "0.2em", marginBottom: 32, textAlign: "center" }}>TODO LO QUE INCLUYE:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                { t: "Generador de Estrategia Semanal", v: "$359" },
                                { t: "Creador de Carruseles 4:5", v: "$174" },
                                { t: "Redactor de Copys IA", v: "$129" },
                                { t: "Guías de Ganchos Virales", v: "$99" },
                                { t: "Calendario de Contenido", v: "$79" },
                                { t: "Updates de por Vida", v: "Incalculable" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, borderBottom: idx !== 9 ? "1px solid rgba(255,255,255,0.03)" : "none", paddingBottom: idx !== 9 ? 16 : 0 }}>
                                    <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ color: "#10B981", fontWeight: 900 }}>✓</div> {item.t}
                                    </div>
                                    <div style={{ color: "#fff0a8", fontWeight: 700 }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Pricing Card */}
                    <div style={{
                        background: "#08080C",
                        border: "2px solid #fed627",
                        borderRadius: 40,
                        padding: "80px 40px",
                        position: "relative",
                        zIndex: 5,
                        maxWidth: 700,
                        margin: "0 auto",
                        textAlign: "center",
                        boxShadow: "0 40px 100px rgba(254, 214, 39,0.15)",
                        overflow: "hidden"
                    }} className="mobile-full-padding">
                        {/* Launch Badge */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#fed627",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 900,
                            padding: "10px 32px",
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            letterSpacing: "0.1em"
                        }}>OFERTA DE LANZAMIENTO</div>

                        <div style={{ marginTop: 40, marginBottom: 48 }}>
                            <div style={{
                                background: "rgba(16, 185, 129, 0.1)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                                color: "#10B981",
                                fontSize: 13,
                                fontWeight: 800,
                                padding: "6px 20px",
                                borderRadius: 100,
                                display: "inline-flex",
                                marginBottom: 24
                            }}>Ahorras más del 60% hoy 🔥</div>

                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                                <span style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 700, color: "#4B5563", textDecoration: "line-through", marginRight: 12 }}>$197</span>
                                <span style={{ fontSize: "clamp(60px, 12vw, 96px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>$27</span>
                                <span style={{ fontSize: 24, color: "#4B5563", fontWeight: 700 }}>USD</span>
                            </div>
                            <div style={{ marginTop: 24, marginBottom: 12 }}>
                                <span style={{ fontSize: 22, color: "#fff", fontWeight: 900, background: "rgba(254, 214, 39,0.2)", border: "1px solid rgba(254, 214, 39,0.4)", padding: "12px 32px", borderRadius: 100, display: "inline-block", letterSpacing: "0.02em" }}>
                                    Pago Único · Acceso de Por Vida
                                </span>
                            </div>
                            <div style={{ marginTop: 16, background: "rgba(254, 214, 39, 0.1)", border: "1px solid rgba(254, 214, 39, 0.2)", color: "#fed627", fontSize: 14, fontWeight: 800, padding: "8px 24px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8 }}>
                                ⚠️ ATENCIÓN: Quedan {cupos} de los 100 cupos para esta oferta
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left", maxWidth: 450, margin: "0 auto 64px" }}>
                            {[
                                "Acceso inmediato a la plataforma",
                                "Todos los bonus incluidos",
                                "Acceso de por vida (Pago único)",
                                "Soporte y actualizaciones"
                            ].map(feat => (
                                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 18, color: "#D1D5DB", fontWeight: 600 }}>
                                    <div style={{ color: "#fed627", fontSize: 20 }}>✓</div> {feat}
                                </div>
                            ))}
                        </div>

                        <a href={MONTHLY_CHECKOUT_URL} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "24px 40px", borderRadius: 20, fontSize: 24, fontWeight: 900, boxShadow: "0 20px 40px rgba(254, 214, 39,0.3)" }}>
                            ACCEDER A LA APP &rarr;
                        </a>

                        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#10B981", textDecoration: "none", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                                <MessageSquare size={20} /> ¿Dudas? Escríbenos por WhatsApp
                            </a>

                            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
                                <div style={{ fontSize: 11, color: "#4B5563", display: "flex", alignItems: "center", gap: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    <Shield size={14} /> Pago Seguro
                                </div>
                                <div style={{ fontSize: 11, color: "#4B5563", display: "flex", alignItems: "center", gap: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    <Zap size={14} /> Acceso Inmediato
                                </div>
                                <div style={{ fontSize: 11, color: "#4B5563", display: "flex", alignItems: "center", gap: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    <Clock size={14} /> Un solo pago
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section style={{ padding: "80px 24px", background: "transparent" }}>
                <div style={{
                    maxWidth: 850,
                    margin: "0 auto",
                    background: "rgba(13, 13, 20, 0.5)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 40,
                    padding: "80px 40px",
                    textAlign: "center"
                }}>
                    <div style={{ color: "#fed627", fontSize: 12, fontWeight: 900, letterSpacing: "0.2em", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Shield size={16} /> CERO RIESGO PARA TI
                    </div>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 32 }}>Garantía de Funcionamiento 72hs</h2>
                    <p style={{ fontSize: 14, fontStyle: "italic", color: "#4B5563", marginBottom: 48 }}>
                        Postea no es para curiosos. Es para dueños de productos físicos que quieren escalar con volumen real.
                    </p>
                    <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 40 }}>
                        <div style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <Shield size={14} /> REEMBOLSO GARANTIZADO
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <MessageSquare size={14} /> SOPORTE POR EMAIL
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <Clock size={14} /> PROCESO EN 24HS
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: "100px 24px" }} id="faq" >
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 32, fontWeight: 900, textAlign: "center", marginBottom: 48 }}>Preguntas Frecuentes</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            {
                                q: "¿Necesito ser diseñador o copywriter?",
                                a: "No. Necesitas conocer tu marca y tu producto. Postea te entrega toda la estrategia y estructura profesional para que tus redes conecten y vendan."
                            },
                            {
                                q: "¿Esto me garantiza ventas?",
                                a: "No vendemos magia. Te damos consistencia y velocidad: estrategia semanal de un solo clic + copys persuasivos + carruseles. El compromiso con tu marca define los resultados."
                            },
                            {
                                q: "¿Puedo crear videos con esta herramienta?",
                                a: "Por ahora se enfoca en imágenes de marca premium, copys optimizados y carruseles en formato vertical 4:5, que es el formato de mayor conversión en redes sociales."
                            },
                            {
                                q: "¿Sirve para más de una marca?",
                                a: "Sí, no tiene límites. Puedes usarla para todos tus productos físicos, marcas personales o negocios digitales."
                            },
                            {
                                q: "¿Es un pago único?",
                                a: "Sí, es un pago único de solo $37 USD para acceso de por vida a la herramienta. Sin cuotas mensuales ni cobros adicionales."
                            },
                            {
                                q: "¿Ya probé Canva/ChatGPT... por qué esto sería distinto?",
                                a: "Porque esas herramientas te obligan a pensar prompts e ideas desde cero cada día. Postea te planifica y crea la semana completa en un solo clic, logrando coherencia y consistencia."
                            },
                            {
                                q: "¿Tiene algún límite de creación?",
                                a: "No. Como conectas tu propia API de Google AI Studio (que es gratuita en su capa estándar), no tienes límites arbitrarios de la plataforma."
                            },
                            {
                                q: "¿Hay algún plan gratuito para probar?",
                                a: "No ofrecemos plan free. Ofrecemos algo mejor: Garantía de Funcionamiento. Si la app presenta errores técnicos que impidan su uso, te devolvemos el 100% de tu dinero."
                            }
                        ].map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: "80px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 24 }}>
                    <img src="/logo.png" alt="PosteA" style={{ height: 56, objectFit: "contain" }} />
                </div>
                <p style={{ color: "#4B5563", fontSize: 14, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
                    Planifica y genera todo el contenido semanal de tu marca en un solo clic.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 14, color: "#9CA3AF" }}>
                    <a href={WHATSAPP_URL} style={{ textDecoration: "none", color: "inherit" }}>Soporte WhatsApp</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Términos</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacidad</a>
                </div>
                <p style={{ color: "#222", fontSize: 12, marginTop: 40 }}>© 2025 Postea. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}