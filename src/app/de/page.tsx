import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "Eduardo Style – Barbershop in Los Abrigos, Teneriffa",
  description:
    "Barbershop in Los Abrigos, Süden von Teneriffa: Haarschnitt, Bartpflege, klassische Rasur mit dem Rasiermesser und Designs. Jetzt online buchen.",
  alternates: {
    canonical: "/de",
    languages: { es: "/", en: "/en", fr: "/fr", de: "/de" },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    title: "Eduardo Style – Barbershop in Los Abrigos, Teneriffa",
    description:
      "Haarschnitt, Bartpflege, klassische Rasur und Designs in Los Abrigos, Teneriffa. Online buchen.",
  },
};

export default function HomeDe() {
  return <SiteBody lang="de" />;
}
