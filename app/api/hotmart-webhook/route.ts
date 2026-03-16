import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event = body.event;
        const data = body.data;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const email = data.buyer?.email?.toLowerCase();
        const fullName = data.buyer?.name;

        // Si no hay email, no podemos hacer nada en Supabase.
        // Respondemos 200 para que Hotmart deje de reintentar un evento que no tiene datos suficientes.
        if (!email) {
            console.log(`Skipping event ${event}: No email provided in payload.`);
            return NextResponse.json({ success: true, message: "Process skipped: no email" });
        }

        console.log(`Hotmart Event: ${event} for ${email}`);

        // Mapeo de eventos de Hotmart a status de ClickAds
        let status = 'active';

        // Eventos que activan el acceso
        const approvedEvents = [
            'PUR_APPROVED',
            'PUR_COMPLETE',
            'BIL_PRINTED',
        ];

        // Eventos que suspenden temporalmente (Mora)
        const delayedEvents = [
            'PUR_DELAYED',
            'PUR_PROTESTED',
            'PAYMENT_OUT_OF_BANDS',
        ];

        // Eventos que cancelan el acceso
        const inactiveEvents = [
            'PUR_CANCELED',
            'PUR_REFUNDED',
            'PUR_EXPIRED',
            'PUR_CHARGEBACK',
            'SUBSCRIPTION_CANCELLATION', // Añadido para suscripciones
        ];

        if (approvedEvents.includes(event)) {
            status = 'active';
            const { error } = await supabase
                .from('authorized_users')
                .upsert({
                    email,
                    full_name: fullName,
                    status: 'active'
                }, { onConflict: 'email' });

            if (error) throw error;
        }
        else if (delayedEvents.includes(event)) {
            const { error: updateError } = await supabase
                .from('authorized_users')
                .update({ status: 'delayed' })
                .eq('email', email);

            if (updateError) throw updateError;
        }
        else if (inactiveEvents.includes(event)) {
            const { error: updateError } = await supabase
                .from('authorized_users')
                .update({ status: 'inactive' })
                .eq('email', email);

            if (updateError) throw updateError;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Hotmart Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
