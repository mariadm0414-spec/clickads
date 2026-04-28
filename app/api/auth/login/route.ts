import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Inicialización Supabase Admin / Service Role ────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

import { headers } from "next/headers";

export async function POST(req: Request) {
    if (!supabase) {
        return NextResponse.json({ error: "Supabase no está configurado correctament." }, { status: 500 });
    }

    try {
        const { email, password } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "El correo es requerido." }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Verificación en tabla authorized_emails
        const { data: authorized, error: authError } = await supabase
            .from("authorized_emails")
            .select("email")
            .eq("email", normalizedEmail)
            .single();

        if (authError || !authorized) {
            return NextResponse.json(
                { error: "Este correo no tiene una compra activa." },
                { status: 401 }
            );
        }

        // 2. Extracción de IP para evitar compras compartidas / fraude
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            req.headers.get("cf-connecting-ip") ||
            req.headers.get("true-client-ip") ||
            "desconocida";

        // 3. Verificación de IP en tabla profiles para evitar que la misma IP registre múltiples cuentas
        // Nota: asume schema profiles(id, email, ip_address). Cambialo según tu db de perfiles final.
        if (ip !== "desconocida") {
            const { data: existingProfiles, error: profileError } = await supabase
                .from("profiles")
                .select("email, ip_address")
                .eq("ip_address", ip)
                .neq("email", normalizedEmail);

            if (!profileError && existingProfiles && existingProfiles.length > 0) {
                return NextResponse.json(
                    { error: "Cuenta duplicada. Ya existe una cuenta asociada a este dispositivo / red." },
                    { status: 401 }
                );
            }
        }

        // --- ACCESO CONCEDIDO ---
        // Guardar/Actualizar perfil
        const namePart = normalizedEmail.split("@")[0];
        const name = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]/g, " ");

        // Registramos en perfiles (opcionalmente) la IP y usuario la primera vez que inicia sesión/registra
        const { error: upsertError } = await supabase
            .from("profiles")
            .upsert({ email: normalizedEmail, ip_address: ip, name }, { onConflict: "email" });

        if (upsertError) {
            console.error("Error actualizando perfil:", upsertError);
            // Seguimos adelante de igual forma en caso de fallar info secundaria
        }

        return NextResponse.json({
            success: true,
            user: {
                id: Buffer.from(normalizedEmail).toString("base64"),
                name: name,
                email: normalizedEmail,
            },
        });

    } catch (error: any) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
