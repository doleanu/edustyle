import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
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

  // Legal pages are noindex (see their page metadata), so keep them out of the sitemap.
  return homes;
}
