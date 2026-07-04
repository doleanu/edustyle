import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "Eduardo Style – Barbershop auf Teneriffa | Schnitt, Bart & Rasur",
  description:
    "Barbershop Eduardo Style auf Teneriffa: Haarschnitt, Bartpflege, klassische Rasur mit dem Rasiermesser und Designs. Buchung per WhatsApp: +34 694 20 07 78.",
  alternates: {
    canonical: "/de",
    languages: { es: "/", en: "/en", fr: "/fr", de: "/de" },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    title: "Eduardo Style – Barbershop auf Teneriffa",
    description:
      "Haarschnitt, Bartpflege, klassische Rasur und Designs auf Teneriffa. Buchung per WhatsApp.",
  },
};

export default function HomeDe() {
  return <SiteBody lang="de" />;
}
