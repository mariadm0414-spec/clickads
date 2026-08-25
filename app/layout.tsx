import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
    themeColor: "#030303",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://www.cienads.com"),
    title: "100Ecom - Generador de Creativos IA",
    description: "Crea cientos de creativos de alto impacto para tu eCommerce en segundos con IA. Optimiza tus campañas de Meta y TikTok Ads.",
    keywords: ["Creativos IA", "Ecommerce", "Meta Ads", "TikTok Ads", "Generador de Anuncios"],
    authors: [{ name: "AdsTools" }],
    openGraph: {
        title: "100Ecom - Generador de Creativos IA",
        description: "Crea cientos de creativos de alto impacto para tu eCommerce en segundos con IA.",
        url: "https://www.cienads.com",
        siteName: "100Ecom",
        images: [
            {
                url: "/logo_favicon.png",
                width: 512,
                height: 512,
                alt: "100Ecom Logo",
            },
        ],
        locale: "es_ES",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "100Ecom - Generador de Creativos IA",
        description: "Crea cientos de creativos de alto impacto para tu eCommerce en segundos con IA.",
        images: ["/logo_favicon.png"],
    },
    icons: {
        icon: "/logo_favicon.png",
        apple: "/logo_favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={inter.className}>
            <body style={{ backgroundColor: "#030303", color: "#fff" }}>{children}</body>
        </html>
    );
}
