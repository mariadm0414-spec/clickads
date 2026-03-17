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
        // Simplificado: Cualquier evento de compra o suscripción asegura el acceso.
        // Las cancelaciones se manejan manualmente en Supabase según el pedido del usuario.

        const validEvents = [
            'PUR_APPROVED',
            'PUR_COMPLETE',
            'BIL_PRINTED',
            'PUR_DELAYED',
            'PUR_PROTESTED',
            'PAYMENT_OUT_OF_BANDS',
            'PUR_CANCELED',
            'PUR_REFUNDED',
            'PUR_EXPIRED',
            'PUR_CHARGEBACK',
            'SUBSCRIPTION_CANCELLATION'
        ];

        if (validEvents.includes(event)) {
            console.log(`Processing event ${event} for ${email} - Ensuring user is active`);
            const { error } = await supabase
                .from('authorized_users')
                .upsert({
                    email,
                    full_name: fullName,
                    status: 'active'
                }, { onConflict: 'email' });

            if (error) {
                console.error("Supabase Upsert Error:", error);
                throw error;
            }
        } else {
            console.log(`Event ${event} ignored as it's not a primary purchase event.`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Hotmart Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
