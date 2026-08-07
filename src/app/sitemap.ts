import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { legalPath } from "@/lib/legal";
import { type Lang } from "@/lib/content";

const LANGS: Lang[] = ["es", "en", "fr", "de"];
const HOME_PRIORITY: Record<Lang, number> = { es: 1, en: 0.9, fr: 0.8, de: 0.8 };

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  const lastModified = new Date();

  const homes = LANGS.map((lang) => ({
    url: lang === "es" ? `${base}/` : `${base}/${lang}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: HOME_PRIORITY[lang],
  }));

  const legalPages = LANGS.flatMap((lang) => [
    {
      url: `${base}${legalPath("politica-privacidad", lang)}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${base}${legalPath("aviso-legal", lang)}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]);

  return [...homes, ...legalPages];
}
