import { useRef, useEffect } from "react";

export default function GalaxyCanvas() {
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
        const starCount = window.innerWidth < 768 ? 60 : 220;
        for (let i = 0; i < starCount; i++) {
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