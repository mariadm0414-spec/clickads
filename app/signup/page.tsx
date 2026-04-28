"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, full_name: fullName }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.error || "Error al crear cuenta");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado. ¿Ya eres comprador?");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
                    <div style={{ width: 80, height: 80, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <CheckCircle2 size={40} style={{ color: "#10B981" }} />
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>¡Cuenta Creada!</h1>
                    <p style={{ color: "#9CA3AF", lineHeight: 1.6, marginBottom: 32 }}>Tu acceso ha sido verificado. Te estamos redirigiendo al login...</p>
                    <Loader2 size={24} style={{ color: "#10B981", margin: "0 auto" }} className="animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ maxWidth: 400, width: "100%" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#9CA3AF", textDecoration: "none", marginBottom: 32, fontSize: 14 }}>
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>

                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: "rgba(139,92,246,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Sparkles size={32} style={{ color: "#8B5CF6" }} />
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Únete a ClickAds</h1>
                    <p style={{ color: "#9CA3AF" }}>Crea tu cuenta de acceso exclusivo</p>
                </div>

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {error && (
                        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#F87171", fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#D1D5DB" }}>Nombre Completo</label>
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
                            <input
                                required
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Tu nombre"
                                style={{ width: "100%", background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 14px 14px 48px", color: "#fff", outline: "none" }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#D1D5DB" }}>Correo Electrónico</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                style={{ width: "100%", background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 14px 14px 48px", color: "#fff", outline: "none" }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#D1D5DB" }}>Contraseña</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: "100%", background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 14px 14px 48px", color: "#fff", outline: "none" }}
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        style={{ background: "#8B5CF6", color: "#fff", border: "none", padding: 16, borderRadius: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 }}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Crear Cuenta"}
                    </button>

                    <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: 14, marginTop: 8 }}>
                        ¿Ya tienes cuenta? <Link href="/login" style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: 600 }}>Inicia sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
