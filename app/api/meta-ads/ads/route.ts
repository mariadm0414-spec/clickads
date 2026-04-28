import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DATE_PRESET_MAP: Record<string, string> = {
    today: "today",
    yesterday: "yesterday",
    last_7d: "last_7_days",
    this_month: "this_month",
};

export async function GET(req: NextRequest) {
    const token = req.cookies.get("meta_access_token")?.value;
    if (!token) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const adsetId = searchParams.get("adset_id");
    if (!adsetId) return NextResponse.json({ error: "adset_id required" }, { status: 400 });

    const preset = DATE_PRESET_MAP[searchParams.get("date_preset") || "last_7d"] || "last_7_days";
    const insightsFields = "spend,impressions,clicks,ctr,cpc,actions,purchase_roas";
    const fields = [
        "id", "name", "status",
        "creative{thumbnail_url,title,body}",
        `insights.date_preset(${preset}){${insightsFields}}`,
    ].join(",");

    try {
        const res = await fetch(
            `https://graph.facebook.com/v19.0/${adsetId}/ads?` +
            new URLSearchParams({ fields, limit: "50", access_token: token })
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        const ads = (data.data || []).map((a: any) => {
            const ins = a.insights?.data?.[0] || {};
            const purchases = ins.actions?.find((x: any) => x.action_type === "purchase");
            return {
                id: a.id,
                name: a.name,
                status: a.status,
                thumbnail: a.creative?.thumbnail_url || null,
                spend: parseFloat(ins.spend || "0"),
                impressions: parseInt(ins.impressions || "0"),
                clicks: parseInt(ins.clicks || "0"),
                ctr: parseFloat(ins.ctr || "0"),
                cpc: parseFloat(ins.cpc || "0"),
                purchases: parseInt(purchases?.value || "0"),
                roas: parseFloat(ins.purchase_roas?.[0]?.value || "0"),
            };
        });

        return NextResponse.json({ ads });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
