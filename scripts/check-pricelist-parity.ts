/** The price groups rendered from the price-list model (seed) must equal content.ts for every language,
 *  and the FAQ price tokens must resolve to the original literal prices. Run: npx tsx scripts/check-pricelist-parity.ts */
import { content, type Lang } from "@/lib/content";
import { fillPriceTokens } from "@/lib/priceTokens";
import { validatePriceList } from "@/lib/pricelist/model";
import { CATEGORIES, cfg, pl } from "@/lib/pricelist/instance";
import { renderGroups, priceMap } from "@/lib/pricelist/render";

(async () => {
  const { data, source } = await pl.getData();
  const v = validatePriceList(JSON.parse(JSON.stringify(data)), CATEGORIES.map((c) => c.id), cfg);
  if (!v.ok) { console.log("SEED INVALID:", v.error); process.exit(1); }
  let bad = 0, n = 0, text = 0;
  for (const c of data.categories) for (const it of c.items) { n++; if (it.price.kind === "text") text++; }
  console.log(`source: ${source} | items: ${n} | text-only prices: ${text}`);
  for (const l of ["es", "en", "fr", "de"] as Lang[]) {
    const want = content[l].prices.groups.map((g) => ({ title: g.title, items: g.items.map((i) => ({ name: i.name, desc: i.desc || "", price: i.price, highlight: Boolean((i as { highlight?: boolean }).highlight) })) }));
    const got = renderGroups(data, l).map((g) => ({ title: g.title, items: g.items.map((i) => ({ name: i.name, desc: i.desc || "", price: i.price, highlight: Boolean(i.highlight) })) }));
    const same = JSON.stringify(want) === JSON.stringify(got);
    if (!same) bad++;
    console.log(l, same ? "IDENTICAL" : "DIFFERENT", `(${want.reduce((m, g) => m + g.items.length, 0)} services)`);
    const q = content[l].faq.items.find((f) => /\{\{p:/.test(f.answer))!;
    const filled = fillPriceTokens(q.answer, priceMap(data, l));
    const okFaq = ["13 €", "20 €", "10 €"].every((p) => filled.includes(p)) && !filled.includes("{{");
    if (!okFaq) bad++;
    console.log("   FAQ prices", okFaq ? "OK" : "WRONG", "→", filled.slice(0, 80));
  }
  process.exit(bad ? 1 : 0);
})();
