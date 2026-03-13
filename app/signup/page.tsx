"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Ocurrió un error en el servidor.");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: any) {
            setError("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: "#030303",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            padding: 20,
            overflow: "hidden",
            position: "relative"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .auth-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 40px;
                    padding: 60px;
                    width: 100%;
                    max-width: 520px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                    position: relative;
                    z-index: 10;
                    text-align: center;
                }
                .glow {
                    position: absolute; width: 400px; height: 400px; background: #8B5CF6; filter: blur(150px); opacity: 0.15; border-radius: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%);
                }
                .input-group { position: relative; margin-bottom: 20px; }
                .input-field {
                    width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 16px 16px 52px; color: #fff; font-size: 15px; outline: none; transition: 0.2s;
                }
                .input-field:focus { border-color: #8B5CF6; background: rgba(255,255,255,0.08); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }
                .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); }
                .btn-auth {
                    width: 100%; background: #8B5CF6; color: #fff; border: none; padding: 18px; border-radius: 18px; font-size: 16px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px;
                }
                .btn-auth:hover { background: #7C3AED; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4); }
                
                @media (max-width: 768px) {
                    .auth-card { padding: 40px 30px; }
                }
            `}</style>

            <div className="glow" />

            <div className="auth-card">
                {!success ? (
                    <>
                        <div style={{ textAlign: "center", marginBottom: 40 }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                                <div style={{ width: 64, height: 64, background: "rgba(139, 92, 246, 0.1)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ShieldCheck color="#8B5CF6" size={32} />
                                </div>
                            </div>
                            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Crea tu Cuenta</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                                Solo para compradores autorizados de ClickAds
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: 16, borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', textAlign: "left" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignup}>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input
                                    className="input-field"
                                    placeholder="Nombre completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Mail className="input-icon" size={20} />
                                <input
                                    className="input-field"
                                    type="email"
                                    placeholder="Tu correo de Hotmart"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <Lock className="input-icon" size={20} />
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="Crea una contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="btn-auth" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Registrarme <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div style={{ textAlign: "center", marginTop: 32 }}>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                                ¿Ya tienes cuenta? <span onClick={() => router.push("/login")} style={{ color: "#8B5CF6", cursor: "pointer", fontWeight: 700 }}>Inicia sesión</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                            <div style={{ width: 80, height: 80, background: "rgba(16, 185, 129, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle2 color="#10B981" size={48} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>¡Registro Exitoso!</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.5 }}>
                            Tu cuenta ha sido creada correctamente.<br />
                            Te estamos redirigiendo al login...
                        </p>
                        <Loader2 className="animate-spin" style={{ margin: "32px auto 0", color: "#8B5CF6" }} />
                    </div>
                )}
            </div>
        </div>
    );
}
