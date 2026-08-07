import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvisoLegalBody } from "@/components/LegalPageBody";
import { legalContent, legalPath } from "@/lib/legal";
import { type Lang } from "@/lib/content";

const t = legalContent.es.avisoLegal;
const langPaths: Record<Lang, string> = {
  es: legalPath("aviso-legal", "es"),
  en: legalPath("aviso-legal", "en"),
  fr: legalPath("aviso-legal", "fr"),
  de: legalPath("aviso-legal", "de"),
};

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical: langPaths.es,
    languages: { es: langPaths.es, en: langPaths.en, fr: langPaths.fr, de: langPaths.de },
  },
};

export default function LegalNotice() {
  return (
    <>
      <Header lang="es" minimal langPaths={langPaths} />
      <main className="pt-24 sm:pt-32">
        <AvisoLegalBody lang="es" />
      </main>
      <Footer lang="es" />
    </>
  );
}
