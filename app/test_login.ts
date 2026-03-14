import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    "https://vhhrjjgnjnbmfxfjnqbt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHJqamduam5ibWZ4ZmpucWJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MTE5NCwiZXhwIjoyMDg4OTI3MTk0fQ.02alM1ntqHiDmiJ7ehgrLovwSaMBzLWqAChl-BXxNeg"
);

async function checkUser(email: string) {
    const lowEmail = email.trim().toLowerCase();

    console.log("Checking email:", lowEmail);

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

    console.log("Auth Error:", authError);
    console.log("Total Error:", totalError);
    console.log("Auth Data:", authData);
    console.log("Total Data:", totalAccessData);
}

async function main() {
    await checkUser("mariadm0414@gmail.com");
    await checkUser("julianzuluagaduque@gmail.com");
}

main();
