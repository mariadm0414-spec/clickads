import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { code, redirectUri } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // --- MOCK INTEGRATION FOR DEMO ---
        if (code === "mock_auth_code_123") {
            // Simulate successful token response
            await new Promise(resolve => setTimeout(resolve, 1500));
            return NextResponse.json({
                access_token: "mock_token_" + Date.now(),
                ad_account_id: "act_123456789",
                account_name: "Muimia Oficial Ads",
                connected_at: new Date().toISOString()
            });
        }

        // --- REAL INTEGRATION ---
        const CLIENT_ID = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || process.env.NEXT_PUBLIC_META_APP_ID;
        const CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || process.env.META_APP_SECRET;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Meta App Credentials not configured on server.");
        }
        const exchangeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&client_secret=${CLIENT_SECRET}&code=${code}`;
        const exchangeRes = await fetch(exchangeUrl);
        const exchangeData = await exchangeRes.json();

        if (exchangeData.error) {
            throw new Error(exchangeData.error.message);
        }

        const accessToken = exchangeData.access_token;

        // Get Ad Account Info (Assuming user has one, take the first active one)
        const accountUrl = `https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,account_status&access_token=${accessToken}`;
        const accountRes = await fetch(accountUrl);
        const accountData = await accountRes.json();

        const account = accountData.data?.[0]; // Taking first account for MVP

        if (!account) {
            throw new Error("No Ad Accounts found for this user.");
        }

        return NextResponse.json({
            access_token: accessToken,
            ad_account_id: account.id,
            account_name: account.name,
            connected_at: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Meta Auth Error:", error);
        return NextResponse.json({ error: error.message || "Failed to authenticate" }, { status: 500 });
    }
}
