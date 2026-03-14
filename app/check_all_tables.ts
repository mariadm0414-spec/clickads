import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    "https://vhhrjjgnjnbmfxfjnqbt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaHJqamduam5ibWZ4ZmpucWJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MTE5NCwiZXhwIjoyMDg4OTI3MTk0fQ.02alM1ntqHiDmiJ7ehgrLovwSaMBzLWqAChl-BXxNeg"
);

async function checkAllTables() {
    const email = "mariadm0414@gmail.com";
    const lowEmail = email.trim().toLowerCase();

    console.log("=== Checking all possible tables for:", lowEmail, "===");

    const tables = ["authorized_users", "acceso_total", "profiles", "users", "authorized_emails"];

    for (const table of tables) {
        try {
            const { data, error } = await supabaseAdmin
                .from(table)
                .select("*")
                .ilike("email", lowEmail)
                .maybeSingle();

            if (error) {
                console.log(`Table '${table}': ERROR (${error.message})`);
            } else if (data) {
                console.log(`Table '${table}': FOUND`, data);
            } else {
                console.log(`Table '${table}': NOT FOUND`);
            }
        } catch (e: any) {
            console.log(`Table '${table}': EXCEPTION (${e.message})`);
        }
    }
}

checkAllTables();
