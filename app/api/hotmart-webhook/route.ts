import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Database config (Server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "" // Note: Use Service Role for backend writes
);

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        console.error("[Hotmart Webhook] Malformed JSON received");
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
        const event = body.event;
        const now = new Date().toISOString();

        // Extraer Email con alta compatibilidad (Suscripciones y Compras)
        const rawEmail =
            body.data?.buyer?.email ||
            body.data?.subscriber?.email ||
            body.data?.subscription?.subscriber?.email ||
            body.email ||
            body.data?.email;

        const email = (typeof rawEmail === 'string') ? rawEmail.trim().toLowerCase() : null;

        console.log(`[Hotmart Webhook] EVENTO: ${event} | EMAIL: ${email || 'Desconocido'}`);

        // Si no hay email, no podemos procesar, pero devolvemos 200 para no dar error 500
        if (!email) {
            console.warn(`[Hotmart Webhook] Email no encontrado. Evento: ${event}`);
            return NextResponse.json({ success: true, message: "No email to process" });
        }

        if (event === 'PUR_APPROVED') {
            const { error } = await supabase
                .from('authorized_users')
                .upsert({
                    email: email,
                    status: 'active',
                    grace_period_until: null,
                    updated_at: now
                }, { onConflict: 'email' });

            if (error) throw new Error(`Supabase Upsert Error (Approved): ${error.message}`);
        }
        else if (event === 'PUR_DELAYED' || event === 'PUR_PROTESTED' || event === 'PUR_DELAYED_PAYMENT') {
            const fifteenDaysLater = new Date();
            fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
            const graceDate = fifteenDaysLater.toISOString();

            // Usamos maybeSingle() para evitar el error 500 si el usuario no existe
            const { data: user, error: fetchError } = await supabase
                .from('authorized_users')
                .select('grace_period_until')
                .eq('email', email)
                .maybeSingle();

            if (fetchError) throw new Error(`Supabase Fetch Error: ${fetchError.message}`);

            if (!user?.grace_period_until) {
                const { error: upsertError } = await supabase
                    .from('authorized_users')
                    .upsert({
                        email: email,
                        status: 'delayed',
                        grace_period_until: graceDate,
                        updated_at: now
                    }, { onConflict: 'email' });

                if (upsertError) throw new Error(`Supabase Upsert Error (Grace): ${upsertError.message}`);
            }
        }
        else if (
            event === 'PUR_CANCELED' ||
            event === 'PUR_REFUNDED' ||
            event === 'PUR_EXPIRED' ||
            event === 'SUBSCRIPTION_CANCELLATION' ||
            event === 'PUR_REVOKED' ||
            event === 'PUR_DEVOLUTION'
        ) {
            const { error: updateError } = await supabase
                .from('authorized_users')
                .update({
                    status: 'inactive',
                    grace_period_until: null,
                    updated_at: now
                })
                .eq('email', email);

            if (updateError) throw new Error(`Supabase Update Error (Deactivate): ${updateError.message}`);
        }

        return NextResponse.json({ success: true, processed: event });

    } catch (error: any) {
        // Log detallado pero retornamos 200 para que Hotmart no marque error 500
        console.error("!!! [Hotmart Webhook CRASH] !!!", {
            message: error.message,
            event: body?.event
        });

        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 200 });
    }
}
