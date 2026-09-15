import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "Eduardo Style – Barbershop in Los Abrigos, Tenerife",
  description:
    "Barbershop in Los Abrigos, south Tenerife: haircuts, beard trims, classic straight-razor shave and designs. Book your appointment online.",
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en", fr: "/fr", de: "/de" },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Eduardo Style – Barbershop in Los Abrigos, Tenerife",
    description:
      "Haircuts, beard trims, classic shave and designs in Los Abrigos, Tenerife. Book online.",
  },
};

export default function HomeEn() {
  return <SiteBody lang="en" />;
}
