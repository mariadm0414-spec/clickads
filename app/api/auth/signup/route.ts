import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ message: "Signup API is reachable" });
}

export async function POST(req: Request) {
    try {
        const { email, password, full_name } = await req.json();
        const cleanEmail = email.trim().toLowerCase();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Registro abierto: cualquier persona puede crear su cuenta, sin necesidad de
        // estar previamente en la lista de compradores autorizados (authorized_users
        // ya NO se usa como filtro de acceso, solo queda como registro/perfil).

        // 1. Crear el usuario en Supabase Auth (usando Admin para saltar confirmación)
        const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: full_name || "" }
        });

        if (authError) {
            // Si ya existe, lo actualizamos por si acaso
            if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);

                if (existingUser) {
                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        password: password,
                        user_metadata: { full_name: full_name || existingUser.user_metadata?.full_name || "" }
                    });
                } else {
                    return NextResponse.json({ error: "El usuario ya existe pero no se pudo actualizar." }, { status: 400 });
                }
            } else {
                return NextResponse.json({ error: authError.message }, { status: 400 });
            }
        }

        // 2. Registrar/actualizar el perfil en authorized_users (ya no filtra el acceso,
        //    pero otras partes de la app —como la foto de perfil— siguen leyendo de aquí).
        await supabaseAdmin
            .from('authorized_users')
            .upsert({
                email: cleanEmail,
                full_name: full_name || "",
                status: 'active'
            }, { onConflict: 'email' });

        return NextResponse.json({ message: "Registro completado con éxito" });

    } catch (error) {
        console.error("Critical Signup Error:", error);
        return NextResponse.json({ error: "Error interno al procesar el registro" }, { status: 500 });
    }
}
