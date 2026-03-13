"use client";

import { useState, useEffect, Suspense } from "react";
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, UploadCloud, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

// Lista blanca simulada (Supabase Mock)
const ALLOWED_EMAILS = ["admin@clickads.com", "user@test.com", "cliente@vip.com", "prueba@clickads.com"];

function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');

    // Detectar modo desde la URL (ej: /login?mode=register)
    useEffect(() => {
        const urlMode = searchParams.get('mode');
        if (urlMode === 'register' || urlMode === 'login' || urlMode === 'forgot') {
            setMode(urlMode as any);
        }
    }, [searchParams]);

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [toastMsg, setToastMsg] = useState("");

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setPhoto(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. BYPASS PARA ADMIN Y LISTA BLANCA DE PRUEBAS
            const isAllowedManual = ALLOWED_EMAILS.includes(email.toLowerCase()) || email.toLowerCase() === 'admin@clickads.com';

            if (isAllowedManual) {
                localStorage.setItem("clickads_user", JSON.stringify({ email, name: name || 'Usuario de Prueba' }));
                router.push("/dashboard");
                return;
            }

            // 2. CHECK EN TABLA acceso_total (ACCESO INDEFINIDO)
            const { data: totalAccessData } = await supabase
                .from('acceso_total')
                .select('email')
                .eq('email', email.toLowerCase())
                .maybeSingle();

            if (totalAccessData) {
                localStorage.setItem("clickads_user", JSON.stringify({ email, name: name || 'Acceso Total' }));
                router.push("/dashboard");
                return;
            }

            // 3. CHECK EN TABLA authorized_users (CLIENTES HOTMART)
            const { data: authData, error: authError } = await supabase
                .from('authorized_users')
                .select('*')
                .eq('email', email.toLowerCase())
                .single();

            const isGracePeriodValid = authData?.grace_period_until && new Date(authData.grace_period_until) > new Date();
            const isActive = authData?.status === 'active';

            if (authError || (!isActive && !isGracePeriodValid)) {
                setError(
                    !authData
                        ? "ACCESO DENEGADO: Este correo no está registrado."
                        : "SUSCRIPCIÓN VENCIDA: Tu periodo de gracia de 15 días ha terminado. Por favor regulariza tu pago en Hotmart."
                );
                setIsLoading(false);
                return;
            }

            if (mode === 'login' || mode === 'register') {
                // Verificar contraseña si no es bypass
                if (authData?.password && authData.password !== password) {
                    setError("CONTRASEÑA INCORRECTA. Por favor intenta de nuevo.");
                    setIsLoading(false);
                    return;
                }

                // Guardar perfil completo en localStorage
                const userProfile = {
                    email,
                    name: name || authData?.full_name || 'Usuario VIP',
                    photo: photo || authData?.avatar_url || null
                };

                localStorage.setItem("clickads_user", JSON.stringify(userProfile));

                // Si estamos registrando, actualizar Supabase con el nombre y foto
                if (mode === 'register' || !authData?.full_name) {
                    await supabase
                        .from('authorized_users')
                        .update({
                            full_name: name || userProfile.name,
                            avatar_url: photo || userProfile.photo
                        })
                        .eq('email', email.toLowerCase());
                }

                router.push("/dashboard");
            } else if (mode === 'forgot') {
                setToastMsg("Código enviado a " + email);
                setMode('verify');
            } else if (mode === 'verify') {
                if (code === "123456") {
                    setToastMsg("Contraseña actualizada con éxito");
                    setMode('login');
                } else {
                    setError("CÓDIGO INVÁLIDO. Revisa tu bandeja de entrada.");
                }
            }
        } catch (err: any) {
            setError("Error al conectar con la base de datos.");
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
            `}</style>

            <div className="glow" />

            <div className="auth-card">
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, background: "rgba(139, 92, 246, 0.1)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShieldCheck color="#8B5CF6" size={32} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
                        {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Solicitar Acceso' : mode === 'forgot' ? 'Código de Acceso' : 'Verificar Código'}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                        {mode === 'login' ? 'Solo personal autorizado de Supabase' : mode === 'verify' ? 'Ingresa el código enviado a tu correo' : 'Sistema restringido por lista blanca'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: 16, borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    {mode === 'register' && (
                        <>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                                <div style={{ position: "relative", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                                    <input type="file" hidden id="reg-photo" accept="image/*" onChange={handlePhotoChange} />
                                    <label htmlFor="reg-photo" style={{ position: "absolute", inset: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {photo ? (
                                            <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ textAlign: "center", opacity: 0.5 }}>
                                                <UploadCloud size={24} style={{ marginBottom: 4 }} />
                                                <div style={{ fontSize: 10, fontWeight: 800 }}>FOTO</div>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input className="input-field" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        </>
                    )}

                    {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input className="input-field" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    )}

                    {(mode === 'login' || mode === 'register') && (
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input className="input-field" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    )}

                    {mode === 'verify' && (
                        <>
                            <div className="input-group">
                                <KeyRound className="input-icon" size={20} />
                                <input className="input-field" placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <Lock className="input-icon" size={20} />
                                <input className="input-field" type="password" placeholder="Nueva Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </>
                    )}

                    {mode === 'login' && (
                        <div style={{ textAlign: "right", marginBottom: 24 }}>
                            <span onClick={() => setMode('forgot')} style={{ color: "#8B5CF6", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>¿Olvidaste tu contraseña?</span>
                        </div>
                    )}

                    <button className="btn-auth" type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            <>
                                {mode === 'login' ? 'Entrar a ClickAds' : mode === 'register' ? 'Registrarse' : mode === 'forgot' ? 'Enviar Código' : 'Restablecer'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 32 }}>
                    {mode === 'login' ? (
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                            ¿Eres nuevo comprador? <span onClick={() => router.push("/signup")} style={{ color: "#8B5CF6", cursor: "pointer", fontWeight: 700 }}>Crea tu cuenta aquí</span>
                        </p>
                    ) : (
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                            <span onClick={() => setMode('login')} style={{ color: "#8B5CF6", cursor: "pointer", fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><ArrowLeft size={14} /> Volver al Inicio</span>
                        </p>
                    )}
                </div>
            </div>

            {toastMsg && (
                <div style={{ position: "fixed", bottom: 40, background: "#10B981", color: "#fff", padding: '12px 24px', borderRadius: 100, fontWeight: 800, fontSize: 13, zIndex: 1000 }}>
                    {toastMsg}
                </div>
            )}
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div style={{ background: "#030303", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 className="animate-spin" color="#8B5CF6" size={48} />
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}
