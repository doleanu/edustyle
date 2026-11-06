import { validatePriceList, type PriceListConfig, type PriceListData } from "./model";

/* ---------------------------------------------------------------------------
   admin-kit · server side: storage interface + load/save with versioning.

   Source of truth, in order:
     1. the saved document (what the owner edits in the admin);
     2. until the first save, `seed()` — derived from the site's own code, so
        installing the kit never changes what the live site shows.
   Every save keeps the previous document as "<base>.prev.json" and refuses a
   save made from a stale page (version mismatch).
   --------------------------------------------------------------------------- */

export interface Storage {
  read(name: string): Promise<string | null>;
  write(name: string, value: string): Promise<void>;
}

export type SaveResult =
  | { ok: true; version: number }
  | { ok: false; error: "conflict" | "invalid" | "write"; message: string };

export function createPriceList(opts: {
  cfg: PriceListConfig;
  /** the fixed categories, in the order the site shows them */
  categoryIds: readonly string[];
  storage: Storage;
  seed: () => PriceListData | Promise<PriceListData>;
  /** true ONLY in the real production deployment (e.g. process.env.VERCEL_ENV === "production");
   *  local / preview builds use a separate "dev" document, so testing can never touch the live data */
  production: boolean;
  /** file name stem, default "pricelist" */
  fileBase?: string;
}) {
  const base = opts.fileBase ?? "pricelist";
  const FILE = opts.production ? `${base}.json` : `${base}.dev.json`;
  const PREV = opts.production ? `${base}.prev.json` : `${base}.dev.prev.json`;

  async function readRaw(): Promise<string | null> {
    try {
      return await opts.storage.read(FILE);
    } catch {
      return null;
    }
  }

  async function getData(): Promise<{ data: PriceListData; source: "saved" | "seed" }> {
    const raw = await readRaw();
    if (raw) {
      try {
        const v = validatePriceList(JSON.parse(raw), opts.categoryIds, opts.cfg);
        if (v.ok) return { data: v.data, source: "saved" };
        console.error("pricelist: saved document is invalid, using the seed:", v.error);
      } catch (e) {
        console.error("pricelist: saved document is not valid JSON, using the seed:", e);
      }
    }
    return { data: await opts.seed(), source: "seed" };
  }

  async function save(input: unknown, baseVersion: number): Promise<SaveResult> {
    const validated = validatePriceList(input, opts.categoryIds, opts.cfg);
    if (!validated.ok) return { ok: false, error: "invalid", message: validated.error };

    const raw = await readRaw();
    let currentVersion = 0;
    if (raw) {
      try {
        const cur = validatePriceList(JSON.parse(raw), opts.categoryIds, opts.cfg);
        if (cur.ok) currentVersion = cur.data.version;
      } catch {
        /* unreadable current file: version 0; the previous copy below still keeps it */
      }
    }
    if (baseVersion !== currentVersion) {
      return { ok: false, error: "conflict", message: "Los datos han cambiado desde que abriste esta página." };
    }

    const next: PriceListData = { ...validated.data, version: currentVersion + 1, updatedAt: new Date().toISOString() };
    try {
      if (raw) await opts.storage.write(PREV, raw);
      await opts.storage.write(FILE, JSON.stringify(next));
    } catch (e) {
      console.error("pricelist: write failed:", e);
      return { ok: false, error: "write", message: "No se pudo guardar. Inténtalo de nuevo." };
    }
    return { ok: true, version: next.version };
  }

  return { getData, save, categoryIds: opts.categoryIds, cfg: opts.cfg };
}

export type PriceListService = ReturnType<typeof createPriceList>;
