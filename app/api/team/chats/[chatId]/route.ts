import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
    if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

    try {
        const { chatId } = await params;

        // Fetch chat
        const { data: chat, error: chatError } = await supabase
            .from("chats")
            .select("*")
            .eq("id", chatId)
            .single();

        if (chatError || !chat) {
            return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
        }

        // Fetch messages
        const { data: messages, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        return NextResponse.json({ chat, messages: messages || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Error al obtener chat" }, { status: 500 });
    }
}
