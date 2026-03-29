import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const accessToken = searchParams.get("token");

    if (!accountId || !accessToken) {
        return NextResponse.json({ error: "Missing accountId or token" }, { status: 400 });
    }

    // --- MOCK RESPONSE FOR DEMO TO AVOID REAL API CALLS IF TOKEN IS FAKE ---
    if (accountId === "act_123456789" || (accessToken && accessToken.startsWith("mock_"))) {
        // Return improved mock data
        return NextResponse.json({
            metrics: {
                spend: 1540.20,
                impressions: 52000,
                clicks: 1450,
                ctr: 2.78,
                cpc: 1.06,
                roas: 4.2
            }
        });
    }

    try {
        // --- REAL META MARKETING API CALL ---

        // 1. Get Insights (Last 28 days by default or today?)
        // Let's get "today" or "lifetime" or last_30d. User asked for "Resultados Hoy" in the title?
        // Widget title says "Resultados Hoy". Let's do `date_preset=today`.

        const insightsUrl = `https://graph.facebook.com/v19.0/${accountId}/insights?fields=spend,impressions,clicks,cpc,ctr,purchase_roas&date_preset=today&access_token=${accessToken}`;

        const res = await fetch(insightsUrl);
        const data = await res.json();

        if (data.error) {
            console.error("Meta API returned error:", data.error);
            // Fallback to mock data if error (for smoother demo if token expired)
            // Or throw? Let's return error to widget
            throw new Error(data.error.message);
        }

        const stats = data.data?.[0] || {};

        // Transform data
        // Meta API returns purchase_roas as array [{action_type: 'omni_purchase', value: '...'}]

        let roas = 0;
        if (stats.purchase_roas && Array.isArray(stats.purchase_roas)) {
            const roasObj = stats.purchase_roas.find((r: any) => r.action_type === 'omni_purchase' || r.action_type === 'purchase');
            if (roasObj) roas = parseFloat(roasObj.value);
        }

        return NextResponse.json({
            metrics: {
                spend: parseFloat(stats.spend || "0"),
                impressions: parseInt(stats.impressions || "0"),
                clicks: parseInt(stats.clicks || "0"),
                ctr: parseFloat(stats.ctr || "0"),
                cpc: parseFloat(stats.cpc || "0"),
                roas: roas
            }
        });

    } catch (error: any) {
        console.error("Meta Analytics Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
    }
}
