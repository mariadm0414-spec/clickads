import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (error) throw error;

        return NextResponse.json({ profile: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, ...updates } = body;

        if (!email) {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("profiles")
            .upsert({ email: email.toLowerCase(), ...updates }, { onConflict: "email" });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
