import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Database config (Server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "" // Note: Use Service Role for backend writes
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Hotmart sends the status and user data in the body
        // Event types: PUR_APPROVED, PUR_CANCELED, PUR_REFUNDED
        const event = body.event;
        const email = body.data?.buyer?.email || body.email; // Support different Hotmart versions

        if (!email) {
            return NextResponse.json({ error: "No email found in payload" }, { status: 400 });
        }

        console.log(`Processing Hotmart Event: ${event} for ${email}`);

        if (event === 'PUR_APPROVED') {
            // Upsert user into authorized_users with active status and clear grace period
            const { error } = await supabase
                .from('authorized_users')
                .upsert({
                    email: email.toLowerCase(),
                    status: 'active',
                    grace_period_until: null,
                    updated_at: new Date()
                }, { onConflict: 'email' });

            if (error) throw error;
        }
        else if (event === 'PUR_DELAYED' || event === 'PUR_PROTESTED') {
            // Payment failed or delayed. Give 15 days grace period if not already set.
            // We only set it if the user is currently active or if it's not set yet.
            const fifteenDaysLater = new Date();
            fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);

            const { data: user } = await supabase
                .from('authorized_users')
                .select('grace_period_until')
                .eq('email', email.toLowerCase())
                .single();

            // Only set grace period if they don't have one yet
            if (!user?.grace_period_until) {
                const { error } = await supabase
                    .from('authorized_users')
                    .upsert({
                        email: email.toLowerCase(),
                        status: 'delayed',
                        grace_period_until: fifteenDaysLater,
                        updated_at: new Date()
                    }, { onConflict: 'email' });

                if (error) throw error;
            }
        }
        else if (event === 'PUR_CANCELED' || event === 'PUR_REFUNDED' || event === 'PUR_EXPIRED') {
            // Immediate removal of access
            const { error } = await supabase
                .from('authorized_users')
                .update({
                    status: 'inactive',
                    grace_period_until: null,
                    updated_at: new Date()
                })
                .eq('email', email.toLowerCase());

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
