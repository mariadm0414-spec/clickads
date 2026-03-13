"use client";

import { useState, Suspense, useEffect } from "react";
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setIsLoading(false);
            return;
        }

        try {
            const lowEmail = email.toLowerCase();

            // Verificar si el usuario existe en alguna tabla
            const { data: authData } = await supabase
                .from('authorized_users')
                .select('email')
                .ilike('email', lowEmail)
                .maybeSingle();

            const { data: totalAccessData } = await supabase
                .from('acceso_total')
                .select('email')
                .ilike('email', lowEmail)
                .maybeSingle();

            if (!authData && !totalAccessData) {
                setError("Este correo no está registrado en nuestro sistema.");
                setIsLoading(false);
                return;
            }

            // Actualizar contraseña en authorized_users
            const { error: updateError } = await supabase
                .from('authorized_users')
                .update({ password: newPassword })
                .ilike('email', lowEmail);

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);

        } catch (err: any) {
            setError("Error al actualizar la contraseña: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: "#030303", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Inter, sans-serif", padding: 20
        }}>
            <style>{`
                .auth-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 40px; padding: 60px; width: 100%; max-width: 520px; backdrop-filter: blur(20px); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
                .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; color: #fff; font-size: 15px; outline: none; transition: 0.2s; margin-bottom: 20px; }
                .input-field:focus { border-color: #8B5CF6; background: rgba(255,255,255,0.08); }
                .btn-auth { width: 100%; background: #8B5CF6; color: #fff; border: none; padding: 18px; border-radius: 18px; font-size: 16px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 12px; }
                .btn-auth:hover { background: #7C3AED; transform: translateY(-2px); }
            `}</style>

            <div className="auth-card">
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <ShieldCheck color="#8B5CF6" size={48} style={{ margin: "0 auto 20px" }} />
                    <h1 style={{ fontSize: 32, fontWeight: 900 }}>Cambiar Contraseña</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 10 }}>Ingresa tu correo y tu nueva clave</p>
                </div>

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <CheckCircle2 color="#10B981" size={48} style={{ margin: "0 auto 20px" }} />
                        <h2 style={{ fontSize: 24, fontWeight: 800 }}>¡Contraseña Actualizada!</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 10 }}>Redirigiendo al login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleReset}>
                        {error && (
                            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 13, display: "flex", gap: 10 }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}
                        <input className="input-field" type="email" placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input className="input-field" type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <input className="input-field" type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button className="btn-auth" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Actualizar Contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
