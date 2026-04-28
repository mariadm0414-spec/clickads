import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
    if (!supabase) {
        return NextResponse.json({ error: "Supabase no está configurado correctamente." }, { status: 500 });
    }

    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Todos los campos (nombre, correo, contraseña) son requeridos." }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Verificación de compra en authorized_emails vinculados a Shopify
        const { data: authorized, error: authError } = await supabase
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

        // 2. Extracción de IP
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            req.headers.get("cf-connecting-ip") ||
            req.headers.get("true-client-ip") ||
            "desconocida";

        // 3. Verificación de IP en tabla profiles - Bloqueo de Límite de cuentas
        if (ip !== "desconocida") {
            const { data: existingProfiles, error: profileError } = await supabase
                .from("profiles")
                .select("email, ip_address")
                .eq("ip_address", ip)
                .neq("email", normalizedEmail);

            if (!profileError && existingProfiles && existingProfiles.length > 0) {
                return NextResponse.json(
                    { error: "Límite de cuentas por conexión alcanzado." },
                    { status: 401 }
                );
            }
        }

        // 4. Guardar los datos en profiles (o insertarlos)
        // Guardamos el Name, Email, e IP en la base de datos profiles
        const { error: upsertError } = await supabase
            .from("profiles")
            .upsert({ email: normalizedEmail, ip_address: ip, name: name }, { onConflict: "email" });

        if (upsertError) {
            console.error("Error guardando el perfil en Supabase:", upsertError);
            // Even if upsert fails slightly we want to proceed since the user purchased, but ideally it works.
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
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor en el registro." },
            { status: 500 }
        );
    }
}
