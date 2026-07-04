import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "Eduardo Style – Barbier à Tenerife | Coupes, Barbe et Rasage",
  description:
    "Barbier Eduardo Style à Tenerife : coupes de cheveux, taille de barbe, rasage classique au coupe-chou et dessins. Réservez sur WhatsApp : +34 694 20 07 78.",
  alternates: {
    canonical: "/fr",
    languages: { es: "/", en: "/en", fr: "/fr", de: "/de" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Eduardo Style – Barbier à Tenerife",
    description:
      "Coupes, taille de barbe, rasage classique et dessins à Tenerife. Réservez sur WhatsApp.",
  },
};

export default function HomeFr() {
  return <SiteBody lang="fr" />;
}
