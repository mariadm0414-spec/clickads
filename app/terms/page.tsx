"use client";
import React from "react";
import Link from "next/link";

export default function Terms() {
    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", padding: "80px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <Link href="/" style={{ color: "#8B5CF6", textDecoration: "none", display: "inline-block", marginBottom: 40, fontWeight: 700 }}>&larr; Volver al inicio</Link>
                <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 40, letterSpacing: "-0.03em" }}>Términos y Condiciones</h1>
                <div style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
                    <p>Última actualización: Abril de 2026</p>
                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>1. Aceptación de los términos</h2>
                    <p>Al acceder y utilizar ClickAds, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de los términos, por favor, no utilice nuestro software ni nuestros servicios.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>2. Uso de nuestra plataforma</h2>
                    <p>Usted se compromete a utilizar nuestra plataforma únicamente con fines legales. No está permitido usar los recursos generados para actividades ilícitas y nos reservamos el derecho de revocar el acceso en dichos casos.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>3. Cuentas de usuario</h2>
                    <p>Para acceder a la plataforma, es necesario crear una cuenta y/o iniciar sesión. Usted es responsable de salvaguardar su contraseña y todas las actividades que ocurran bajo su cuenta. Las credenciales no deben ser compartidas con terceros bajo ninguna circunstancia.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>4. Propiedad intelectual</h2>
                    <p>El servicio, la marca "ClickAds" y su diseño tecnológico subyacente son y seguirán siendo propiedad exclusiva de ClickAds. Por otro lado, usted mantiene la propiedad sobre los creativos comerciales producidos con la plataforma.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>5. Limitación de responsabilidad</h2>
                    <p>En ningún caso ClickAds será responsable ante usted o cualquier tercero por daños consecuentes, lucro cesante o multas que experimente debido a la naturaleza de las campañas de Meta Ads hechas con el material generado.</p>
                </div>
            </div>
        </div>
    );
}
