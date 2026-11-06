/* Eduardo Style · admin-kit instance: config, categories, seed from content.ts, storage, auth. */
import { createPriceList, type Storage } from "./service";
import { redisStorage } from "./storage.redis";
import { getCookie } from "./handler";
import { seedPrice, type LText, type PriceListConfig, type PriceListData } from "./model";
import type { EditorConfig } from "@/components/admin/PriceListEditor";
import { content, type Lang } from "@/lib/content";
import { hasBookingBackend, kvConfig } from "@/lib/booking/config";
import { readSession, SESSION_COOKIE } from "@/lib/booking/session";

const LANGS: Lang[] = ["es", "en", "fr", "de"];
const suffix = { decimalSep: ",", symbol: "suffix" } as const;

export const cfg: PriceListConfig = {
  siteId: "edustyle",
  defaultLang: "es",
  langs: LANGS,
  langStyle: { es: suffix, en: suffix, fr: suffix, de: suffix },
  decimals: "auto", // "13 €", not "13,00 €"
  range: "unit-once", // "15–40 €"
  fromWord: { es: "desde", en: "from", fr: "dès", de: "ab" },
};

// Categories = the 3 price groups of the site (titles stay in content.ts, per language).
const GROUP_IDS = ["cortes", "corte-barba", "color-extras"];
const ES_GROUPS = content.es.prices.groups;
export const catId = (gi: number) => GROUP_IDS[gi] ?? `g${gi}`;

export const CATEGORIES = ES_GROUPS.map((g, gi) => ({ id: catId(gi), title: g.title, group: "servicios" }));

/** Items whose NAME other code depends on: the booking rules (src/lib/booking/serviceRules.ts) match the
 *  display name in all 4 languages, so renaming/removing it would silently break the 1-hour slot rule. */
export const LOCKED: Record<string, string> = {
  "corte-barba-5": "Su duración y sus horarios en la reserva dependen de este nombre. Puedes cambiar el precio y la descripción.",
};

type Group = { title: string; items: readonly { name: string; desc?: string; price: string; highlight?: boolean }[] };
const groupsOf = (l: Lang) => content[l].prices.groups as readonly Group[];

function seed(): PriceListData {
  return {
    version: 0,
    updatedAt: "",
    categories: ES_GROUPS.map((g, gi) => ({
      id: catId(gi),
      items: g.items.map((it, ii) => {
        const name: LText = {};
        const note: LText = {};
        const strings: Record<string, string> = {};
        for (const l of LANGS) {
          const x = groupsOf(l)[gi]?.items[ii];
          if (!x) continue;
          name[l] = x.name;
          if (x.desc) note[l] = x.desc;
          strings[l] = x.price;
        }
        const item: PriceListData["categories"][number]["items"][number] = {
          id: `${catId(gi)}-${ii}`,
          name,
          price: seedPrice(strings, cfg),
        };
        if (Object.keys(note).length) item.note = note;
        if ((it as { highlight?: boolean }).highlight) item.highlight = true;
        return item;
      }),
    })),
  };
}

// Same Upstash Redis the booking backend already uses (free tier), namespaced.
const kv = kvConfig();
const storage: Storage = kv
  ? redisStorage({ url: kv.url, token: kv.token, prefix: "edustyle:owner:pricelist" })
  : { read: async () => null, write: async () => { throw new Error("KV not configured"); } };

export const pl = createPriceList({
  cfg,
  categoryIds: CATEGORIES.map((c) => c.id),
  storage,
  seed,
  production: process.env.VERCEL_ENV === "production",
});

export const editorConfig: EditorConfig = {
  cfg,
  noun: { one: "servicio", many: "servicios" },
  langs: [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
  ],
  groups: [{ id: "servicios", label: "Servicios" }],
  categories: CATEGORIES,
  features: { note: true, highlight: true },
  locked: LOCKED,
  endpoint: "/api/admin/pricelist",
  priceHint: "13 · 12,50 · 15 – 40 · desde 15 · Consultar",
  accent: "#0f766e",
  viewHref: "/#precios",
};

// Reuses the signed owner session of the existing /admin (cookie es_session).
export const isAuthed = (req: Request) => hasBookingBackend() && readSession(getCookie(req, SESSION_COOKIE)) !== null;
export const REVALIDATE_PATHS = ["/", "/en", "/fr", "/de", "/admin/precios"];
