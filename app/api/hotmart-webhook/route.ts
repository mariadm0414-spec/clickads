import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { event, data } = body;
        const email = data?.buyer?.email?.toLowerCase().trim();

        if (!email) return NextResponse.json({ error: "No email found" }, { status: 400 });

        if (event === 'PUR_APPROVED') {
            await supabase.from('authorized_users').upsert({
                email: email,
                status: 'active',
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });
        } else if (event === 'PUR_REFUNDED' || event === 'PUR_CANCELED') {
            await supabase.from('authorized_users').update({
                status: 'inactive'
            }).eq('email', email);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
