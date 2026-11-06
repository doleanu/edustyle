/* ---------------------------------------------------------------------------
   admin-kit · price-list model.  PURE (no imports): safe for server AND client.

   One document = the whole price list / menu of a client site. Categories are
   fixed (they live in the site's code: titles, order, photos); what the owner
   edits are the ITEMS inside them (dishes, services…).
   --------------------------------------------------------------------------- */

/** lang → text. The config's `defaultLang` entry is required, the others fall back to it. */
export type LText = Record<string, string>;

export type Price =
  | {
      kind: "amount";
      amounts: number[];
      /** between amounts when there are several and no labels ("8 / 9", "15–40") */
      sep: "/" | "–" | null;
      /** "desde 15 €" */
      from?: boolean;
      /** one label per amount ("Copa" / "Botella"); translated via config.labels */
      labels?: string[];
    }
  | { kind: "text"; text: LText };

export type Item = {
  id: string;
  name: LText;
  note?: LText;
  price: Price;
  hidden?: boolean;
  /** visual emphasis ("el más pedido"); only used when the site opts in */
  highlight?: boolean;
};

export type CategoryData = { id: string; items: Item[] };

export type PriceListData = {
  /** bumped on every save; a save made from a stale page is refused */
  version: number;
  updatedAt: string;
  categories: CategoryData[];
};

export type LangStyle = { decimalSep: "," | "."; symbol: "prefix" | "suffix" };

export type PriceListConfig = {
  /** storage/cookie namespace, e.g. "ladulce" */
  siteId: string;
  defaultLang: string;
  langs: readonly string[];
  langStyle: Record<string, LangStyle>;
  /** "fixed2": 8,00 €   ·   "auto": 13 € (whole numbers without decimals) */
  decimals: "fixed2" | "auto";
  /** "unit-each": 3,00 € – 3,50 €   ·   "unit-once": 15–40 € */
  range: "unit-each" | "unit-once";
  /** word for `from` prices per language: { es: "desde", en: "from" … } */
  fromWord: Record<string, string>;
  /** label translations: { Copa: { en: "Glass" } } — unknown labels stay as typed */
  labels?: Record<string, LText>;
};

export const LIMITS = {
  name: 120,
  note: 300,
  priceText: 40,
  label: 24,
  maxAmounts: 4,
  maxAmount: 99999,
  itemsPerCategory: 200,
} as const;

/* ------------------------------ text helpers ----------------------------- */

export function pick(t: LText | undefined, lang: string, cfg: Pick<PriceListConfig, "defaultLang">): string {
  if (!t) return "";
  return (t[lang] && t[lang].trim()) || t[cfg.defaultLang] || "";
}

/* ------------------------------- formatting ------------------------------ */

function num(n: number, lang: string, cfg: PriceListConfig): string {
  const style = cfg.langStyle[lang] ?? cfg.langStyle[cfg.defaultLang];
  const body = cfg.decimals === "auto" && Number.isInteger(n) ? String(n) : n.toFixed(2);
  return style.decimalSep === "," ? body.replace(".", ",") : body;
}

function withSymbol(n: number, lang: string, cfg: PriceListConfig): string {
  const style = cfg.langStyle[lang] ?? cfg.langStyle[cfg.defaultLang];
  const body = num(n, lang, cfg);
  return style.symbol === "prefix" ? `€${body}` : `${body} €`;
}

