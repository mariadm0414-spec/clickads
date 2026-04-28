import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseSSRClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );
}

// GET /api/team/chats?userId=...&agentId=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const agentId = searchParams.get("agentId");

        const ssr_supabase = await getSupabaseSSRClient();
        let finalUserId: string | null = null;

        // --- 1. Obtener User a través de Cookie Nativo SSR ---
        const { data: { user } } = await ssr_supabase.auth.getUser();
        if (user?.id) {
            finalUserId = user.id;
        }

        // --- 2. Fallback a Token JWT header ---
        if (!finalUserId) {
            const authHeader = req.headers.get("Authorization");
            if (authHeader) {
                const token = authHeader.replace("Bearer ", "");
                const { data: { user: fallbackUser } } = await ssr_supabase.auth.getUser(token);
                if (fallbackUser?.id) finalUserId = fallbackUser.id;
            }
        }

        // --- 3. Compatibilidad Nativa con el Auth Context Custom ---
        if (!finalUserId && userId && !userId.includes("-")) {
            try {
                const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
                const decodedEmail = Buffer.from(userId, "base64").toString("utf-8");

                const { data: profile } = await adminSupabase
                    .from("profiles")
                    .select("id")
                    .eq("email", decodedEmail)
                    .single();

                if (profile?.id) {
                    finalUserId = profile.id;
                } else {
                    const { data: authUsers } = await adminSupabase.auth.admin.listUsers();
                    const matchedAuth = authUsers.users.find(u => u.email === decodedEmail);
                    if (matchedAuth?.id) finalUserId = matchedAuth.id;
                }
            } catch (e) {
                console.log("Error decoding base64 email", e);
            }
        }

        if (!finalUserId) {
            // No error on GET, just return empty so sidebar doesn't crash, 
            // but log it to console because the POST route will fail anyway
            console.warn("GET /api/team/chats: Could not resolve finalUserId for " + userId);
            return NextResponse.json({ chats: [] });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const adminSupabase = createClient(supabaseUrl, supabaseKey);

        let query = adminSupabase.from("chats").select("*").eq("user_id", finalUserId).order("updated_at", { ascending: false });
        if (agentId) {
            query = query.eq("agent_id", agentId);
        }

        const { data, error } = await query;
        if (error) {
            console.error("GET Chats select error:", error);
            throw new Error(`Error BD al leer historial: ${error.message}`);
        }

        return NextResponse.json({ chats: data });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Error al obtener chats" }, { status: 500 });
    }
}
