import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return NextResponse.redirect(
            new URL("/dashboard/meta-ads?error=auth_denied", req.url)
        );
    }

    const appId = process.env.NEXT_PUBLIC_META_APP_ID!;
    const appSecret = process.env.META_APP_SECRET!;

    // Must exactly match the redirect URI sent by the auth route
    const host = req.headers.get("host") || "localhost:3000";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const redirectUri = `${proto}://${host}/api/meta-ads/callback`;

    try {
        // 1. Exchange code for short-lived token
        const tokenRes = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token?` +
            new URLSearchParams({ client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code })
        );
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            throw new Error(tokenData.error?.message || "Token exchange failed");
        }

        // 2. Exchange for long-lived token (60-day)
        const longRes = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token?` +
            new URLSearchParams({
                grant_type: "fb_exchange_token",
                client_id: appId,
                client_secret: appSecret,
                fb_exchange_token: tokenData.access_token,
            })
        );
        const longData = await longRes.json();
        const accessToken = longData.access_token || tokenData.access_token;

        // 3. Fetch ad accounts
        const accountsRes = await fetch(
            `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`
        );
        const accountsData = await accountsRes.json();
        const adAccountId = accountsData.data?.[0]?.id || "";

        // 4. Store in httpOnly cookies
        const response = NextResponse.redirect(
            new URL("/dashboard/meta-ads", req.url)
        );
        const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            path: "/",
            maxAge: 60 * 60 * 24 * 55, // 55 days
        };
        response.cookies.set("meta_access_token", accessToken, cookieOpts);
        response.cookies.set("meta_ad_account_id", adAccountId, cookieOpts);

        return response;
    } catch (err: any) {
        console.error("[meta-ads/callback]", err);
        return NextResponse.redirect(
            new URL(`/dashboard/meta-ads?error=${encodeURIComponent(err.message)}`, req.url)
        );
    }
}
