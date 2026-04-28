import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SCOPES = [
    "ads_read",
    "read_insights",
    "business_management",
    "ads_management",
].join(",");

export async function GET(req: NextRequest) {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID!;

    // Derive redirect URI from the actual request host — works on localhost AND production
    const host = req.headers.get("host") || "localhost:3000";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const redirectUri = `${proto}://${host}/api/meta-ads/callback`;

    const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
    url.searchParams.set("client_id", appId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", SCOPES);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", "adstools_meta");

    return NextResponse.redirect(url.toString());
}
