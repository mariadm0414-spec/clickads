import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Forza ruta dinámica
export const dynamic = 'force-dynamic';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ── Inicialización de Supabase ────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Hotmart suele requerir responder a OPTIONS con 200 OK para confirmar CORS
export async function OPTIONS(req: Request) {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Algunos sistemas webhook realizan un GET de prueba para validar el endpoint
export async function GET(req: Request) {
    return NextResponse.json({ status: "Webhook activo y esperando peticiones." }, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
    if (!supabase) {
        console.error("Supabase credentials missing in env variables.");
        return new Response("Server Configuration Error", { status: 500, headers: corsHeaders });
    }

    try {
        // Lee el body enviado por Hotmart
        const payload = await req.json();

        // 2. Extraer el email del comprador (Soporta múltiples versiones de payload de Hotmart)
        const email = payload?.data?.buyer?.email || payload?.buyer?.email || payload?.email;
        const transactionId = payload?.data?.purchase?.transaction || payload?.transaction || payload?.hottok || `hotmart_${Date.now()}`;
        const productId = payload?.data?.product?.id || payload?.product_id || payload?.productId;

        // 3. Chequear si el evento es una compra aprobada
        const eventType = payload?.event;
        const status = payload?.data?.purchase?.status || payload?.status;

        if (eventType && eventType !== "PURCHASE_APPROVED" && status !== "APPROVED" && status !== "approved") {
            console.log(`Hotmart Webhook: Evento ignorado (${eventType || status}). No es una compra aprobada.`);
            return new Response("Evento ignorado", { status: 200, headers: corsHeaders });
        }

        if (!email) {
            console.warn("Hotmart Webhook: Recibimos payload sin email.", transactionId);
            return new Response("Sin email. Ignorado.", { status: 200, headers: corsHeaders });
        }

        const normalizedEmail = email.toLowerCase();

        // 4. Siempre autorizar el email para el acceso inicial (si no existía)
        const { error: authError } = await supabase
            .from("authorized_emails")
            .upsert({ email: normalizedEmail, order_id: String(transactionId) }, { onConflict: "email" });

        if (authError) {
            console.error("Error al insertar email autorizado en Supabase (Hotmart):", authError);
            return new Response("Error al guardar email.", { status: 200, headers: corsHeaders });
        }

        console.log(`[Hotmart] Email ${normalizedEmail} autorizado correctamente (Transacción: ${transactionId}).`);

        return new Response("OK", { status: 200, headers: corsHeaders });
    } catch (error: any) {
        console.error("Error procesando Webhook de Hotmart:", error);
        return new Response("Error interno del servidor", { status: 200, headers: corsHeaders });
    }
}
