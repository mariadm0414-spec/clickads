import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password, full_name } = await request.json();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Verificar si el correo está autorizado
        const { data: authRecord } = await supabaseAdmin
            .from('authorized_users')
            .select('*')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (!authRecord) {
            return NextResponse.json(
                { error: 'Este correo no está registrado como comprador. Por favor, realiza tu compra primero.' },
                { status: 403 }
            );
        }

        // 2. Crear usuario en Auth (usando admin para saltar confirmación de email)
        const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name }
        });

        if (authError) {
            // Si el usuario ya existe, intentamos actualizarlo
            if (authError.message.includes('already registered')) {
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        password: password,
                        user_metadata: { full_name }
                    });
                }
            } else {
                return NextResponse.json({ error: authError.message }, { status: 400 });
            }
        }

        // 3. Sincronizar nombre en la tabla authorized_users
        const { error: upsertError } = await supabaseAdmin
            .from('authorized_users')
            .upsert({
                email: email.toLowerCase(),
                full_name,
                status: 'active'
            }, { onConflict: 'email' });

        return NextResponse.json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
