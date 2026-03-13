import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Configuración directa de Supabase (Usa tus variables de entorno)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

        // Extraer Email con alta compatibilidad
        const rawEmail =
            body.data?.buyer?.email ||
            body.data?.subscriber?.email ||
            body.data?.subscription?.subscriber?.email ||
            body.email ||
            body.data?.email;

        const email = (typeof rawEmail === 'string') ? rawEmail.trim().toLowerCase() : null;

        console.log(`[Hotmart Webhook] EVENTO: ${event} | EMAIL: ${email || 'Desconocido'}`);

        if (!email) {
            console.warn(`[Hotmart Webhook] Email no encontrado. Evento: ${event}`);
            return NextResponse.json({ success: true, message: "No email to process" });
        }

        // --- LÓGICA DE BASE DE DATOS ---

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
