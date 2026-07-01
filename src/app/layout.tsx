import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { business } from "@/lib/business";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Eduardo Style – Barbería en Tenerife | Cortes, Barba y Afeitado",
    template: "%s | Eduardo Style",
  },
  description:
    "Barbería Eduardo Style en Tenerife: cortes de pelo, arreglo de barba, afeitado clásico a navaja y diseños. Reserva por WhatsApp: +34 694 20 07 78.",
  keywords: [
    "barbería Tenerife",
    "barbero Tenerife",
    "corte de pelo Tenerife",
    "arreglo de barba",
    "afeitado a navaja",
    "degradados",
    "corte hombre",
    "corte niño",
    "Eduardo Style",
    "barber shop Tenerife",
  ],
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: business.siteUrl,
    siteName: business.name,
    title: "Eduardo Style – Barbería en Tenerife | Cortes, Barba y Afeitado",
    description: business.description,
    // og image auto-generated from src/app/opengraph-image.png
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduardo Style – Barbería en Tenerife",
    description: business.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons auto-generated from src/app/icon.png and src/app/apple-icon.png
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
