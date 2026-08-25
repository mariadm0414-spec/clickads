import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function NotificationToast() {
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
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF" }}>Nuevo usuario</span>
                    <span style={{ fontSize: 9, color: "#4B5563" }}>Ahora</span>
                </div>
                <div style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.3 }}>
                    <strong style={{ color: "#fff" }}>{notifications[current].name}</strong> acabo de comprar <strong style={{ color: "#A78BFA" }}>"oferta pago unico"</strong>
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