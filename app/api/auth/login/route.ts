import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const lowEmail = email.trim().toLowerCase();

        // 1. AUTENTICACIÓN OFICIAL (Supabase Auth)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: lowEmail,
            password: password
        });

        if (authError) {
            return NextResponse.json({ 
                error: "Credenciales inválidas. Verifica tu correo y contraseña." 
            }, { status: 401 });
        }

        // 2. VERIFICACIÓN DE STATUS EN TABLA authorized_users
        const { data: userData } = await supabaseAdmin
            .from("authorized_users")
            .select("*")
            .ilike("email", lowEmail)
            .maybeSingle();

        if (!userData || userData.status !== 'active') {
            return NextResponse.json({ 
                error: "Tu acceso no está activo o no tienes perfil configurado." 
            }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            user: {
                email: userData.email,
                name: userData.full_name || "Usuario",
                photo: userData.avatar_url || null
            }
        });

    } catch (err: any) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
