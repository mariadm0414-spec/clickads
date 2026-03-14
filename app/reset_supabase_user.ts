import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    "https://vhhrjjgnjnbmfxfjnqbt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHJqamduam5ibWZ4ZmpucWJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MTE5NCwiZXhwIjoyMDg4OTI3MTk0fQ.02alM1ntqHiDmiJ7ehgrLovwSaMBzLWqAChl-BXxNeg"
);

async function resetUser() {
    const email = "mariadm0414@gmail.com";
    const password = "0414mariadelmaR!";
    const lowEmail = email.trim().toLowerCase();

    console.log("=== Resetting user:", lowEmail, "===");

    // 1. ELIMINAR SI EXISTE (para asegurar limpieza)
    console.log("Deleting existing entries...");
    await supabaseAdmin.from("authorized_users").delete().ilike("email", lowEmail);
    // No borramos de acceso_total para no perder el registro de compra si lo hubiera, 
    // pero nos aseguramos de que esté ahí con status active.

    // 2. CREAR DE NUEVO EN authorized_users
    console.log("Creating new entry in authorized_users...");
    const { data: newData, error: newError } = await supabaseAdmin
        .from("authorized_users")
        .insert({
            email: lowEmail,
            full_name: "Maria del Mar CEO",
            password: password,
            status: "active"
        })
        .select();

    if (newError) {
        console.error("Error creating user:", newError);
    } else {
        console.log("User created successfully in authorized_users:", newData);
    }

    // 3. ASEGURAR QUE ESTÉ EN acceso_total CON STATUS ACTIVE
    console.log("Ensuring entry in acceso_total...");
    const { data: totalData, error: totalError } = await supabaseAdmin
        .from("acceso_total")
        .upsert({
            email: lowEmail,
            status: "active"
        }, { onConflict: 'email' })
        .select();

    if (totalError) {
        console.error("Error updating acceso_total:", totalError);
    } else {
        console.log("User updated successfully in acceso_total:", totalData);
    }
}

resetUser();
