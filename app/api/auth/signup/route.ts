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

        // 1. Verificar si el correo está en la lista de autorizados
        const { data: authRecord, error: dbError } = await supabaseAdmin
            .from('authorized_users')
            .select('*')
            .ilike('email', cleanEmail)
            .maybeSingle();

        if (dbError || !authRecord) {
            return NextResponse.json({
                error: "No puedes registrarte. Este correo no está registrado como comprador en nuestra base de datos."
            }, { status: 403 });
        }

        // 2. Crear el usuario en Supabase Auth (usando Admin para saltar confirmación)
        const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: full_name || authRecord.full_name }
        });

        if (authError) {
            // Si ya existe, lo actualizamos por si acaso
            if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);

                if (existingUser) {
                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        password: password,
                        user_metadata: { full_name: full_name || authRecord.full_name }
                    });
                } else {
                    return NextResponse.json({ error: "El usuario ya existe pero no se pudo actualizar." }, { status: 400 });
                }
            } else {
                return NextResponse.json({ error: authError.message }, { status: 400 });
            }
        }

        // 3. Opcional: Asegurar que el status sea active en la tabla
        await supabaseAdmin
            .from('authorized_users')
            .update({ status: 'active', full_name: full_name || authRecord.full_name })
            .ilike('email', cleanEmail);

        return NextResponse.json({ message: "Registro completado con éxito" });

    } catch (error) {
        console.error("Critical Signup Error:", error);
        return NextResponse.json({ error: "Error interno al procesar el registro" }, { status: 500 });
    }
}
