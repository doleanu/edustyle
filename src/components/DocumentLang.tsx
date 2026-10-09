"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/content";

// The root layout is shared by every locale, so its <html lang> is always
// "es" — wrong for /en, /fr and /de (screen readers pronounce the page in the
// wrong language and Chrome offers to "translate from Spanish" an English
// page). Splitting into one root layout per locale would force a route-group
// restructure; this corrects the attribute right after hydration instead.
export function DocumentLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