export function formatPrice(p: Price, lang: string, cfg: PriceListConfig): string {
  if (p.kind === "text") return pick(p.text, lang, cfg);
  const style = cfg.langStyle[lang] ?? cfg.langStyle[cfg.defaultLang];
  let out: string;
  if (p.labels && p.labels.length === p.amounts.length) {
    out = p.amounts
      .map((a, i) => {
        const l = p.labels![i];
        const tl = (cfg.labels?.[l] && pick(cfg.labels[l], lang, cfg)) || l;
        return `${tl} ${withSymbol(a, lang, cfg)}`;
      })
      .join(" · ");
  } else if (p.amounts.length === 1) {
    out = withSymbol(p.amounts[0], lang, cfg);
  } else if (cfg.range === "unit-once") {
    const glue = p.sep === "–" ? "–" : " / ";
    const body = p.amounts.map((a) => num(a, lang, cfg)).join(glue);
    out = style.symbol === "prefix" ? `€${body}` : `${body} €`;
  } else {
    const glue = p.sep === "–" ? " – " : " / ";
    out = p.amounts.map((a) => withSymbol(a, lang, cfg)).join(glue);
  }
  if (p.from) {
    const w = cfg.fromWord[lang] ?? cfg.fromWord[cfg.defaultLang];
    if (w) out = `${w} ${out}`;
  }
  return out;
}

/* --------------------------- editor text <-> Price ----------------------- */

const NUM = String.raw`\d{1,5}(?:[.,]\d{1,2})?`;
const CUR = String.raw`(?:€|eur|euros?)?`;
const FROM_WORDS = ["desde", "from", "ab", "dès", "des", "à partir de", "a partir de"];

const toNumber = (s: string) => Number(s.replace(",", "."));
const NUMERIC_LIST = new RegExp(String.raw`^\s*${NUM}(?:\s*[/–-]\s*${NUM})*\s*${CUR}\s*$`, "i");
const LABELED_SEG = new RegExp(String.raw`^\s*([^\d€]{1,${LIMITS.label}}?)\s+(${NUM})\s*${CUR}\s*$`, "i");

/** "8,90" · "3 – 3,5" · "desde 15" · "Copa 4 · Botella 11,50" · "Consultar"  →  Price, or null if empty/invalid. */
export function parsePriceInput(raw: string, cfg: PriceListConfig): Price | null {
  let s = raw.trim();
  if (!s) return null;

  let from = false;
  const fromRe = new RegExp(String.raw`^(?:${[...FROM_WORDS, ...Object.values(cfg.fromWord)].map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\s*:?\s+(?=\d)`, "i");
  const fm = s.match(fromRe);
  if (fm) {
    from = true;
    s = s.slice(fm[0].length).trim();
  }

  // 1) labeled amounts: "Copa 4 · Botella 11,50"
  const segs = s.split(/\s*[·|;]\s*/).filter(Boolean);
  const labeled = segs.map((g) => g.match(LABELED_SEG));
  if (!from && segs.length >= 1 && labeled.every(Boolean) && segs.length <= LIMITS.maxAmounts) {
    const labels = labeled.map((m) => m![1].trim());
    if (labels.every((l) => l.length > 0 && !/\d/.test(l))) {
      const amounts = labeled.map((m) => toNumber(m![2]));
      if (amounts.every((n) => Number.isFinite(n) && n >= 0 && n <= LIMITS.maxAmount)) {
        return { kind: "amount", amounts, sep: null, labels };
      }
    }
  }

  // 2) plain amount(s)
  if (NUMERIC_LIST.test(s)) {
    const amounts = [...s.matchAll(new RegExp(NUM, "g"))].map((m) => toNumber(m[0]));
    if (amounts.length === 0 || amounts.length > LIMITS.maxAmounts) return null;
    if (amounts.some((n) => !Number.isFinite(n) || n < 0 || n > LIMITS.maxAmount)) return null;
    const sepChar = s.match(/[/–-]/)?.[0];
    const sep = amounts.length > 1 ? (sepChar === "/" ? "/" : "–") : null;
    const out: Price = { kind: "amount", amounts, sep };
    if (from) out.from = true;
    return out;
  }
  if (from) return null; // "desde" followed by something that is not a number

  // 3) free text ("Consultar"); must not look like a malformed number
  if (/\d/.test(s) && !/[a-zA-ZÀ-ÿ]/.test(s)) return null;
  if (s.length > LIMITS.priceText) return null;
  return { kind: "text", text: { [cfg.defaultLang]: s } };
}

