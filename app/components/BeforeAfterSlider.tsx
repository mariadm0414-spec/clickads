import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function BeforeAfterSlider({
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
            style={{ position: "relative", userSelect: "none", cursor: "ew-resize", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(139, 92, 246,0.2)", aspectRatio: "4/5" }}
            onMouseMove={e => dragging.current && updatePos(e.clientX)}
            onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={e => updatePos(e.touches[0].clientX)}
            onTouchStart={e => updatePos(e.touches[0].clientX)}
        >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image src={after} alt="Después" fill style={{ objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", background: "rgba(139, 92, 246,0.85)", backdropFilter: "blur(6px)", color: "#fff", padding: "5px 12px", borderRadius: 100, zIndex: 10 }}>{afterLabel}</div>
            </div>
            <div style={{
                position: "absolute", inset: 0,
                clipPath: `inset(0 ${100 - pos}% 0 0)`,
                zIndex: 2,
            }}>
                <Image src={before} alt="Antes" fill style={{ objectFit: "cover", filter: "saturate(0.55) brightness(0.82)" }} />
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