import type { Metadata } from "next";
import { SiteBody } from "@/components/SiteBody";

export const metadata: Metadata = {
  title: "EduStyle – Barbershop in Tenerife | Cuts, Beard & Shave",
  description:
    "EduStyle barbershop in Tenerife: haircuts, beard trims, classic straight-razor shave and designs. Book on WhatsApp: +34 694 20 07 78.",
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "EduStyle – Barbershop in Tenerife",
    description:
      "Haircuts, beard trims, classic shave and designs in Tenerife. Book on WhatsApp.",
  },
};

export default function HomeEn() {
  return <SiteBody lang="en" />;
}
