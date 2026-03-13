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
        const event = body.event;

        // Try to find email in all possible Hotmart fields (Purchase or Subscription)
        const email =
            body.data?.buyer?.email ||
            body.data?.subscriber?.email ||
            body.email ||
            body.data?.email;

        console.log(`Processing Hotmart Event: ${event} for ${email || 'unknown'}`);

        // If it's an event but has no email, return 200 to keep Hotmart happy (avoid 400 errors)
        if (!email) {
            console.warn(`Event ${event} received without identifiable email.`);
            return NextResponse.json({ success: true, message: "No email found for processing" });
        }

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
        else if (
            event === 'PUR_CANCELED' ||
            event === 'PUR_REFUNDED' ||
            event === 'PUR_EXPIRED' ||
            event === 'SUBSCRIPTION_CANCELLATION'
        ) {
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
