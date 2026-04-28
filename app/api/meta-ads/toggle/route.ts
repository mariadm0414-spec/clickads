import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("meta_access_token")?.value;
    if (!token) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

    const body = await req.json();
    const { id, status } = body as { id: string; status: "ACTIVE" | "PAUSED" };

    if (!id || !["ACTIVE", "PAUSED"].includes(status)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, access_token: token }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return NextResponse.json({ success: true, id, status });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
