import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Auth con Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        // 2. Verificar Status en authorized_users
        const { data: userData, error: dbError } = await supabaseAdmin
            .from('authorized_users')
            .select('full_name, status, avatar_url')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (!userData) {
            return NextResponse.json({
                error: "Acceso no autorizado o correo no registrado. Por favor, realiza tu compra primero."
            }, { status: 403 });
        }

        return NextResponse.json({
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name: userData.full_name,
                photo: userData.avatar_url
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
