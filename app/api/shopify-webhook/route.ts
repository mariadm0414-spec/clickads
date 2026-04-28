import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Inicialización de Supabase ────────────────────────────────────────────────
// Usamos el SERVICE_ROLE para bypass RLS, asegurando que el webhook pueda escribir.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Si no están configuradas las variables, tiramos error rápido
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
    if (!supabase) {
        console.error("Supabase credentials missing in env variables.");
        return new Response("Server Configuration Error", { status: 500 });
    }

    try {
        // Lee el body enviado por Shopify Webhook Payload (generalmente JSON order/creation o payment)
        const order = await req.json();

        // Extraer los datos de interés (Email y Order ID de Shopify)
        const email = order?.email || order?.customer?.email;
        const orderId = order?.id || order?.order_number;

        if (!email) {
            console.warn("Shopify Webhook: Recibimos orden sin email.", orderId);
            return new Response("Sin email. Ignorado.", { status: 200 });
        }

        // Insertar a la tabla authorized_emails en Supabase 
        // asumiendo esquema: authorized_emails ( email, order_id, created_at ... )
        const { error } = await supabase
            .from("authorized_emails")
            .upsert({ email: email.toLowerCase(), order_id: String(orderId) }, { onConflict: "email" });

        if (error) {
            console.error("Error al insertar email autorizado en Supabase:", error);
            // Por requerimiento técnico del webhook solemos devolver 200 para que Shopify no intente de nuevo sin parar, 
            // a menos que sea un error temporal grave.
            return new Response("Error al guardar email.", { status: 200 });
        }

        console.log(`Email ${email} autorizado correctamente (Orden: ${orderId}).`);

        // Retornar status 200 de éxito para Shopify Webhooks
        return new Response("OK", { status: 200 });
    } catch (error: any) {
        console.error("Error procesando Webhook de Shopify:", error);
        // Retornamos 200 para no hacer retry infinito en caso de errores de parseo o malformación del json.
        return new Response("Error interno del servidor", { status: 200 });
    }
}
