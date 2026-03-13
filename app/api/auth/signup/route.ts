import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Usamos el Service Role Key para saltarnos cualquier restricción de RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
    try {
        const { email, name, password } = await req.json();
        const lowEmail = email.trim().toLowerCase();

        // 1. Verificar si el usuario está en authorized_users o acceso_total
        const { data: authData } = await supabaseAdmin
            .from('authorized_users')
            .select('*')
            .ilike('email', lowEmail)
            .maybeSingle();

        const { data: totalAccessData } = await supabaseAdmin
            .from('acceso_total')
            .select('*')
            .ilike('email', lowEmail)
            .maybeSingle();

        const isMaster = ['mariadm0414@gmail.com', 'julianzuluagaduque@gmail.com'].includes(lowEmail);

        if (!authData && !totalAccessData && !isMaster) {
            return NextResponse.json({
                error: "Este correo no está registrado como comprador ni tiene acceso total."
            }, { status: 403 });
        }

        // 2. Realizar el Upsert en authorized_users
        const { error: upsertError } = await supabaseAdmin
            .from('authorized_users')
            .upsert({
                email: lowEmail,
                full_name: name,
                password: password,
                status: authData?.status || 'active'
            }, { onConflict: 'email' });

        if (upsertError) {
            console.error("Signup Upsert Error:", upsertError);
            return NextResponse.json({
                error: `Error de base de datos: ${upsertError.message} (${upsertError.code})`
            }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
