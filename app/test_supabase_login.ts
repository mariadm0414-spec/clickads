import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    "https://vhhrjjgnjnbmfxfjnqbt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHJqamduam5ibWZ4ZmpucWJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MTE5NCwiZXhwIjoyMDg4OTI3MTk0fQ.02alM1ntqHiDmiJ7ehgrLovwSaMBzLWqAChl-BXxNeg"
);

async function testSupabaseLogin() {
    const email = "mariadm0414@gmail.com";
    const lowEmail = email.trim().toLowerCase();

    console.log("=== Testing email:", lowEmail, "===");

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

    console.log("\\n--- Results from authorized_users ---");
    if (authError) console.error("Error:", authError);
    else console.log("Data:", authData);

    console.log("\\n--- Results from acceso_total ---");
    if (totalError) console.error("Error:", totalError);
    else console.log("Data:", totalAccessData);

    const isMaster = ['mariadm0414@gmail.com', 'julianzuluagaduque@gmail.com'].includes(lowEmail);
    console.log("\\n--- Is Master ---");
    console.log(isMaster);
}

testSupabaseLogin();
