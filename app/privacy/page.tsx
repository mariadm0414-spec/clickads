"use client";
import React from "react";
import Link from "next/link";

export default function Privacy() {
    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", padding: "80px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <Link href="/" style={{ color: "#8B5CF6", textDecoration: "none", display: "inline-block", marginBottom: 40, fontWeight: 700 }}>&larr; Volver al inicio</Link>
                <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 40, letterSpacing: "-0.03em" }}>Políticas de Privacidad</h1>
                <div style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
                    <p>Última actualización: Abril de 2026</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>1. Recopilación de información</h2>
                    <p>Recopilamos varios tipos de información con el fin de proporcionar un servicio de élite. Esto incluye nombre, correo electrónico y las preferencias/imágenes que proporcione para la generación de creativos al interactuar con nuestra herramienta.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>2. Uso de la información</h2>
                    <p>Utilizamos los datos recopilados para mantener su sesión iniciada de manera segura (a través de proveedores como Firebase o Supabase), notificarle sobre nuevas funciones y prestar la infraestructura técnica requerida al integrarnos con las API de Inteligencia Artificial.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>3. Terceros</h2>
                    <p>Podemos compartir mínimos volúmenes de datos con proveedores de pago (Hotmart) para confirmar y activar su facturación y con integraciones de APIs (Google/OpenAI) de manera encriptada y ciega para el renderizado del producto.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>4. Seguridad de los datos</h2>
                    <p>Operamos con estándares técnicos modernos en la nube para mantener segura su conexión. No vendemos sus datos personales a agentes de minería externos.</p>
                </div>
            </div>
        </div>
    );
}
