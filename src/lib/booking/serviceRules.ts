// Per-service overrides for booking duration and allowed start times.
// The booking form has no language-independent service id — it just sends
// whatever display string the client picked from the prices list — so a
// rule is matched by name and must list every language's translation of
// that service (see src/lib/content.ts `prices.groups`).
//
// Currently only "Pack completo" (the longest service — corte + barba +
// cera + lavado + limpieza facial + masaje) needs this: Edu only wants to
// fit it in at the very end of the day, and it needs a full hour instead of
// the normal slot length.
export type ServiceRule = {
  durationMinutes: number;
  // "HH:mm" wall-clock times, in BOOKING_TZ. Offered as-is (not fit to the
  // regular slot grid) on any day whose hours reach into the evening.
  allowedStartTimes: string[];
};

const PACK_COMPLETO_NAMES = [
  "Pack completo", // es
  "Full package", // en
  "Formule complète", // fr
  "Komplettpaket", // de
];

const PACK_COMPLETO_RULE: ServiceRule = {
  durationMinutes: 60,
  allowedStartTimes: ["18:00", "18:30"],
};

const RULES: Record<string, ServiceRule> = Object.fromEntries(
  PACK_COMPLETO_NAMES.map((name) => [name, PACK_COMPLETO_RULE])
);

export function getServiceRule(service: string): ServiceRule | undefined {
  return RULES[service.trim()];
}
