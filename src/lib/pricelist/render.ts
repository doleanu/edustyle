import { content, type Lang } from "@/lib/content";
import { formatPrice, pick, type PriceListData } from "./model";
import { cfg, catId, pl } from "./instance";

export type PriceGroup = { title: string; items: { name: string; desc?: string; price: string; highlight?: boolean }[] };

/** The price groups as the public page renders them: titles from content.ts, items from the price list. */
export function renderGroups(data: PriceListData, lang: Lang): PriceGroup[] {
  const byId = new Map(data.categories.map((c) => [c.id, c]));
  return content[lang].prices.groups
    .map((g, gi) => ({
      title: g.title,
      items: (byId.get(catId(gi))?.items ?? [])
        .filter((it) => !it.hidden)
        .map((it) => ({
          name: pick(it.name, lang, cfg),
          ...(it.note ? { desc: pick(it.note, lang, cfg) } : {}),
          price: formatPrice(it.price, lang, cfg),
          ...(it.highlight ? { highlight: true } : {}),
        })),
    }))
    .filter((g) => g.items.length > 0);
}

/** id → formatted price, for the {{p:id}} tokens used inside FAQ answers. */
export function priceMap(data: PriceListData, lang: Lang): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of data.categories) for (const it of c.items) if (!it.hidden) out[it.id] = formatPrice(it.price, lang, cfg);
  return out;
}

export async function getLivePrices(lang: Lang) {
  const { data } = await pl.getData();
  return { groups: renderGroups(data, lang), prices: priceMap(data, lang) };
}
