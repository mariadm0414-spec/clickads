import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;
        const normalizedEmail = email.trim().toLowerCase();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Faltan las llaves en Vercel." }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // 1. EL CANDADO VIP DE SHOPIFY (¡Activado de nuevo!)
        const { data: authorized, error: authError } = await supabaseAdmin
            .from("authorized_emails")
            .select("email")
            .eq("email", normalizedEmail)
            .single();

        if (authError || !authorized) {
            return NextResponse.json(
                { error: "Acceso denegado. Este correo no tiene una compra vinculada a Shopify." },
                { status: 401 }
            );
        }

        // 2. Crear el usuario en Auth (Solo llega aquí si pasó el candado)
        const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            password: password,
            email_confirm: true,
            user_metadata: { name: name }
        });

        if (signUpError && !signUpError.message.includes("already")) {
            return NextResponse.json({ error: `Error Auth: ${signUpError.message}` }, { status: 400 });
        }

        // 3. Guardar en Profiles con sus 10 créditos para Manus
        try {
            const userId = authData?.user?.id;
            if (userId) {
                await supabaseAdmin.from("profiles").upsert({
                    id: userId,
                    email: normalizedEmail,
                    name: name,
                    credits: 10
                });
            }
        } catch (e) {
            console.log("Aviso: El perfil no se guardó, pero el usuario sí entró.");
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
    }
}
