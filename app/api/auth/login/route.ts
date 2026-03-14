import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Usamos el Service Role Key para saltarnos cualquier restricción de RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const lowEmail = email.trim().toLowerCase();

        // BYPASS DE EMERGENCIA - María
        if (lowEmail === "mariadm0414@gmail.com" && password === "0414mariadelmaR!") {
            console.log("[EMERGENCY BYPASS] Admin login successful for Maria");
            return NextResponse.json({
                success: true,
                user: {
                    email: "mariadm0414@gmail.com",
                    name: "Maria del Mar CEO",
                    photo: null
                }
            });
        }

        console.log(`[LOGIN ATTEMPT] Email: "${lowEmail}"`);

        const isMaster = ['mariadm0414@gmail.com', 'julianzuluagaduque@gmail.com'].includes(lowEmail);

        // 1. OBTENER DATOS DEL USUARIO
        const { data: authData, error: authError } = await supabaseAdmin
            .from("authorized_users")
            .select("*")
            .ilike("email", lowEmail)
            .maybeSingle();

        const { data: totalAccessData, error: totalError } = await supabaseAdmin
            .from("acceso_total")
            .select("*")
            .ilike("email", lowEmail)
            .maybeSingle();

        console.log(`[LOGIN DB RESULT] authData: ${authData ? 'FOUND' : 'NOT FOUND'}, totalAccessData: ${totalAccessData ? 'FOUND' : 'NOT FOUND'}`);

        if (authError || totalError) {
            console.error("Auth DB Error:", authError || totalError);
            return NextResponse.json({ error: "Error de base de datos." }, { status: 500 });
        }

        // Si no está registrado en ninguna tabla Y no es master, rebote.
        if (!authData && !totalAccessData && !isMaster) {
            console.log(`[LOGIN FAILED] Reason: Not registered. Email: ${lowEmail}`);
            return NextResponse.json({
                error: "Este correo no está registrado."
            }, { status: 403 });
        }

        // VALIDACIÓN DE CONTRASEÑA OBLIGATORIA
        // Si el usuario no existe en authorized_users o no tiene clave, no puede entrar.
        if (!authData || !authData.password) {
            console.log(`[LOGIN FAILED] Reason: No password/authData found for ${lowEmail}`);
            return NextResponse.json({
                error: "Aún no tienes una contraseña creada. Por favor ve a 'Crear Cuenta' para configurar tu acceso."
            }, { status: 403 });
        }

        if (authData.password !== password) {
            console.log(`[LOGIN FAILED] Reason: Incorrect password for ${lowEmail}`);
            return NextResponse.json({
                error: "CONTRASEÑA INCORRECTA. Si no la recuerdas, usa el link de recuperar abajo."
            }, { status: 401 });
        }

        console.log(`[LOGIN SUCCESS] Email: ${lowEmail}`);
        return NextResponse.json({
            success: true,
            user: {
                email: authData.email,
                name: authData.full_name || (isMaster ? "Usuario VIP" : "Estudiante"),
                photo: authData.avatar_url || null
            }
        });

    } catch (err: any) {
        console.error("[LOGIN CRITICAL ERROR]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
