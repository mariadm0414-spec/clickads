"use client";
import React from "react";
import Link from "next/link";

export default function RefundPolicy() {
    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", padding: "80px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <Link href="/" style={{ color: "#8B5CF6", textDecoration: "none", display: "inline-block", marginBottom: 40, fontWeight: 700 }}>&larr; Volver al inicio</Link>
                <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 40, letterSpacing: "-0.03em" }}>Refund Policy (Políticas de Reembolso)</h1>
                <div style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
                    <p>Última actualización: Abril de 2026</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>1. Garantía de Satisfacción</h2>
                    <p>En ClickAds ofrecemos una garantía de 72 horas para asegurar que nuestra herramienta funciona correctamente de acuerdo a lo promocionado en nuestra oferta y publicidad digital.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>2. Procesamiento de reembolsos</h2>
                    <p>Los reembolsos deben tramitarse directamente en la plataforma de facturación que ha operado el pago para agilizar su entrega directamente a su tarjeta de crédito. Una vez solicitado y dictaminado a favor (dentro del período oficial), la devolución puede tardar un ciclo en procesarse con tu entidad bancaria.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>3. Pagos procesados por Hotmart</h2>
                    <p>Todas las transacciones de nuestros servicios son procesadas de forma segura e independiente por Hotmart. En caso de requerir un reembolso, puede recurrir al panel de garantías de Hotmart o escribirnos adjuntando su número de factura transaccional para orientarlo en el proceso.</p>

                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 24 }}>4. Acceso al software</h2>
                    <p>Ejercer la garantía de reembolso resulta irrevocablemente en el cierre al acceso de la plataforma de ClickAds una vez el saldo es remitido a cuenta original.</p>
                </div>
            </div>
        </div>
    );
}
