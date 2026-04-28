import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Base prices in USD
const BASE_PRICE_USD = 49;
const ORIGINAL_PRICE_USD = 97;

// Countries that use USD natively → show USD directly
const USD_COUNTRIES = ["US", "EC", "PA", "SV", "GT", "HN", "PR", "DO"];

// Format number with locale-appropriate thousands separator
function fmt(n: number, decimals = 0): string {
    return n.toLocaleString("es-ES", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

// Country → currency override map for LATAM (so we don't rely on the geo API's currency field)
const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string; flag: string }> = {
    CO: { code: "COP", symbol: "$", flag: "🇨🇴" },
    MX: { code: "MXN", symbol: "$", flag: "🇲🇽" },
    AR: { code: "ARS", symbol: "$", flag: "🇦🇷" },
    CL: { code: "CLP", symbol: "$", flag: "🇨🇱" },
    PE: { code: "PEN", symbol: "S/", flag: "🇵🇪" },
    VE: { code: "USD", symbol: "$", flag: "🇻🇪" }, // Venezuela uses USD in practice
    BO: { code: "BOB", symbol: "Bs.", flag: "🇧🇴" },
    PY: { code: "PYG", symbol: "₲", flag: "🇵🇾" },
    UY: { code: "UYU", symbol: "$U", flag: "🇺🇾" },
    CR: { code: "CRC", symbol: "₡", flag: "🇨🇷" },
    NI: { code: "NIO", symbol: "C$", flag: "🇳🇮" },
    US: { code: "USD", symbol: "$", flag: "🇺🇸" },
    EC: { code: "USD", symbol: "$", flag: "🇪🇨" },
    PA: { code: "USD", symbol: "$", flag: "🇵🇦" },
    ES: { code: "EUR", symbol: "€", flag: "🇪🇸" },
    // Default for everything else → USD
};

export async function GET(req: NextRequest) {
    try {
        // 1. Detect country from IP
        // Vercel / Cloud hosts set CF-IPCountry or X-Vercel-IP-Country
        const country =
            req.headers.get("cf-ipcountry") ||
            req.headers.get("x-vercel-ip-country") ||
            req.headers.get("x-country-code");

        // If no header available, fall back to ipapi.co (free, 1000 req/day)
        let countryCode = country?.toUpperCase() || "US";

        if (!country) {
            try {
                const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
                if (ip && ip !== "::1" && ip !== "127.0.0.1") {
                    const geo = await fetch(`https://ipapi.co/${ip}/json/`, {
                        headers: { "User-Agent": "ADSTools/1.0" },
                        signal: AbortSignal.timeout(3000),
                    });
                    if (geo.ok) {
                        const geoData = await geo.json();
                        countryCode = (geoData.country_code || "US").toUpperCase();
                    }
                }
            } catch {
                // silently fallback to USD
            }
        }

        const currencyInfo = COUNTRY_CURRENCY[countryCode] || { code: "USD", symbol: "$", flag: "🌎" };

        // 2. If USD, return directly without conversion
        if (currencyInfo.code === "USD") {
            return NextResponse.json({
                countryCode,
                currency: "USD",
                symbol: "$",
                flag: currencyInfo.flag,
                price: BASE_PRICE_USD,
                originalPrice: ORIGINAL_PRICE_USD,
                priceFormatted: `$${BASE_PRICE_USD}`,
                originalFormatted: `$${ORIGINAL_PRICE_USD}`,
                isUSD: true,
            });
        }

        // 3. Fetch exchange rate from Frankfurter (free, no key)
        const ratesRes = await fetch(
            `https://api.frankfurter.app/latest?from=USD&to=${currencyInfo.code}`,
            { signal: AbortSignal.timeout(5000) }
        );

        if (!ratesRes.ok) throw new Error("Exchange rate unavailable");

        const ratesData = await ratesRes.json();
        const rate: number = ratesData.rates[currencyInfo.code];

        if (!rate) throw new Error(`No rate for ${currencyInfo.code}`);

        // Round to clean numbers
        const price = Math.ceil(BASE_PRICE_USD * rate);
        const originalPrice = Math.ceil(ORIGINAL_PRICE_USD * rate);

        // Format nicely: large currencies (COP, CLP, PYG) show no decimals
        const decimals = price > 5000 ? 0 : 2;
        const priceFormatted = `${currencyInfo.symbol}${fmt(price, decimals)}`;
        const originalFormatted = `${currencyInfo.symbol}${fmt(originalPrice, decimals)}`;

        return NextResponse.json({
            countryCode,
            currency: currencyInfo.code,
            symbol: currencyInfo.symbol,
            flag: currencyInfo.flag,
            price,
            originalPrice,
            priceFormatted,
            originalFormatted,
            isUSD: false,
            rate,
        });
    } catch (error: any) {
        // Fallback to USD
        return NextResponse.json({
            countryCode: "US",
            currency: "USD",
            symbol: "$",
            flag: "🌎",
            price: BASE_PRICE_USD,
            originalPrice: ORIGINAL_PRICE_USD,
            priceFormatted: `$${BASE_PRICE_USD}`,
            originalFormatted: `$${ORIGINAL_PRICE_USD}`,
            isUSD: true,
        });
    }
}
