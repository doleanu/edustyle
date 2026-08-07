import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PoliticaPrivacidadBody } from "@/components/LegalPageBody";
import { legalContent, legalPath } from "@/lib/legal";
import { type Lang } from "@/lib/content";

const t = legalContent.fr.politicaPrivacidad;
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
    canonical: langPaths.fr,
    languages: { es: langPaths.es, en: langPaths.en, fr: langPaths.fr, de: langPaths.de },
  },
};

export default function PrivacyPolicyFr() {
  return (
    <>
      <Header lang="fr" minimal langPaths={langPaths} />
      <main className="pt-24 sm:pt-32">
        <PoliticaPrivacidadBody lang="fr" />
      </main>
      <Footer lang="fr" />
    </>
  );
}
