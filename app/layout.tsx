import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "100Ecom - Generador de Creativos IA",
    description: "Crea cientos de creativos de alto impacto para tu eCommerce en segundos con IA.",
    icons: {
        icon: "/logo_favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