/** Editor text for a stored price (always comma decimals, default-language words). */
export function priceToInput(p: Price, cfg: PriceListConfig): string {
  if (p.kind === "text") return p.text[cfg.defaultLang] ?? "";
  const f = (n: number) => (Number.isInteger(n) && cfg.decimals === "auto" ? String(n) : n.toFixed(2).replace(".", ","));
  let body: string;
  if (p.labels && p.labels.length === p.amounts.length) {
    body = p.amounts.map((a, i) => `${p.labels![i]} ${f(a)}`).join(" · ");
  } else {
    body = p.amounts.map(f).join(p.sep === "–" ? " – " : " / ");
  }
  if (p.from) body = `${cfg.fromWord[cfg.defaultLang] ?? "desde"} ${body}`;
  return body;
}

/** schema.org Offer price: only when the item has exactly one clean amount. */
export function singleAmount(p: Price): number | undefined {
  return p.kind === "amount" && p.amounts.length === 1 && !p.from ? p.amounts[0] : undefined;
}

/* -------------------------------- validation ----------------------------- */

export type ValidationResult = { ok: true; data: PriceListData } | { ok: false; error: string };

const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

function cleanText(v: unknown, max: number, label: string): string | undefined | Error {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string") return new Error(`${label}: texto no válido`);
  const t = v.replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (t.length > max) return new Error(`${label}: máximo ${max} caracteres`);
  return t;
}

function cleanLText(v: unknown, max: number, required: boolean, label: string, cfg: PriceListConfig): LText | undefined | Error {
  if (v === undefined || v === null) return required ? new Error(`${label}: obligatorio`) : undefined;
  if (typeof v !== "object" || Array.isArray(v)) return new Error(`${label}: formato no válido`);
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!cfg.langs.includes(k)) return new Error(`${label}: idioma desconocido (${k})`);
  const out: LText = {};
  for (const l of cfg.langs) {
    const t = cleanText(o[l], max, `${label} (${l.toUpperCase()})`);
    if (t instanceof Error) return t;
    if (t) out[l] = t;
  }
  if (!out[cfg.defaultLang]) return required ? new Error(`${label}: obligatorio`) : undefined;
  return out;
}

/**
 * Validates and normalises a whole document. `categoryIds` are the fixed categories from the
 * site's code: all must be present, none may be invented. version/updatedAt are stamped by the server.
 */
