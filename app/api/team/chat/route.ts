import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { TEAM_AGENTS } from "@/lib/constants/team";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Reutilizable: Create SSR client using cookies for resolving Auth natively
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
                    } catch {
                        // Saltado en server components/routes
                    }
                },
            },
        }
    );
}

export async function POST(req: Request) {
    try {
        let body: any;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "JSON malformado." }, { status: 400 });
        }

        const { agentId, message, history, userId, chatId: incomingChatId, skipUserInsert } = body ?? {};

        if (!agentId || !message) {
            return NextResponse.json({ error: "Faltan parámetros: agentId y message." }, { status: 400 });
        }

        const agent = TEAM_AGENTS.find((a) => a.id === agentId);
        if (!agent) {
            return NextResponse.json({ error: `Agente '${agentId}' no encontrado.` }, { status: 404 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key faltante." }, { status: 500 });
        }

        let currentChatId = incomingChatId;

        // Configurar cliente SSR 
        const ssr_supabase = await getSupabaseSSRClient();

        let finalUserId: string | null = null;

        // --- 1. Obtener User a través de Cookie Nativo SSR ---
        const { data: { user }, error: authError } = await ssr_supabase.auth.getUser();
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
        // El frontend esta enviando userId (base64 de email) debido a /lib/auth-context.tsx
        if (!finalUserId && userId && !userId.includes("-")) {
            try {
                const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
                const decodedEmail = Buffer.from(userId, "base64").toString("utf-8");

                // Intenta encontrar el UUID a traves de public.profiles
                const { data: profile } = await adminSupabase
                    .from("profiles")
                    .select("id")
                    .eq("email", decodedEmail)
                    .single();

                if (profile?.id) {
                    finalUserId = profile.id;
                } else {
                    // Intenta encontrar el UUID a traves de Auth Admin
                    const { data: authUsers } = await adminSupabase.auth.admin.listUsers();
                    const matchedAuth = authUsers.users.find(u => u.email === decodedEmail);
                    if (matchedAuth?.id) finalUserId = matchedAuth.id;
                }
            } catch (e) {
                console.error("No se pudo descodificar o encontrar el userId base64:", e);
            }
        }

        if (!finalUserId) {
            // Lanza excepción explícita (evitando el fallo silencioso)
            throw new Error("No estás autenticado, el token expiró o tu cuenta no está en Supabase.");
        }

        // --- INSTANCIA PARA INSERT: Depende de RLS ---
        // Usamos ssr_supabase para respetar el cliente autenticado si pasaron cookies,
        // o si prefieres evitar bloqueos de RLS fallidos, usamos admin Supabase. 
        // Aca uso adminSupabase temporalmente mientras terminas de migrar tu UI al Auth SSR,
        // pero validando SIEMPRE con la lógica estricta que tú exigiste arriba.
        const insertClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        // Si tenemos userId válido (UUID), guardamos en base de datos
        if (!skipUserInsert) {
            if (!currentChatId) {
                const title = message.length > 40 ? message.substring(0, 40) + "..." : message;

                const { data: newChat, error: chatError } = await insertClient
                    .from("chats")
                    .insert({ user_id: finalUserId, agent_id: agentId, title: title })
                    .select("*")
                    .single();

                if (chatError) {
                    console.error("Error INSERT Chats:", chatError);
                    throw new Error(`Error BD (chats): ${chatError.message}`);
                }
                currentChatId = newChat.id;
            }

            // Insertar mensaje del usuario
            if (currentChatId) {
                const { error: msgErr } = await insertClient.from("messages").insert({
                    chat_id: currentChatId,
                    role: "user",
                    content: message
                });
                if (msgErr) {
                    console.error("Error INSERT Messages:", msgErr);
                    throw new Error(`Error BD (messages): ${msgErr.message}`);
                }
            }
        }

        const chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
        if (Array.isArray(history)) {
            for (const msg of history) {
                if (msg?.role && msg?.text) {
                    chatHistory.push({
                        role: msg.role === "user" ? "user" : "model",
                        parts: [{ text: String(msg.text) }],
                    });
                }
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        }, { apiVersion: "v1" });

        const gChat = model.startChat({ history: chatHistory });

        let result;
        try {
            const finalPrompt = `[INSTRUCCIONES DE SISTEMA]: ${agent.systemPrompt}\n\n[MENSAJE DEL USUARIO]: ${String(message)}`;
            result = await gChat.sendMessage(finalPrompt);
        } catch (geminiErr: any) {
            return NextResponse.json({ error: `Error de Gemini: ${geminiErr?.message}` }, { status: 502 });
        }

        let reply = "";
        try {
            reply = result.response.text();
        } catch (textErr: any) {
            const blockReason = result.response?.promptFeedback?.blockReason || "UNKNOWN";
            return NextResponse.json({ error: `Bloqueado por IA (${blockReason}).` }, { status: 422 });
        }

        if (!reply || reply.trim() === "") {
            return NextResponse.json({ error: "Respuesta vacía de IA." }, { status: 502 });
        }

        // Insertar respuesta de la IA en BD
        if (currentChatId) {
            await insertClient.from("messages").insert({
                chat_id: currentChatId,
                role: "model",
                content: reply
            });
            await insertClient.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", currentChatId);
        }

        return NextResponse.json({ reply, chatId: currentChatId });

    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Error interno." }, { status: 500 });
    }
}
