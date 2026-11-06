/** "A men's cut is {{p:cortes-1}}" → the live price of item `cortes-1` (pure: safe in client components). */
export function fillPriceTokens(text: string, prices: Record<string, string>): string {
  return text.replace(/\{\{p:([a-z0-9-]+)\}\}/g, (_m, id) => prices[id] ?? "—");
}
