import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PoliticaPrivacidadBody } from "@/components/LegalPageBody";
import { legalContent, legalPath } from "@/lib/legal";
import { type Lang } from "@/lib/content";

const t = legalContent.de.politicaPrivacidad;
const langPaths: Record<Lang, string> = {
  es: legalPath("politica-privacidad", "es"),
  en: legalPath("politica-privacidad", "en"),
  fr: legalPath("politica-privacidad", "fr"),
  de: legalPath("politica-privacidad", "de"),
};

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical: langPaths.de,
    languages: { es: langPaths.es, en: langPaths.en, fr: langPaths.fr, de: langPaths.de },
  },
};

export default function PrivacyPolicyDe() {
  return (
    <>
      <Header lang="de" minimal langPaths={langPaths} />
      <main className="pt-24 sm:pt-32">
        <PoliticaPrivacidadBody lang="de" />
      </main>
      <Footer lang="de" />
    </>
  );
}
