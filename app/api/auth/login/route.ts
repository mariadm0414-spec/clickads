import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ message: "Login API is reachable" });
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const cleanEmail = email.trim().toLowerCase();

        // Cliente para autenticación (usamos anon key)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Cliente para base de datos (usamos service role para saltar RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Intentar iniciar sesión en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
        });

        if (authError) {
            return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
        }

        // 2. Todo bien, regresamos el usuario
        return NextResponse.json({
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name: authData.user.user_metadata?.full_name || "Usuario",
            }
        });

    } catch (error) {
        console.error("Critical Login Error:", error);
        return NextResponse.json({ error: "Error en el servidor de autenticación" }, { status: 500 });
    }
}
