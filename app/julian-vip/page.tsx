"use client";

import { useState } from "react";
import { Lock, ArrowRight, Loader2, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JulianBypassPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/admin-bypass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, user: "julian" })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error de acceso.");
                setIsLoading(false);
                return;
            }

            // Guardar perfil y entrar al dashboard
            localStorage.setItem("clickads_user", JSON.stringify(data.user));
            router.push("/dashboard");

        } catch (err: any) {
            setError("Error al conectar con el servidor.");
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
            padding: 20
        }}>
            <style>{`
                .admin-card {
                    background: rgba(16, 185, 129, 0.05);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 40px;
                    padding: 50px;
                    width: 100%;
                    max-width: 450px;
                    text-align: center;
                }
                .input-field {
                    width: 100%; 
                    background: rgba(0,0,0,0.5); 
                    border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 12px; 
                    padding: 16px; 
                    color: #fff; 
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 18px;
                    letter-spacing: 2px;
                }
                .btn-auth {
                    width: 100%; 
                    background: #10B981; 
                    color: #fff; 
                    border: none; 
                    padding: 16px; 
                    border-radius: 12px; 
                    font-size: 16px; 
                    font-weight: 800; 
                    cursor: pointer; 
                }
                .btn-auth:hover { background: #059669; }
            `}</style>

            <div className="admin-card">
                <UserCheck size={48} color="#10B981" style={{ margin: "0 auto 20px" }} />
                <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Acceso VIP: Julián</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 30, fontSize: 13 }}>
                    Portal privado de acceso directo.
                </p>

                {error && (
                    <div style={{ color: "#EF4444", marginBottom: 20, fontSize: 14, fontWeight: "bold" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Ingresa tu clave maestra..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="btn-auth" type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" style={{ margin: "0 auto" }} /> : "Entrar al Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
