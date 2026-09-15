import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "Eduardo Style – Barbier à Los Abrigos, Tenerife",
  description:
    "Barbier à Los Abrigos, sud de Tenerife : coupes de cheveux, taille de barbe, rasage classique au coupe-chou et dessins. Réservez votre rendez-vous en ligne.",
  alternates: {
    canonical: "/fr",
    languages: { es: "/", en: "/en", fr: "/fr", de: "/de" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Eduardo Style – Barbier à Los Abrigos, Tenerife",
    description:
      "Coupes, taille de barbe, rasage classique et dessins à Los Abrigos, Tenerife. Réservez en ligne.",
  },
};

export default function HomeFr() {
  return <SiteBody lang="fr" />;
}