export function validatePriceList(input: unknown, categoryIds: readonly string[], cfg: PriceListConfig): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Datos no válidos" };
  const raw = input as Record<string, unknown>;
  if (!Array.isArray(raw.categories)) return { ok: false, error: "Faltan las categorías" };

  const seenCats = new Set<string>();
  const seenIds = new Set<string>();
  const categories: CategoryData[] = [];

  for (const c of raw.categories) {
    if (!c || typeof c !== "object") return { ok: false, error: "Categoría no válida" };
    const cat = c as Record<string, unknown>;
    const catId = cat.id;
    if (typeof catId !== "string" || !categoryIds.includes(catId)) return { ok: false, error: `Categoría desconocida: ${String(catId)}` };
    if (seenCats.has(catId)) return { ok: false, error: `Categoría repetida: ${catId}` };
    seenCats.add(catId);
    if (!Array.isArray(cat.items)) return { ok: false, error: `Categoría ${catId}: faltan los elementos` };
    if (cat.items.length > LIMITS.itemsPerCategory) return { ok: false, error: `Categoría ${catId}: demasiados elementos` };

    const items: Item[] = [];
    for (const d of cat.items) {
      if (!d || typeof d !== "object") return { ok: false, error: `Categoría ${catId}: elemento no válido` };
      const it = d as Record<string, unknown>;
      if (typeof it.id !== "string" || !ID_RE.test(it.id)) return { ok: false, error: "Identificador no válido" };
      if (seenIds.has(it.id)) return { ok: false, error: `Elemento repetido: ${it.id}` };
      seenIds.add(it.id);

      const name = cleanLText(it.name, LIMITS.name, true, "Nombre", cfg);
      if (name instanceof Error) return { ok: false, error: name.message };
      if (!name) return { ok: false, error: "Nombre: obligatorio" };
      const label = name[cfg.defaultLang];
      const note = cleanLText(it.note, LIMITS.note, false, `Descripción de «${label}»`, cfg);
      if (note instanceof Error) return { ok: false, error: note.message };

      const p = it.price as Record<string, unknown> | undefined;
      let price: Price;
      if (p && p.kind === "amount") {
        const amounts = p.amounts;
        if (!Array.isArray(amounts) || amounts.length < 1 || amounts.length > LIMITS.maxAmounts) return { ok: false, error: `Precio de «${label}» no válido` };
        for (const a of amounts) {
          if (typeof a !== "number" || !Number.isFinite(a) || a < 0 || a > LIMITS.maxAmount) return { ok: false, error: `Precio de «${label}» no válido` };
        }
        let labels: string[] | undefined;
        if (p.labels !== undefined) {
          if (!Array.isArray(p.labels) || p.labels.length !== amounts.length) return { ok: false, error: `Precio de «${label}»: etiquetas no válidas` };
          labels = [];
          for (const l of p.labels) {
            if (typeof l !== "string" || !l.trim() || l.trim().length > LIMITS.label) return { ok: false, error: `Precio de «${label}»: etiqueta no válida` };
            labels.push(l.trim());
          }
        }
        const sep = !labels && amounts.length > 1 ? (p.sep === "–" ? "–" : "/") : null;
        price = { kind: "amount", amounts: (amounts as number[]).map((a) => Math.round(a * 100) / 100), sep };
        if (labels) price.labels = labels;
        if (p.from === true && !labels) price.from = true;
      } else if (p && p.kind === "text") {
        const t = cleanLText(p.text, LIMITS.priceText, true, `Precio de «${label}»`, cfg);
        if (t instanceof Error) return { ok: false, error: t.message };
        if (!t) return { ok: false, error: `Precio de «${label}»: obligatorio` };
        price = { kind: "text", text: t };
      } else {
        return { ok: false, error: `Precio de «${label}»: obligatorio` };
      }

      const out: Item = { id: it.id, name, price };
      if (note) out.note = note;
      if (it.hidden === true) out.hidden = true;
      if (it.highlight === true) out.highlight = true;
      items.push(out);
    }
    categories.push({ id: catId, items });
  }
  for (const id of categoryIds) if (!seenCats.has(id)) return { ok: false, error: `Falta la categoría ${id}` };

  const version = typeof raw.version === "number" && Number.isFinite(raw.version) ? raw.version : 0;
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : "";
  return { ok: true, data: { version, updatedAt, categories } };
}

/* ---------------------- seeding from the site's code --------------------- */

/**
 * Builds a Price from the per-language strings a site already has hard-coded ("34,50 €" / "€34.50").
 * The numeric price is only used when it re-renders to EXACTLY the original string in every
 * language; otherwise the strings are kept as text, so the seed can never change what the site shows.
 */
export function seedPrice(strings: Record<string, string>, cfg: PriceListConfig): Price {
  const textPrice = (): Price => ({ kind: "text", text: { ...strings } });
  const base = strings[cfg.defaultLang];
  if (!base) return textPrice();
  const parsed = parsePriceInput(base, cfg);
  if (!parsed || parsed.kind !== "amount") return textPrice();
  for (const l of cfg.langs) {
    if (strings[l] === undefined) continue;
    if (formatPrice(parsed, l, cfg) !== strings[l]) return textPrice();
  }
  return parsed;
}
