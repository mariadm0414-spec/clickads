"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Sparkles, Zap, Shield, Clock, Brain, AlertCircle, ShoppingCart, MessageSquare, Plus, Database, Download, Wifi, Battery, ChevronLeft, ChevronRight } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────
const MONTHLY_CHECKOUT_URL = "https://pay.hotmart.com/R104883981X";
const ANNUAL_CHECKOUT_URL = "https://pay.hotmart.com/R104883981X?off=ogsqik0m";
const WHATSAPP_URL = "https://wa.link/pyi5n8";

// ── Components ─────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: "#0D0D14", border: `1px solid ${open ? "rgba(110,0,255,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s", position: "relative", zIndex: 10 }}>
            <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: open ? "#8E44FF" : "#fff", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600, textAlign: "left", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer" }}>
                {q}
                <Plus size={20} style={{ color: "#6E00FF", transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }} />
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
            style={{ position: "relative", userSelect: "none", cursor: "ew-resize", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(110,0,255,0.2)", aspectRatio: "4/5" }}
            onMouseMove={e => dragging.current && updatePos(e.clientX)}
            onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={e => updatePos(e.touches[0].clientX)}
            onTouchStart={e => updatePos(e.touches[0].clientX)}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={after} alt="Después" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", background: "rgba(110,0,255,0.85)", backdropFilter: "blur(6px)", color: "#fff", padding: "5px 12px", borderRadius: 100, zIndex: 10 }}>{afterLabel}</div>
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
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #6E00FF, #4F46E5)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF" }}>Nuevo usuario</span>
                    <span style={{ fontSize: 9, color: "#4B5563" }}>Ahora</span>
                </div>
                <div style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.3 }}>
                    <strong style={{ color: "#fff" }}>{notifications[current].name}</strong> acaba de ingresar al <strong style={{ color: "#8E44FF" }}>{notifications[current].plan}</strong>
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
                // Occasional purple-tinted stars
                const purple = Math.random() > 0.85;
                ctx.fillStyle = purple
                    ? `rgba(167, 139, 250, ${twinkleOpacity})`
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
    const [landingIndex, setLandingIndex] = useState(0);
    const landingImages = ["/100ecom/hola.jpeg", "/100ecom/landing2.jpeg", "/100ecom/landing3.jpeg"];

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
                .gradient-text { background: linear-gradient(135deg, #6E00FF 0%, #8E44FF 50%, #A76EFF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .btn-primary { background: linear-gradient(135deg, #6E00FF, #4B00D1); color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; transition: all 0.25s; align-items: center; gap: 8px; border: none; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(110,0,255,0.5); filter: brightness(1.1); }
                .btn-cta { font-size: 20px; padding: 24px 48px; border-radius: 20px; box-shadow: 0 0 50px rgba(110,0,255,0.4); }

                .pain-card { background: #120A0A; border: 1px solid rgba(255, 68, 68, 0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .pain-card:hover { border-color: rgba(255, 68, 68, 0.4); background: #1A0D0D; }

                .feature-card { background: #0A0A12; border: 1px solid rgba(110,0,255,0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .feature-card:hover { border-color: rgba(110,0,255,0.4); background: #0E0E18; }

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
                    0%, 100% { box-shadow: 0 0 40px rgba(110,0,255,0.4), 0 0 80px rgba(110,0,255,0.15); }
                    50% { box-shadow: 0 0 60px rgba(110,0,255,0.6), 0 0 120px rgba(110,0,255,0.25); }
                }
                .pulse-btn { animation: pulse-glow 3s ease-in-out infinite; }
            `}</style>

            {/* Header */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(3,3,3,0.8)", backdropFilter: "blur(20px)", padding: "14px 24px", borderBottom: "1px solid rgba(110,0,255,0.15)", transition: "all 0.3s" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src="/logo.png" alt="ClickAds" style={{ height: 40, width: "auto" }} />
                        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>ClickAds</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <a href="#precio" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14, background: "linear-gradient(135deg, #6E00FF, #4B00D1)", boxShadow: "0 4px 20px rgba(110,0,255,0.4)" }}>ACCEDER A LA APP</a>
                    </div>
                </div>
            </nav>

            {/* Galaxy Starfield Hero */}
            <section className="hero-section" style={{ padding: "140px 24px 80px", position: "relative", overflow: "hidden", background: "transparent", minHeight: "100vh", display: "flex", alignItems: "center" }}>
                {/* Animated Canvas Galaxy */}

                {/* Purple Radial Glow */}
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(110,0,255,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }}></div>
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: "radial-gradient(ellipse at center, rgba(75,0,209,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }}></div>

                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2, width: "100%" }}>
                    <div
                        className="hero-badge"
                        style={{ background: "rgba(110,0,255,0.15)", border: "1px solid rgba(110,0,255,0.4)", color: "#A76EFF", fontSize: 13, fontWeight: 700, padding: "8px 24px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, maxWidth: "100%", backdropFilter: "blur(10px)" }}
                    >
                        <span style={{ fontSize: 16 }}>✦</span> La APP #1 para Dropshipping & Ecommerce 🚀
                    </div>

                    <h1 style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 32, color: "#fff" }}>
                        Crea anuncios ganadores y landing pages de <br />
                        <span className="gradient-text">alta conversión con ClickADS</span><br />
                        en menos de 10 minutos
                    </h1>

                    <p style={{ fontSize: 20, color: "#A76EFF", maxWidth: 750, margin: "0 auto 48px", lineHeight: 1.7, fontWeight: 400 }}>
                        Deja de pelear con Canva y diseñadores lentos. Genera imágenes y landing pages listas para tener anuncios publicitarios ganadores.<br /><br />
                        <strong style={{ color: "#fff" }}>Sin límites de creación. Úsala para todos tus productos.</strong>
                    </p>

                    <div style={{ maxWidth: 800, margin: "0 auto 64px", borderRadius: 32, overflow: "hidden", border: "1px solid rgba(110,0,255,0.25)", boxShadow: "0 30px 80px rgba(110,0,255,0.2), 0 0 0 1px rgba(110,0,255,0.1)" }}>
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                            <iframe
                                src="https://www.youtube.com/embed/Iy-_RtiJW18"
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }} className="mobile-stack">
                        <a href="#precio" className="btn-primary btn-cta pulse-btn" style={{ background: "linear-gradient(135deg, #6E00FF 0%, #4B00D1 100%)", borderRadius: 20, padding: "22px 56px", fontSize: 22, fontWeight: 900, boxShadow: "0 0 50px rgba(110,0,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                            ✦ ACCEDER A LA APP
                        </a>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Moved below Hero CTA */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3 }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Resultados reales de <span className="gradient-text">personas reales</span></h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 32, opacity: 0.7 }}>Mira cómo otros ya están escalando con ClickAds.</p>

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
                                        <p style={{ fontSize: 12, color: "#6E00FF", fontWeight: 700 }}>{video.name} - {video.role}</p>
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
                        Estos son algunos de los <span className="gradient-text">100 creativos</span> que puedes lograr en 10 minutos
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40, opacity: 0.7 }}>
                        Imágenes de alto impacto creadas en tiempo récord, listas para Meta Ads
                    </p>

                    <div style={{ maxWidth: 1400, margin: "0 auto", overflow: "hidden", position: "relative" }}>
                        {/* Gradient Fades for Smooth Scroll Appearance */}
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        {/* Row 1 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginBottom: 20 }}>
                            {[
                                "melatonina_1774495323718 2.jpg", "pesitas_1774498387335.jpg", "muimia_1774418282240.jpg", "100Ecom_Creativo_1.png",
                                "pet_1774458298307.jpg", "instax_1774496370890.jpg", "melatonina_1774495537782.jpg", "petpwr_1774305718054.jpg",
                                "melatonina_1774495894959.jpg", "pet_1774416065704.jpg", "melatonina_1774495323718.jpg", "muimia_1774418952190.jpg",
                                "pesitas_1774498457160.jpg", "melatonina_1774495894959 2.jpg", "melatonina_1774495537782 2.jpg",
                                // Duplicate for infinite effect
                                "melatonina_1774495323718 2.jpg", "pesitas_1774498387335.jpg", "muimia_1774418282240.jpg", "100Ecom_Creativo_1.png",
                                "pet_1774458298307.jpg", "instax_1774496370890.jpg", "melatonina_1774495537782.jpg", "petpwr_1774305718054.jpg",
                                "melatonina_1774495894959.jpg", "pet_1774416065704.jpg", "melatonina_1774495323718.jpg", "muimia_1774418952190.jpg",
                                "pesitas_1774498457160.jpg", "melatonina_1774495894959 2.jpg", "melatonina_1774495537782 2.jpg"
                            ].map((img, i) => (
                                <div key={`r1-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 2 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "100Ecom_Creativo_4.png", "termo_1774497836306.jpg", "vit_1774496939536.jpg", "termo_1774497274088.jpg",
                                "100Ecom_Creativo_2.png", "vit_1774497060412.jpg", "termo_1774497943422.jpg", "100Ecom_Creativo_5.png",
                                "termo_1774498053258.jpg", "vit_1774496724268.jpg", "termo_1774497427714.jpg", "100Ecom_Creativo_3.png",
                                "termo_1774497246871.jpg", "vit_1774496841694.jpg", "termo_1774498156869.jpg", "termo_1774497774142.jpg",
                                // Duplicate for infinite effect
                                "100Ecom_Creativo_4.png", "termo_1774497836306.jpg", "vit_1774496939536.jpg", "termo_1774497274088.jpg",
                                "100Ecom_Creativo_2.png", "vit_1774497060412.jpg", "termo_1774497943422.jpg", "100Ecom_Creativo_5.png",
                                "termo_1774498053258.jpg", "vit_1774496724268.jpg", "termo_1774497427714.jpg", "100Ecom_Creativo_3.png",
                                "termo_1774497246871.jpg", "vit_1774496841694.jpg", "termo_1774498156869.jpg", "termo_1774497774142.jpg"
                            ].map((img, i) => (
                                <div key={`r2-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 3 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginTop: 20, marginBottom: 20 }}>
                            {[
                                "pet_1774416065704.jpg", "melatonina_1774495894959.jpg", "100Ecom_Creativo_1.png", "muimia_1774418282240.jpg",
                                "termo_1774498053258.jpg", "melatonina_1774495323718.jpg", "instax_1774496370890.jpg", "100Ecom_Creativo_4.png",
                                "vit_1774497060412.jpg", "pesitas_1774498457160.jpg", "pet_1774458298307.jpg", "termo_1774497246871.jpg",
                                "melatonina_1774495537782 2.jpg", "100Ecom_Creativo_5.png", "melatonina_1774495894959 2.jpg",
                                "petpwr_1774305718054.jpg",
                                // Duplicate for infinite effect
                                "pet_1774416065704.jpg", "melatonina_1774495894959.jpg", "100Ecom_Creativo_1.png", "muimia_1774418282240.jpg",
                                "termo_1774498053258.jpg", "melatonina_1774495323718.jpg", "instax_1774496370890.jpg", "100Ecom_Creativo_4.png",
                                "vit_1774497060412.jpg", "pesitas_1774498457160.jpg", "pet_1774458298307.jpg", "termo_1774497246871.jpg",
                                "melatonina_1774495537782 2.jpg", "100Ecom_Creativo_5.png", "melatonina_1774495894959 2.jpg",
                                "petpwr_1774305718054.jpg"
                            ].map((img, i) => (
                                <div key={`r3-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <img src={`/imagenes-creadas/${img}`} alt="Creativo" style={{ width: "auto", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>

                        {/* Row 4 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "100Ecom_Creativo_3.png", "vit_1774496841694.jpg", "termo_1774497943422.jpg", "melatonina_1774495537782.jpg",
                                "termo_1774497427714.jpg", "muimia_1774418952190.jpg", "termo_1774497836306.jpg", "vit_1774496724268.jpg",
                                "pesitas_1774498387335.jpg", "100Ecom_Creativo_2.png", "termo_1774498156869.jpg", "melatonina_1774495323718 2.jpg",
                                "vit_1774496939536.jpg", "termo_1774497274088.jpg", "termo_1774497774142.jpg", "100Ecom_Creativo_1.png",
                                // Duplicate for infinite effect
                                "100Ecom_Creativo_3.png", "vit_1774496841694.jpg", "termo_1774497943422.jpg", "melatonina_1774495537782.jpg",
                                "termo_1774497427714.jpg", "muimia_1774418952190.jpg", "termo_1774497836306.jpg", "vit_1774496724268.jpg",
                                "pesitas_1774498387335.jpg", "100Ecom_Creativo_2.png", "termo_1774498156869.jpg", "melatonina_1774495323718 2.jpg",
                                "vit_1774496939536.jpg", "termo_1774497274088.jpg", "termo_1774497774142.jpg", "100Ecom_Creativo_1.png"
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
                        <div style={{ background: "rgba(110,0,255,0.1)", border: "1px solid rgba(110,0,255,0.2)", color: "#8E44FF", fontSize: 13, fontWeight: 800, padding: "8px 20px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }} className="mobile-center-flex">
                            <Zap size={14} /> GENERADOR DE LANDINGS CON IA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
                            Crea Landings de <br />
                            <span style={{ background: "rgba(110,0,255,0.15)", padding: "0 12px", borderRadius: 8 }}>Venta Profesionales</span> <br />
                            en <span className="gradient-text">Menos de 10 Minutos</span>
                        </h2>
                        <p style={{ fontSize: 19, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 48, maxWidth: 540 }} className="mobile-center-flex">
                            Nuestra IA genera secciones de landing pages optimizadas para vender, utilizando estructuras probadas de marketing de respuesta directa.
                            Convierte visitantes en compradores sin tener que contratar diseñadores ni copywriters.
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
                                width: 320,
                                height: 650,
                                background: "#080808",
                                borderRadius: 54,
                                padding: "16px",
                                border: "10px solid #1a1a1a",
                                boxShadow: "0 60px 120px -20px rgba(0,0,0,0.9), 0 0 50px rgba(110,0,255,0.25)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                {/* Scrollable Content inside Phone */}
                                <div className="custom-scrollbar" style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 36,
                                    background: "#fff",
                                    overflowY: "auto",
                                    position: "relative",
                                    WebkitOverflowScrolling: "touch",
                                    paddingTop: 44
                                }} key={landingIndex}>
                                    <img
                                        src={landingImages[landingIndex]}
                                        alt="Landing Demo Example"
                                        style={{ width: "100%", display: "block" }}
                                    />
                                </div>
                                {/* Status Bar for realism */}
                                <div style={{ position: "absolute", top: 12, left: 0, right: 0, padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 110, fontSize: 13, fontWeight: 700, color: "#000", fontFamily: "sans-serif", pointerEvents: "none" }}>
                                    <span>11:42 p.m.</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 10 }}>
                                            {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 3, height: i * 2.5, background: "#000", borderRadius: 1 }}></div>)}
                                        </div>
                                        <Wifi size={14} />
                                        <Battery size={16} />
                                    </div>
                                </div>
                                {/* Device elements */}
                                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 140, height: 32, background: "#1a1a1a", borderBottomLeftRadius: 18, borderBottomRightRadius: 18, zIndex: 100 }}></div>
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
                        <div style={{ position: "absolute", bottom: -50, fontSize: 11, color: "#6B7280", fontWeight: 800, letterSpacing: 2, background: "rgba(110,0,255,0.05)", padding: "4px 12px", borderRadius: 100 }}>↓ HAZ SCROLL PARA VER LA LANDING</div>
                    </div>
                </div>
            </section>

            {/* Pain Points (Los Dolores) */}
            <section style={{ padding: "100px 24px", background: "transparent" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>¿Tienes un Ecommerce<br />o haces Dropshipping?</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 48, opacity: 0.8 }}>Entonces seguro te pasa esto...</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { icon: "🗓️", text: "Contratas un diseñador que se demora 8 dias para entregarte imagenes y landing pages por lo cual no puedes testear todos los dias" },
                            { icon: "🎨", text: "Pasas todo el dia en canva" },
                            { icon: "🌐", text: "Pasas horas creando una landing page" },
                            { icon: "📈", text: "Eres muy bueno haciendo ADS pero no creativos ni landing pages" },
                            { icon: "🤖", text: "Escribes un prompt en ChatGPT y te genera una imagen completamente diferente a lo que quieres" },
                            { icon: "❌", text: "ChatGPT y Gemini te dan imagenes básicas que no venden" },
                            { icon: "⏳", text: "Te enfocas mucho en crear imágenes y descuidas las otras áreas de tu negocio" },
                            { icon: "💰", text: "Debes pagarle 2 millones de pesos mensuales o más para pagarle a un diseñador. Dinero que puedes usar en Pauta" },
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
                        background: "rgba(255, 68, 68, 0.03)",
                        border: "1px solid rgba(255, 68, 68, 0.1)",
                        borderRadius: 32,
                        padding: "60px 40px"
                    }}>
                        <h3 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.3 }}>
                            El problema no eres tú. <br />
                            <span style={{ color: "#FF4444", background: "rgba(255, 68, 68, 0.15)", padding: "0 10px", borderRadius: 8 }}>
                                El problema es que creativos y landing pages mediocres no venden.
                            </span>
                        </h3>
                    </div>

                    {/* Comparison Section (The Truth) */}
                    <div style={{ marginTop: 100, textAlign: "center" }}>
                        <div style={{ background: "rgba(110,0,255,0.1)", border: "1px solid rgba(110,0,255,0.2)", color: "#8E44FF", fontSize: 10, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <AlertCircle size={12} /> EL PROBLEMA ES...
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
                            La cruda verdad sobre los <span className="gradient-text">anuncios digitales</span>
                        </h2>
                        <p style={{ fontSize: 20, color: "#9CA3AF", maxWidth: 850, margin: "0 auto 60px", lineHeight: 1.6 }}>
                            La parte más importante de tu embudo es <strong style={{ color: "#fff" }}>TAMBIÉN</strong> la más difícil de hacer bien... el creativo.
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
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Requiere horas de diseño y copywriting</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>No hay garantía de que el CTR sea alto</span>
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
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Más de $500 USD por set de anuncios</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Largas esperas, poca flexibilidad</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Big Brands */}
                            <div className="feature-card" style={{ textAlign: "left", background: "#0D0D14", position: "relative", zIndex: 10 }}>
                                <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, aspectRatio: "16/10" }}>
                                    <img src="/problemas/big_brands_ads_scale_1774410505031.png" alt="Grandes Marcas" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Grandes marcas tienen presupuestos</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Es imposible competir contra sus millones</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 12, fontSize: 16, color: "#9CA3AF", lineHeight: 1.4 }}>
                                        <span style={{ color: "#FF4444" }}>❌</span> <span>Realizan pruebas A/B masivas cada hora</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: "#08080C",
                            border: "1px solid rgba(110,0,255,0.2)",
                            borderRadius: 32,
                            position: "relative",
                            zIndex: 5,
                            padding: "40px",
                            maxWidth: 900,
                            margin: "0 auto"
                        }}>
                            <p style={{ fontSize: 22, color: "#E5E7EB", lineHeight: 1.6 }}>
                                No es de extrañar que tantos emprendedores quemen su presupuesto sin ver retornos. <br />
                                <strong style={{ color: "#8E44FF" }}>Pero existe una forma más rápida, inteligente y económica de ganar...</strong>
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Generic AI Comparison (The Real Problem) */}
            <section style={{ padding: "100px 24px", background: "transparent", borderTop: "1px solid rgba(110,0,255,0.1)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, marginBottom: 32, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.02em" }}>
                        El problema real... <br />
                        <span style={{ color: "#FF4444" }}>Usar IA genérica para crear imagenes para Pauta Publicitaria es como tirar tu presupuesto a la basura y esperar un milagro.</span>
                    </h2>

                    <div style={{ color: "#9CA3AF", fontSize: 20, marginBottom: 56, lineHeight: 1.6, maxWidth: 840, margin: "0 auto 56px", fontWeight: 400 }}>
                        <p style={{ marginBottom: 24 }}>
                            Intentas ahorrar tiempo usando ChatGPT o Midjourney para tus anuncios, pero la realidad es otra:
                        </p>
                        <p style={{ color: "#D1D5DB" }}>
                            Pasas horas frente a la pantalla escribiendo comandos complicados, solo para recibir imágenes que parecen "arte extraño" pero que no venden ni un centavo.
                        </p>
                    </div>

                    <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40, color: "#fff" }}>La dolorosa realidad:</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 840, margin: "0 auto" }}>
                        {/* Bloque Naranja */}
                        <div style={{ background: "#160B03", border: "1px solid rgba(251,146,60,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#FED7AA", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Si parece falso, nadie te compra:</strong> ChatGPT grita "diseño barato" y destruyen tu credibilidad en un segundo.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Rojo */}
                        <div style={{ background: "#170505", border: "1px solid rgba(239,68,68,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#FECACA", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>💸</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Deja de pelear con ChatGPT y crea imagenes que venden:</strong> Cada minuto que pasas intentando con ChatGPT, es dinero que sale de tu bolsillo y pierdes.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Gris / Red Flag */}
                        <div style={{ background: "#0B0B0D", border: "1px solid rgba(107,114,128,0.25)", padding: "22px 32px", borderRadius: 20, fontSize: 18, color: "#E5E7EB", fontWeight: 500, lineHeight: 1.5, textAlign: "left", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 24, flexShrink: 0 }}>🚩</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Lo artificial espanta a tus clientes:</strong> La estética plástica de ChatGPT mata la confianza. Si tu anuncio parece de juguete, tu negocio también.
                                </div>
                            </div>
                        </div>

                        {/* Bloque Morado (Conclusión) */}
                        <div style={{ background: "#0D031A", border: "1px solid rgba(110,0,255,0.3)", padding: "26px 32px", borderRadius: 20, fontSize: 18, color: "#A76EFF", fontWeight: 500, lineHeight: 1.5, textAlign: "left", marginTop: 8, boxShadow: "0 0 40px rgba(110,0,255,0.08)", position: "relative", zIndex: 10 }} className="mobile-pill">
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }} className="mobile-col-center">
                                <span style={{ fontSize: 28, flexShrink: 0 }}>🎯</span>
                                <div>
                                    <strong style={{ color: "#fff", fontWeight: 800 }}>Tu marketing no es un experimento, es una inversión:</strong> Deja de "probar suerte" con IAs que no entienden de ventas. <strong style={{ color: "#8E44FF" }}>Menos arte, más ROI.</strong>
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
                        <div style={{ background: "rgba(110,0,255,0.1)", border: "1px solid rgba(110,0,255,0.2)", color: "#8E44FF", fontSize: 11, fontWeight: 800, padding: "6px 16px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }} className="mobile-center-flex">
                            <Sparkles size={12} /> GENERADOR DE IMÁGENES CON IA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                            Del celular <span className="gradient-text">al anuncio<br />de lujo</span> en segundos
                        </h2>
                        <p style={{ fontSize: 17, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
                            Sube la foto de tu producto, describe el estilo que quieres y nuestra IA genera múltiples variaciones profesionales listas para publicar en Meta Ads. Sin diseñador, sin Photoshop.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }} className="mobile-center-flex">
                            {[
                                { text: "Foto de celular → Creativo de agencia" },
                                { text: "Fondos, estilos y ángulos automáticos" },
                                { text: "4 variaciones en menos de 30 segundos" },
                                { text: "Integrado con el módulo Espía" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, fontWeight: 600, color: "#E5E7EB" }}>
                                    <div style={{ color: "#6E00FF", fontSize: 20, fontWeight: 900, flexShrink: 0 }}>✓</div> {item.text}
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

            {/* The Solution */}
            <section style={{ padding: "100px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: 16 }}>
                    La Solución: <span className="gradient-text">ClickADS</span>
                </h2>
                <p style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 60, fontWeight: 500 }}>
                    Una APP de Volumen Extremo de Creativos para Productos Físicos
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto 60px" }} className="mobile-grid-1">
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
                            border: "1px solid rgba(110,0,255,0.1)",
                            borderRadius: 32,
                            padding: 40,
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", top: 10, right: 20, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}>{step.num}</div>
                            <div style={{ background: "rgba(110,0,255,0.15)", color: "#6E00FF", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{step.icon}</div>
                            <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{step.title}</h4>
                            <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.6 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: "rgba(110,0,255,0.05)",
                    border: "1px solid rgba(110,0,255,0.2)",
                    borderRadius: 32,
                    padding: "48px 24px",
                    maxWidth: 800,
                    margin: "0 auto"
                }}>
                    <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800 }}>
                        Genera <span style={{ color: "#fff" }}>100 creativos estáticos</span> en <span style={{ color: "#8E44FF" }}>~10 minutos.</span><br />
                        Listos para testear en <span style={{ color: "#6E00FF" }}>Meta Ads.</span>
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
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ background: "rgba(110,0,255,0.1)", color: "#6E00FF", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{item.icon}</div>
                                <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{item.title}</h4>
                                <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Testimonials Section */}
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
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>El sistema completo para escalar tu operación creativa.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-grid-1">
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
                            },
                            {
                                num: "5",
                                title: "Generador de Landing Pages",
                                desc: "Crea landing pages de alta conversión listas para exportar e integrar directamente en Shopify, WooCommerce y otras plataformas. Sin código, sin diseñador, en minutos.",
                                icon: <Wifi size={20} />
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
                                    <div style={{ background: "rgba(110,0,255,0.1)", color: "#6E00FF", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#6E00FF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Componente #{item.num}</div>
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
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>También recibes estos <span style={{ color: "#8E44FF", fontWeight: 800 }}>BONUS GRATIS</span> al unirte hoy.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="mobile-grid-1">
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
                                border: "1px solid rgba(110,0,255,0.1)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
                                    <div style={{ background: "rgba(110,0,255,0.1)", color: "#6E00FF", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: "#6E00FF", letterSpacing: "0.1em" }}>BONUS #{item.num}</div>
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
                        background: "linear-gradient(135deg, rgba(110,0,255,0.1) 0%, rgba(110,0,255,0.05) 100%)",
                        border: "1px solid #6E00FF",
                        borderRadius: 32,
                        padding: "48px 32px",
                        maxWidth: 1100,
                        margin: "40px auto 0",
                        textAlign: "center"
                    }}>
                        <div style={{ background: "#6E00FF", color: "#fff", fontSize: 12, fontWeight: 900, padding: "6px 16px", borderRadius: 100, display: "inline-block", marginBottom: 20 }}>SUPER BONUS EXTRA</div>
                        <p style={{ fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 800, color: "#fff", lineHeight: 1.4 }}>
                            Tendrás clases dentro de la plataforma de como manejar la herramienta y de expertos en creativos y Ecommerce todo el tiempo.
                        </p>
                    </div>
                </div>
            </section>







            {/* Pricing Section */}
            <section style={{ padding: "120px 24px", background: "transparent", scrollMarginTop: "100px" }} id="precio" >
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>Empieza a escalar tu Ecommerce hoy</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64 }}>Acceso inmediato a todas las herramientas. Sin contratos.</p>

                    {/* Inclusion Breakdown List */}
                    <div style={{
                        background: "#08080C",
                        border: "1px solid rgba(110,0,255,0.2)",
                        borderRadius: 32,
                        padding: "48px",
                        marginBottom: 64,
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 700,
                        margin: "0 auto 64px",
                        textAlign: "left"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#6E00FF", letterSpacing: "0.2em", marginBottom: 32, textAlign: "center" }}>TODO LO QUE INCLUYE:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                { t: "Generador de Volumen Industrial", v: "$359" },
                                { t: "Angle-Splitter Automático", v: "$174" },
                                { t: "Base de Conocimiento", v: "$99" },
                                { t: "Exportación a Meta Ads", v: "$63" },
                                { t: "BONUS: Plantillas de Copy", v: "$99" },
                                { t: "BONUS: Guía de Ángulos", v: "$63" },
                                { t: "BONUS: Comunidad Privada", v: "$44" },
                                { t: "BONUS: Updates de por Vida", v: "Incalculable" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, borderBottom: idx !== 7 ? "1px solid rgba(255,255,255,0.03)" : "none", paddingBottom: idx !== 7 ? 16 : 0 }}>
                                    <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ color: "#10B981", fontWeight: 900 }}>✓</div> {item.t}
                                    </div>
                                    <div style={{ color: "#4B5563", fontWeight: 600 }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Pricing Card */}
                    <div style={{
                        background: "#08080C",
                        border: "2px solid #6E00FF",
                        borderRadius: 40,
                        padding: "80px 40px",
                        position: "relative",
                        zIndex: 5,
                        maxWidth: 700,
                        margin: "0 auto",
                        textAlign: "center",
                        boxShadow: "0 40px 100px rgba(110,0,255,0.15)",
                        overflow: "hidden"
                    }} className="mobile-full-padding">
                        {/* Launch Badge */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#6E00FF",
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
                                <span style={{ fontSize: "clamp(60px, 12vw, 96px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>$27</span>
                                <span style={{ fontSize: 24, color: "#4B5563", fontWeight: 700 }}>/mes</span>
                            </div>
                            <p style={{ fontSize: 18, color: "#9CA3AF", marginTop: 12, fontWeight: 500 }}>Acceso por 30 días · Sin permanencia</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left", maxWidth: 450, margin: "0 auto 64px" }}>
                            {[
                                "Acceso inmediato a la plataforma",
                                "Todos los bonus incluidos",
                                "Cancela o pausa cuando quieras",
                                "Prueba un mes sin compromiso"
                            ].map(feat => (
                                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 18, color: "#D1D5DB", fontWeight: 600 }}>
                                    <div style={{ color: "#6E00FF", fontSize: 20 }}>✓</div> {feat}
                                </div>
                            ))}
                        </div>

                        <a href={MONTHLY_CHECKOUT_URL} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "24px 40px", borderRadius: 20, fontSize: 24, fontWeight: 900, boxShadow: "0 20px 40px rgba(110,0,255,0.3)" }}>
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
                                    <Clock size={14} /> Cancela cuando quieras
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
                    <div style={{ color: "#6E00FF", fontSize: 12, fontWeight: 900, letterSpacing: "0.2em", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Shield size={16} /> CERO RIESGO PARA TI
                    </div>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 32 }}>Garantía de Funcionamiento 72hs</h2>
                    <p style={{ fontSize: 14, fontStyle: "italic", color: "#4B5563", marginBottom: 48 }}>
                        ClickAds no es para curiosos. Es para dueños de productos físicos que quieren escalar con volumen real.
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
                                a: "Ofrecemos un plan flexible de pago mensual por solo $27 USD, sin permanencia obligatoria."
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
                                a: "No ofrecemos plan free. Ofrecemos algo mejor: Garantía de Funcionamiento. Si la app presenta errores técnicos que impidan su uso, te devolvemos el 100% de tu dinero."
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
