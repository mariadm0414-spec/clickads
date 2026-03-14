
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const email = data.buyer?.email?.toLowerCase();
        const fullName = data.buyer?.name;

        if (!email) return NextResponse.json({ error: "No email provided" }, { status: 400 });

        console.log(`Hotmart Event: ${event} for ${email}`);

        // Mapeo de eventos de Hotmart a status de ClickAds
        let status = 'active';

        // Eventos que activan el acceso
        const approvedEvents = [
            'PUR_APPROVED',
            'PUR_COMPLETE',
            'BIL_PRINTED', // Opcional: Permitir acceso mientras paga el boleto?
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

