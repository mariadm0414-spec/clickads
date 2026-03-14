import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
    try {
        const { email, name, password } = await req.json();
        const lowEmail = email.trim().toLowerCase();

        // 1. REGLA: Solo permitir registro si ya está autorizado previamente
        const { data: authRecord } = await supabaseAdmin
            .from('authorized_users')
            .select('*')
            .ilike('email', lowEmail)
            .maybeSingle();

        if (!authRecord) {
            return NextResponse.json({ 
                error: "No tienes permiso para registrarte. Contacta a soporte." 
            }, { status: 403 });
        }

        // 2. CREAR/ACTUALIZAR EN SUPABASE AUTH
        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: lowEmail,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: name }
        });

        // Si ya existe, actualizamos su contraseña
        if (authError && (authError.message.includes('already registered') || authError.status === 422)) {
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users.find(u => u.email?.toLowerCase() === lowEmail);
            if (existingUser) {
                await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                    password: password,
                    user_metadata: { full_name: name }
                });
            }
        }

        // 3. ACTUALIZAR PERFIL
        await supabaseAdmin
            .from('authorized_users')
            .upsert({ email: lowEmail, full_name: name, status: 'active' }, { onConflict: 'email' });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
