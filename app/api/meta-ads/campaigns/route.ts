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
    const adAccountId = req.cookies.get("meta_ad_account_id")?.value;

    if (!token || !adAccountId) {
        return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const preset = DATE_PRESET_MAP[searchParams.get("date_preset") || "last_7d"] || "last_7_days";

    const insightsFields = [
        "spend",
        "impressions",
        "clicks",
        "ctr",
        "cpc",
        "actions",
        "action_values",
        "purchase_roas",
        "cost_per_action_type",
    ].join(",");

    const fields = [
        "id",
        "name",
        "status",
        "daily_budget",
        "lifetime_budget",
        `insights.date_preset(${preset}){${insightsFields}}`,
    ].join(",");

    try {
        const res = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/campaigns?` +
            new URLSearchParams({ fields, limit: "50", access_token: token })
        );
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        // Normalise insights
        const campaigns = (data.data || []).map((c: any) => {
            const ins = c.insights?.data?.[0] || {};
            const purchaseAction = ins.actions?.find((a: any) => a.action_type === "purchase");
            const roas = parseFloat(ins.purchase_roas?.[0]?.value || "0");
            return {
                id: c.id,
                name: c.name,
                status: c.status,
                daily_budget: c.daily_budget ? parseInt(c.daily_budget) / 100 : null,
                lifetime_budget: c.lifetime_budget ? parseInt(c.lifetime_budget) / 100 : null,
                spend: parseFloat(ins.spend || "0"),
                impressions: parseInt(ins.impressions || "0"),
                clicks: parseInt(ins.clicks || "0"),
                ctr: parseFloat(ins.ctr || "0"),
                cpc: parseFloat(ins.cpc || "0"),
                purchases: parseInt(purchaseAction?.value || "0"),
                roas,
            };
        });

        return NextResponse.json({ campaigns });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
