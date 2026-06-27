"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const GalaxyCanvas = dynamic(() => import("@/app/components/GalaxyCanvas"), { ssr: false });
const NotificationToast = dynamic(() => import("@/app/components/NotificationToast"), { ssr: false });
const BeforeAfterSlider = dynamic(() => import("@/app/components/BeforeAfterSlider"), { ssr: false });

import Link from "next/link";
import { Sparkles, Zap, Shield, Clock, Brain, AlertCircle, ShoppingCart, MessageSquare, Plus, Database, Download, Wifi, Battery, ChevronLeft, ChevronRight, Video, ShieldAlert, Layout, Play, Pause } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────
const MONTHLY_CHECKOUT_URL = "https://pay.hotmart.com/K105295235F?off=63n0f59e";
const ANNUAL_CHECKOUT_URL = "https://pay.hotmart.com/K105295235F?off=63n0f59e";
const WHATSAPP_URL = "https://wa.link/pyi5n8";

// ── Components ─────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: "#0D0D14", border: `1px solid ${open ? "rgba(139, 92, 246,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s", position: "relative", zIndex: 10 }}>
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





// ── Galaxy Canvas Component ───────────────────────────────────────────────


// ── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
    const showcaseLandings = [
        { url: "#precio", name: "Jungle Quest", image: "/100ecom/landing2.jpeg" },
        { url: "#precio", name: "Dewalt Combo", image: "/100ecom/hola.jpeg" },
        { url: "#precio", name: "Molacha Shampoos", image: "/100ecom/landing3.jpeg" },
    ];

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const numCards = showcaseLandings.length;
    const anglePerCard = 360 / numCards;
    const cardWidth = isMobile ? 150 : 200;
    const cardHeight = isMobile ? 285 : 380;
    const stageHeight = isMobile ? 380 : 480;
    const radius = isMobile ? 140 : 220;

    const [rotationY, setRotationY] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [hasTransition, setHasTransition] = useState(false);
    const animRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isPausedRef = useRef(isPaused);
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const animate = () => {
            if (!isPausedRef.current) {
                setRotationY((r) => r - 0.3);
            }
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, []);

    const rotateCarousel = (directionAngle: number) => {
        setHasTransition(true);
        setRotationY((r) => r + directionAngle);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setHasTransition(false);
        }, 500);
    };

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

    const [creativeCount, setCreativeCount] = useState(10);
    useEffect(() => {
        let count = 10;
        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 3) + 2;
            if (count >= 100) {
                setCreativeCount(100);
                clearInterval(interval);
            } else {
                setCreativeCount(count);
            }
        }, 60);
        return () => clearInterval(interval);
    }, []);
    const landingImages = ["/100ecom/hola.jpeg", "/100ecom/landing2.jpeg", "/100ecom/landing3.jpeg"];

    const nextLanding = () => setLandingIndex((prev) => (prev + 1) % landingImages.length);
    const prevLanding = () => setLandingIndex((prev) => (prev - 1 + landingImages.length) % landingImages.length);

    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden", position: "relative" }}>
            <GalaxyCanvas />
            <NotificationToast />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                .gradient-text { background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .btn-primary { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-flex; transition: all 0.25s; align-items: center; gap: 8px; border: none; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(139, 92, 246,0.5); filter: brightness(1.1); }
                .btn-cta { font-size: 20px; padding: 24px 48px; border-radius: 20px; box-shadow: 0 0 50px rgba(139, 92, 246,0.4); }

                .pain-card { background: #120A0A; border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .pain-card:hover { border-color: rgba(139, 92, 246, 0.4); background: #1A0D0D; }

                .feature-card { background: #0A0A12; border: 1px solid rgba(139, 92, 246,0.2); border-radius: 24px; padding: 32px; transition: all 0.3s; position: relative; z-index: 5; }
                .feature-card:hover { border-color: rgba(139, 92, 246,0.4); background: #0E0E18; }

                /* Galaxy starfield canvas */
                #galaxy-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.6; }

                /* Shooting star effect */
                @keyframes shootingStar {
                    0% { transform: translateX(0) translateY(0); opacity: 1; }
                    100% { transform: translateX(200px) translateY(200px); opacity: 0; }
                }

                @media (min-width: 769px) {
                    .desktop-hide { display: none !important; }
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
                    .mobile-col-center { flex-wrap: wrap !important; }
                    .mobile-gallery-grid {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 8px !important;
                        padding: 0 16px;
                    }
                    .mobile-gallery-item {
                        border-radius: 8px !important;
                        overflow: hidden;
                        aspect-ratio: 1;
                        position: relative;
                        background: #111;
                    }
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
                    .scroll-card { height: 160px !important; border-radius: 12px !important; }
                    .scroll-card > div { width: 128px !important; }
                    .slider-container { width: 100% !important; max-width: 320px !important; margin: 0 auto !important; }
                    .hero-badge { white-space: normal !important; line-height: 1.4 !important; }
                    section { padding: 32px 20px !important; }
                    .hero-section { padding-top: 60px !important; padding-bottom: 40px !important; min-height: auto !important; }
                    .btn-cta { width: 100%; justify-content: center; padding: 20px !important; font-size: 18px !important; }
                    h1 { font-size: 32px !important; line-height: 1.2 !important; }
                    h2 { font-size: 26px !important; line-height: 1.2 !important; }
                    h3 { font-size: 22px !important; line-height: 1.2 !important; }
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
                    will-change: transform;
                }
                .scroll-container-reverse {
                    display: flex;
                    width: max-content;
                    animation: scroll-reverse 45s linear infinite;
                    will-change: transform;
                }
                .scroll-container:hover, .scroll-container-reverse:hover {
                    animation-play-state: paused;
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 40px rgba(139, 92, 246,0.4), 0 0 80px rgba(139, 92, 246,0.15); }
                    50% { box-shadow: 0 0 60px rgba(139, 92, 246,0.6), 0 0 120px rgba(139, 92, 246,0.25); }
                }
                .pulse-btn { animation: pulse-glow 3s ease-in-out infinite; }
                .no-scroll-bar::-webkit-scrollbar { display: none !important; }
                .no-scroll-bar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
            `}</style>

            {/* Top Banner */}
            <div style={{ background: "#000", padding: "12px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 1001, position: "relative", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }}></span>
                    Lanzamiento 2.0 · <strong style={{ color: "#fff" }}>Nano Banana 2 ya disponible</strong>
                </span>
                <a href="#precio" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#fff", textDecoration: "none", fontWeight: 600, transition: "background 0.2s" }} className="hover:bg-white/10">
                    Aprovechar
                </a>
            </div>

            {/* Header */}
            <nav style={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(3,3,3,0.8)", backdropFilter: "blur(20px)", padding: "16px 24px", borderBottom: "1px solid rgba(255, 255, 255,0.05)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Image src="/logo.png" alt="ClickADS Logo" width={100} height={32} style={{ height: 32, width: "auto", objectFit: "contain" }} priority />
                        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>
                            Click<span style={{ color: "#8B5CF6" }}>Ads</span>
                        </span>
                    </div>
                    


                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <a href="#precio" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14, borderRadius: 100, background: "linear-gradient(90deg, #EC4899, #8B5CF6)", boxShadow: "0 4px 20px rgba(236, 72, 153, 0.4)", whiteSpace: "nowrap" }}>
                            Quiero mis creativos
                        </a>
                    </div>
                </div>
            </nav>

            {/* Galaxy Starfield Hero */}
            <section className="hero-section" style={{ padding: "100px 24px 80px", position: "relative", overflow: "hidden", background: "transparent", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                
                {/* Floating Images (Ads) */}
                <div className="mobile-hide" style={{ position: "absolute", top: "5%", left: "8%", width: 200, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", transform: "rotate(-4deg)", zIndex: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                    <img src="/imagenes-creadas/fem_1779245634093.jpg" alt="Generated Ad 1" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <div className="mobile-hide" style={{ position: "absolute", bottom: "5%", left: "15%", width: 240, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", transform: "rotate(3deg)", zIndex: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                    <img src="/imagenes-creadas/nad_boost_1779245622880.jpg" alt="Generated Ad 2" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <div className="mobile-hide" style={{ position: "absolute", top: "15%", right: "8%", width: 180, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", transform: "rotate(5deg)", zIndex: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                    <img src="/imagenes-creadas/gomitas_de_vinagre_de_manzana_1779245608634.jpg" alt="Generated Ad 3" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <div className="mobile-hide" style={{ position: "absolute", bottom: "0%", right: "8%", width: 240, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", transform: "rotate(-2deg)", zIndex: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                    <img src="/imagenes-creadas/shampoo_control_grasa_1779245599622.jpg" alt="Generated Ad 4" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>

                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2, width: "100%" }}>
                    <div
                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#9CA3AF", fontSize: 11, fontWeight: 700, padding: "8px 24px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}
                    >
                        SISTEMA DE VOLUMEN PARA META ADS
                    </div>

                    <h1 style={{ fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 32, color: "#fff" }}>
                        100 anuncios que<br/>
                        venden,<br/>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: "#fff" }}>en 10 minutos.</span>
                    </h1>

                    <p style={{ fontSize: 18, color: "#9CA3AF", maxWidth: 550, margin: "0 auto 48px", lineHeight: 1.6, fontWeight: 400 }}>
                        Cargas tu producto una vez. ClickADS genera +100 creativos con <strong style={{color:"#fff"}}>ángulos de venta reales</strong> —no imágenes lindas— listos para testear en Meta. Sin diseñador, sin promptear.
                    </p>

                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }} className="mobile-stack">
                        <a href="#precio" className="btn-primary btn-cta pulse-btn" style={{ background: "linear-gradient(90deg, #EC4899, #8B5CF6)", borderRadius: 100, padding: "18px 36px", fontSize: 16, fontWeight: 600, boxShadow: "0 0 40px rgba(236, 72, 153,0.4)", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", border: "none" }}>
                            Quiero mis creativos →
                        </a>
                        <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, fontSize: 16, padding: "18px 36px", borderRadius: 100, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s" }} className="hover:bg-white/5">
                            Ver cómo funciona
                        </button>
                    </div>
                </div>
            </section>

            {/* VSL Video Section */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3 }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 900, marginBottom: 40 }}>La app por dentro <span className="gradient-text">se ve asi:</span></h2>
                    
                    <div style={{ maxWidth: 800, margin: "0 auto", borderRadius: 32, overflow: "hidden", border: "1px solid rgba(139, 92, 246,0.25)", boxShadow: "0 30px 80px rgba(139, 92, 246,0.2), 0 0 0 1px rgba(139, 92, 246,0.1)", position: "relative", zIndex: 10 }}>
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                            <iframe
                                src="https://www.loom.com/embed/b9b611cefb724181b755d62b06dd96fe"
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                            ></iframe>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        maxWidth: 800,
                        margin: "60px auto 40px",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        padding: "32px 0",
                        textAlign: "center"
                    }} className="mobile-grid-1">
                        <div style={{ borderRight: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.08)", borderBottom: isMobile ? "1px solid rgba(255, 255, 255, 0.08)" : "none", paddingBottom: isMobile ? 20 : 0, paddingTop: isMobile ? 0 : 0 }}>
                            <div style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>+1.100</div>
                            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>usuarios</div>
                        </div>
                        <div style={{ borderRight: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.08)", borderBottom: isMobile ? "1px solid rgba(255, 255, 255, 0.08)" : "none", paddingBottom: isMobile ? 20 : 0, paddingTop: isMobile ? 20 : 0 }}>
                            <div style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>+50.000</div>
                            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>creativos generados</div>
                        </div>
                        <div style={{ paddingTop: isMobile ? 20 : 0 }}>
                            <div style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>4</div>
                            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>plataformas · Meta, TikTok, Reels</div>
                        </div>
                    </div>

                    {/* Tags / Pills Horizontal list */}
                    <div style={{
                        maxWidth: 800,
                        margin: "0 auto",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        padding: "10px 0",
                        display: "flex",
                        gap: 10,
                        justifyContent: isMobile ? "flex-start" : "center",
                    }} className="no-scroll-bar">
                        {[
                            "Videos UGC",
                            "Tu cara, tu marca",
                            "Multi-formato",
                            "Export a Meta",
                            "Replicar ganadores",
                            "Multi-idioma",
                            "Ángulo: Dolor",
                            "Ángulo: Deseo",
                        ].map((tag, i) => (
                            <span key={i} style={{
                                display: "inline-block",
                                padding: "6px 14px",
                                borderRadius: 100,
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "#9CA3AF",
                                fontSize: 13,
                                fontWeight: 500,
                                flexShrink: 0
                            }}>
                                • &nbsp; {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Moved below Hero CTA */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3 }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Resultados reales de <span className="gradient-text">personas reales</span></h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 32, opacity: 0.7 }}>Mira cómo otros ya están escalando con ClickADS.</p>

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
            </section>

            {/* Preguntas / Problemas Section */}
            <section style={{ padding: "80px 24px", background: "#0D0D14", position: "relative", zIndex: 3, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, marginBottom: 40, lineHeight: 1.2 }}>
                        ¿Te identificas con alguna de estas situaciones?
                    </h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left", marginBottom: 60 }}>
                        {[
                            "¿Lanzas campañas en Meta Ads pero no logras ventas rentables?",
                            "¿Sientes que tus creativos se 'queman' muy rápido y necesitas estar cambiando constantemente?",
                            "¿Pierdes horas diseñando en Canva o esperando a que tu diseñador te entregue imágenes?",
                            "¿Ves cómo tu competencia escala mientras tú te quedas atrás con los mismos anuncios de siempre?"
                        ].map((q, idx) => (
                            <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", gap: 20 }}>
                                <AlertCircle size={28} color="#F87171" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: 18, color: "#E5E7EB", fontWeight: 600 }}>{q}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))", border: "1px solid rgba(139, 92, 246, 0.4)", borderRadius: 24, padding: "40px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 60%)", pointerEvents: "none" }}></div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 16, position: "relative", zIndex: 2 }}>
                            La verdad es simple: <span style={{ color: "#A78BFA" }}>Necesitas MÁS imágenes y MÁS ángulos.</span>
                        </h3>
                        <p style={{ fontSize: 18, color: "#D1D5DB", lineHeight: 1.7, position: "relative", zIndex: 2, marginBottom: 24 }}>
                            Para encontrar el anuncio ganador que escale tu negocio, necesitas probar múltiples variaciones, textos y enfoques visuales. No basta con una o dos imágenes.
                        </p>
                        <p style={{ fontSize: 20, color: "#fff", fontWeight: 700, position: "relative", zIndex: 2 }}>
                            Y eso es exactamente lo que puedes lograr en minutos con <span style={{ color: "#8B5CF6", fontWeight: 900 }}>ClickADS</span>.
                        </p>
                    </div>
                    <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
                        <a href="#precio" className="btn-primary btn-cta pulse-btn" style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", borderRadius: 12, padding: "16px 32px", fontSize: 18, fontWeight: 700, boxShadow: "0 0 50px rgba(139, 92, 246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                            Generar mis primeros 100 creativos →
                        </a>
                    </div>
                </div>
            </section>

            {/* Gallery Section - Moved below Testimonials */}
            <section style={{ padding: "0 24px 100px", background: "transparent", position: "relative", zIndex: 3, overflow: "hidden" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
                        <span className="mobile-hide">Estos son algunos de los <span className="gradient-text">100 creativos</span> que puedes lograr en 10 minutos</span>
                        <span className="desktop-hide" style={{ fontSize: "28px" }}>+100 creativos generados con ClickADS</span>
                    </h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40, opacity: 0.7 }}>
                        <span className="mobile-hide">Ejemplos reales de usuarios de la plataforma: Imágenes de alto impacto creadas en tiempo récord, listas para Meta Ads</span>
                        <span className="desktop-hide">Ejemplos reales de usuarios de la plataforma</span>
                    </p>

                    <div style={{ maxWidth: 1400, margin: "0 auto", overflow: "hidden", position: "relative" }}>


                        {/* Gradient Fades for Smooth Scroll Appearance */}
                        <div className="mobile-hide" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div className="mobile-hide" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        {/* Row 1 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginBottom: 20 }}>
                            {[
                                "cepillo_secador_1779245619141.jpg", "colageno_1779245588214.jpg", "fem_1779245633013.jpg",
                                "gomitas_de_vinagre_de_manzana_1779245608634.jpg", "nad_boost_1779245622880.jpg", "shampoo_control_grasa_1779245599622.jpg",
                                "colageno_1779245589606.jpg", "cepillo_secador_1779245619952.jpg", "fem_1779245634093.jpg",
                                // Duplicate for infinite effect
                                "cepillo_secador_1779245619141.jpg", "colageno_1779245588214.jpg", "fem_1779245633013.jpg",
                                "gomitas_de_vinagre_de_manzana_1779245608634.jpg", "nad_boost_1779245622880.jpg", "shampoo_control_grasa_1779245599622.jpg",
                                "colageno_1779245589606.jpg", "cepillo_secador_1779245619952.jpg", "fem_1779245634093.jpg"
                            ].map((img, i) => (
                                <div key={`r1-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ position: "relative", width: 224, height: "100%" }}>
                                        <Image src={`/imagenes-creadas/${img}`} alt="Creativo" fill style={{ objectFit: "contain" }} sizes="224px" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 2 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "gomitas_de_vinagre_de_manzana_1779245610502.jpg", "nad_boost_1779245624449.jpg", "shampoo_control_grasa_1779245600494.jpg",
                                "colageno_1779245591997.jpg", "cepillo_secador_1779245621148.jpg", "fem_1779245636928.jpg",
                                "gomitas_de_vinagre_de_manzana_1779245612073.jpg", "nad_boost_1779245625403.jpg", "shampoo_control_grasa_1779245602211.jpg",
                                // Duplicate for infinite effect
                                "gomitas_de_vinagre_de_manzana_1779245610502.jpg", "nad_boost_1779245624449.jpg", "shampoo_control_grasa_1779245600494.jpg",
                                "colageno_1779245591997.jpg", "cepillo_secador_1779245621148.jpg", "fem_1779245636928.jpg",
                                "gomitas_de_vinagre_de_manzana_1779245612073.jpg", "nad_boost_1779245625403.jpg", "shampoo_control_grasa_1779245602211.jpg"
                            ].map((img, i) => (
                                <div key={`r2-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ position: "relative", width: 224, height: "100%" }}>
                                        <Image src={`/imagenes-creadas/${img}`} alt="Creativo" fill style={{ objectFit: "contain" }} sizes="224px" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 3 - Direct */}
                        <div className="scroll-container" style={{ gap: 20, marginTop: 20, marginBottom: 20 }}>
                            {[
                                "colageno_1779245593562.jpg", "fem_1779245639622.jpg", "nad_boost_1779245626383.jpg",
                                "shampoo_control_grasa_1779245603144.jpg", "colageno_1779245594470.jpg", "fem_1779245641651.jpg",
                                "nad_boost_1779245628099.jpg", "shampoo_control_grasa_1779245604108.jpg", "colageno_1779245595830.jpg",
                                // Duplicate for infinite effect
                                "colageno_1779245593562.jpg", "fem_1779245639622.jpg", "nad_boost_1779245626383.jpg",
                                "shampoo_control_grasa_1779245603144.jpg", "colageno_1779245594470.jpg", "fem_1779245641651.jpg",
                                "nad_boost_1779245628099.jpg", "shampoo_control_grasa_1779245604108.jpg", "colageno_1779245595830.jpg"
                            ].map((img, i) => (
                                <div key={`r3-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ position: "relative", width: 224, height: "100%" }}>
                                        <Image src={`/imagenes-creadas/${img}`} alt="Creativo" fill style={{ objectFit: "contain" }} sizes="224px" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Row 4 - Reverse */}
                        <div className="scroll-container-reverse" style={{ gap: 20 }}>
                            {[
                                "gomitas_de_vinagre_de_manzana_1779245615044.jpg", "nad_boost_1779245629501.jpg", "shampoo_control_grasa_1779245605285.jpg",
                                "colageno_1779245597431.jpg", "fem_1779245643022.jpg", "shampoo_control_grasa_1779245607056.jpg",
                                "colageno_1779245598515.jpg", "shampoo_control_grasa_1779245607697.jpg",
                                // Duplicate for infinite effect
                                "gomitas_de_vinagre_de_manzana_1779245615044.jpg", "nad_boost_1779245629501.jpg", "shampoo_control_grasa_1779245605285.jpg",
                                "colageno_1779245597431.jpg", "fem_1779245643022.jpg", "shampoo_control_grasa_1779245607056.jpg",
                                "colageno_1779245598515.jpg", "shampoo_control_grasa_1779245607697.jpg"
                            ].map((img, i) => (
                                <div key={`r4-${i}`} className="scroll-card" style={{ borderRadius: 24, overflow: "hidden", height: 280, width: "auto", flexShrink: 0, background: "#0D0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ position: "relative", width: 224, height: "100%" }}>
                                        <Image src={`/imagenes-creadas/${img}`} alt="Creativo" fill style={{ objectFit: "contain" }} sizes="224px" />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
                        <a href="#precio" className="btn-primary btn-cta pulse-btn" style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", borderRadius: 12, padding: "16px 32px", fontSize: 18, fontWeight: 700, boxShadow: "0 0 50px rgba(139, 92, 246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                            Generar mis primeros 100 creativos →
                        </a>
                    </div>
                </div>
            </section>

            {/* Landing Page Showcase Section */}
            <section style={{ padding: "120px 24px", background: "transparent", position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center" }} className="mobile-stack">
                    <div className="mobile-text-center">
                        <div style={{ background: "rgba(139, 92, 246,0.1)", border: "1px solid rgba(139, 92, 246,0.2)", color: "#A78BFA", fontSize: 13, fontWeight: 800, padding: "8px 20px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }} className="mobile-center-flex">
                            <Zap size={14} /> GENERADOR DE LANDINGS CON IA
                        </div>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
                            Crea Landings de <br />
                            <span style={{ background: "rgba(139, 92, 246,0.15)", padding: "0 12px", borderRadius: 8 }}>Venta Profesionales</span> <br />
                            en <span className="gradient-text">Menos de 10 Minutos</span>
                        </h2>
                        <p style={{ fontSize: 19, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 48, maxWidth: 540 }} className="mobile-center-flex">
                            Nuestra IA genera secciones de landing pages optimizadas para vender, utilizando estructuras probadas de marketing de respuesta directa.
                            Convierte visitantes en compradores sin tener que contratar diseñadores ni copywriters.
                        </p>
                        <div style={{ display: "flex", gap: 16 }} className="mobile-center-flex">
                            <a href="#precio" className="btn-primary" style={{ padding: "18px 40px", borderRadius: 16, fontSize: 18, fontWeight: 900 }}>✦ Acceder a la APP Con Descuento</a>
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
                                boxShadow: "0 60px 120px -20px rgba(0,0,0,0.9), 0 0 50px rgba(139, 92, 246,0.25)",
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
                                    <Image src={landingImages[landingIndex]} alt="Landing Demo Example" width={320} height={1200} style={{ width: "100%", height: "auto", display: "block" }} />
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
                        <div style={{ position: "absolute", bottom: -50, fontSize: 11, color: "#6B7280", fontWeight: 800, letterSpacing: 2, background: "rgba(139, 92, 246,0.05)", padding: "4px 12px", borderRadius: 100 }}>↓ HAZ SCROLL PARA VER LA LANDING</div>
                    </div>
                </div>
            </section>












            {/* Landing Pages Showcase */}
            <section style={{ padding: "80px 24px", background: "transparent", textAlign: "center", position: "relative", zIndex: 10, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.4, background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.18) 0%, transparent 70%)" }} />
                <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                    <h2 style={{ fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900, marginBottom: 12 }}>
                        Estas landings ya venden. <span style={{ color: "#A78BFA" }}>Las tuyas pueden ser las próximas.</span>
                    </h2>
                    <p style={{ fontSize: 18, color: "#6B7280", marginBottom: 48 }}>Landings que convierten para cada nicho</p>

                    {/* 3D stage container */}
                    <div style={{ perspective: "1400px", height: stageHeight, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
                        {/* 3D rotating carousel track */}
                        <div style={{
                            position: "relative",
                            width: cardWidth,
                            height: cardHeight,
                            transformStyle: "preserve-3d",
                            transform: `rotateY(${rotationY}deg)`,
                            transition: hasTransition ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
                        }}>
                            {showcaseLandings.map((item, idx) => {
                                const cardAngle = idx * anglePerCard;
                                return (
                                    <a
                                        key={idx}
                                        href={item.url}
                                        className="absolute group block"
                                        style={{
                                            width: cardWidth,
                                            height: cardHeight,
                                            left: 0,
                                            top: 0,
                                            transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                                            backfaceVisibility: "visible",
                                        }}
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                    >
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            borderRadius: isMobile ? 24 : 32,
                                            padding: 1,
                                            background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)",
                                            backdropFilter: "blur(12px)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.65)",
                                            overflow: "hidden",
                                            transition: "all 0.3s ease",
                                        }}
                                        className="group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                            <div style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: isMobile ? 18 : 24,
                                                overflow: "hidden",
                                                background: "#080808",
                                                border: `${isMobile ? 6 : 8}px solid #1a1a1a`,
                                                position: "relative"
                                            }}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        objectPosition: "top",
                                                        display: "block"
                                                    }}
                                                />
                                                <div style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 60,
                                                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
                                                }} />
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Carousel navigation controls */}
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginTop: 40, position: "relative", zIndex: 20 }}>
                        <button
                            type="button"
                            onClick={() => rotateCarousel(anglePerCard)}
                            style={{
                                padding: 12,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s"
                            }}
                            className="hover-scale"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPaused(!isPaused)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 100,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                transition: "all 0.2s"
                            }}
                            className="hover-scale"
                        >
                            {isPaused ? <Play size={14} fill="#fff" /> : <Pause size={14} fill="#fff" />}
                            {isPaused ? "Reanudar" : "Pausar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => rotateCarousel(-anglePerCard)}
                            style={{
                                padding: 12,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s"
                            }}
                            className="hover-scale"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={{ marginTop: 48 }}>
                        <a href="#precio" className="btn-primary" style={{ padding: "18px 48px", borderRadius: 100, fontSize: 17, fontWeight: 700, background: "linear-gradient(90deg, #8B5CF6, #EC4899)", boxShadow: "0 0 40px rgba(139, 92, 246,0.4)", textDecoration: "none", display: "inline-block" }}>
                            ✦ Quiero mis Landings →
                        </a>
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
                            border: "1px solid rgba(139, 92, 246,0.1)",
                            borderRadius: 32,
                            padding: 40,
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", top: 10, right: 20, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}>{step.num}</div>
                            <div style={{ background: "rgba(139, 92, 246,0.15)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{step.icon}</div>
                            <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#fff" }}>{step.title}</h4>
                            <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.6 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: "rgba(139, 92, 246,0.05)",
                    border: "1px solid rgba(139, 92, 246,0.2)",
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
                                <div style={{ background: "rgba(139, 92, 246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 24, margin: "0 auto 24px" }}>{item.icon}</div>
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

                    <div style={{ maxWidth: "100%", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }}></div>

                        <div className="custom-scrollbar" style={{
                            display: "flex",
                            gap: 20,
                            padding: "20px 5vw",
                            overflowX: "auto",
                            scrollSnapType: "x mandatory",
                            scrollBehavior: "smooth",
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none"
                        }}>
                            {[
                                "IMG_8120.jpg", "IMG_8121.jpg", "IMG_8146.jpg", "IMG_8151.jpg", "IMG_8153.jpg",
                                "WhatsApp Image 2026-05-26 at 8.35.37 PM (1).jpeg",
                                "WhatsApp Image 2026-05-26 at 8.35.37 PM (2).jpeg",
                                "WhatsApp Image 2026-05-26 at 8.35.37 PM (3).jpeg",
                                "WhatsApp Image 2026-05-26 at 8.35.37 PM (4).jpeg",
                                "WhatsApp Image 2026-05-26 at 8.35.37 PM.jpeg",
                                "WhatsApp Image 2026-05-26 at 8.35.38 PM.jpeg"
                            ].map((img, i) => (
                                <div key={i} style={{
                                    width: 300,
                                    height: 600,
                                    flexShrink: 0,
                                    borderRadius: 24,
                                    overflow: "hidden",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "#0D0D14",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                    scrollSnapAlign: "center",
                                    position: "relative"
                                }}>
                                    <Image src={`/testimonials/${img}`} alt="WhatsApp Testimonial" fill style={{ objectFit: "contain", objectPosition: "center" }} sizes="(max-width: 768px) 100vw, 33vw" />
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
                                title: "Generador de Landing Pages",
                                desc: "Crea landing pages de alta conversión listas para exportar e integrar directamente en Shopify y WooCommerce. Sin código, sin diseñador.",
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
                                    <div style={{ background: "rgba(139, 92, 246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

            {/* Gallery Section Removed - Now Just Bonus Section */}
            <section style={{ padding: "24px 24px" }}>


                {/* Bonus Section */}
                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16 }}>Pero eso no es todo...</h2>
                    <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 64, opacity: 0.7 }}>También recibes estos <span style={{ color: "#A78BFA", fontWeight: 800 }}>BONUS GRATIS</span> al unirte hoy.</p>

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
                                border: "1px solid rgba(139, 92, 246,0.1)",
                                borderRadius: 32,
                                padding: "40px 32px",
                                textAlign: "center",
                                position: "relative",
                                zIndex: 10
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
                                    <div style={{ background: "rgba(139, 92, 246,0.1)", color: "#8B5CF6", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

                    {/* SUPER BONUS EXTRA: RESEARCH */}
                    <div style={{
                        marginTop: 40,
                        background: "linear-gradient(135deg, rgba(139, 92, 246,0.15) 0%, rgba(139, 92, 246,0.05) 100%)",
                        border: "1px solid #8B5CF6",
                        borderRadius: 32,
                        padding: "48px 32px",
                        maxWidth: 1100,
                        margin: "40px auto 0",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(139, 92, 246,0.2) 0%, transparent 70%)", pointerEvents: "none" }}></div>
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{ background: "#8B5CF6", color: "#fff", fontSize: 11, fontWeight: 900, padding: "6px 16px", borderRadius: 100, display: "inline-block", marginBottom: 24 }}>SISTEMA DE INVESTIGACIÓN (VALORADO EN $199 USD)</div>
                            <h3 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
                                Análisis e Investigación de Mercado <span className="gradient-text">Nivel Dios</span>
                            </h3>
                            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#D1D5DB", lineHeight: 1.6, maxWidth: 850, margin: "0 auto", fontWeight: 500 }}>
                                Olvídate de adivinar cómo vender. Solo dinos qué producto tienes y nuestra Inteligencia Artificial creará un <strong>reporte colosal de 30 capítulos en 30 segundos</strong> listos para descargar en PDF.
                            </p>
                        </div>
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
                        border: "1px solid rgba(139, 92, 246,0.2)",
                        borderRadius: 32,
                        padding: "48px",
                        marginBottom: 64,
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 700,
                        margin: "0 auto 64px",
                        textAlign: "left"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#8B5CF6", letterSpacing: "0.2em", marginBottom: 32, textAlign: "center" }}>TODO LO QUE INCLUYE:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                { t: "Generador de Volumen Industrial", v: "$359" },
                                { t: "Angle-Splitter Automático", v: "$174" },
                                { t: "Generador de Landing Pages", v: "$199" },
                                { t: "Guiones Premium UGC", v: "$149" },
                                { t: "Aniquilador de Objeciones", v: "$129" },
                                { t: "Whatsapp Closer & Simulator", v: "$249" },
                                { t: "SUPER BONUS: Investigación IA", v: "$199" },
                                { t: "BONUS: Updates de por Vida", v: "Incalculable" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, borderBottom: idx !== 9 ? "1px solid rgba(255,255,255,0.03)" : "none", paddingBottom: idx !== 9 ? 16 : 0 }}>
                                    <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ color: "#10B981", fontWeight: 900 }}>✓</div> {item.t}
                                    </div>
                                    <div style={{ color: "#C4B5FD", fontWeight: 700 }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Pricing Card */}
                    <div style={{
                        background: "#08080C",
                        border: "2px solid #8B5CF6",
                        borderRadius: 40,
                        padding: "80px 40px",
                        position: "relative",
                        zIndex: 5,
                        maxWidth: 700,
                        margin: "0 auto",
                        textAlign: "center",
                        boxShadow: "0 40px 100px rgba(139, 92, 246,0.15)",
                        overflow: "hidden"
                    }} className="mobile-full-padding">
                        {/* Launch Badge */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#8B5CF6",
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
                                <span style={{ fontSize: 24, color: "#4B5563", fontWeight: 700 }}>USD</span>
                            </div>
                            <div style={{ marginTop: 24, marginBottom: 12 }}>
                                <span style={{ fontSize: 22, color: "#fff", fontWeight: 900, background: "rgba(139, 92, 246,0.2)", border: "1px solid rgba(139, 92, 246,0.4)", padding: "12px 32px", borderRadius: 100, display: "inline-block", letterSpacing: "0.02em" }}>
                                    Pago Único · Acceso de Por Vida
                                </span>
                            </div>
                            <div style={{ marginTop: 16, background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", color: "#8B5CF6", fontSize: 14, fontWeight: 800, padding: "8px 24px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8 }}>
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
                                    <div style={{ color: "#8B5CF6", fontSize: 20 }}>✓</div> {feat}
                                </div>
                            ))}
                        </div>

                        <a href={MONTHLY_CHECKOUT_URL} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "24px 40px", borderRadius: 20, fontSize: 24, fontWeight: 900, boxShadow: "0 20px 40px rgba(139, 92, 246,0.3)" }}>
                            Acceder a la APP Con Descuento &rarr;
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
                    <div style={{ color: "#8B5CF6", fontSize: 12, fontWeight: 900, letterSpacing: "0.2em", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Shield size={16} /> CERO RIESGO PARA TI
                    </div>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 32 }}>Garantía de Funcionamiento 72hs</h2>
                    <p style={{ fontSize: 14, fontStyle: "italic", color: "#4B5563", marginBottom: 48 }}>
                        ClickADS no es para curiosos. Es para dueños de productos físicos que quieren escalar con volumen real.
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
                                a: "No. Necesitas criterio para testear y medir. ClickADS te entrega volumen y estructura profesional para que tus anuncios conviertan."
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
                                q: "¿Es un pago único?",
                                a: "Sí, es un pago único de solo $27 USD para acceso de por vida a la herramienta. Sin cuotas mensuales ni cobros adicionales."
                            },
                            {
                                q: "¿Ya probé Canva/ChatGPT... por qué esto sería distinto?",
                                a: "Porque esas herramientas te ponen en modo 'artesano'. ClickADS te pone en modo testing: 100 piezas, ahora, para encontrar ganadores rápido."
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
                    <Image src="/logo.png" alt="ClickADS Logo" width={120} height={40} style={{ height: 40, width: "auto", objectFit: "contain" }} />
                    <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>
                        Click<span style={{ color: "#8B5CF6" }}>Ads</span>
                    </span>
                </div>
                <p style={{ color: "#4B5563", fontSize: 14, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
                    Revolucionando el testeo de creativos con Inteligencia Artificial Industrial.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 14, color: "#9CA3AF" }}>
                    <a href={WHATSAPP_URL} style={{ textDecoration: "none", color: "inherit" }}>Soporte WhatsApp</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Términos</a>
                    <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacidad</a>
                </div>
                <p style={{ color: "#222", fontSize: 12, marginTop: 40 }}>© 2025 ClickADS. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}