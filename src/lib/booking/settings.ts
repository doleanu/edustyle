import { DateTime } from "luxon";
import { BOOKING_TZ } from "./config";
import { business } from "@/lib/business";
import type { ServiceRule } from "./serviceRules";

// Owner-configurable scheduling settings. Weekday uses Luxon numbering:
// 1 = Monday … 7 = Sunday. Each day can have MULTIPLE time ranges so split
// shifts work (e.g. 10:00–12:00 + 14:00–19:00 with a midday break).
export type TimeRange = { open: string; close: string };
export type DayConfig = { enabled: boolean; ranges: TimeRange[] };

// A closed date range for holidays/vacation — inclusive on both ends, ISO
// "YYYY-MM-DD" so plain string comparison sorts/matches chronologically.
// `label` is just a note for the owner ("Vacaciones") — never shown to clients.
export type ClosedRange = { start: string; end: string; label?: string };

export type Settings = {
  slotMinutes: number;
  weeklyHours: Record<number, DayConfig>;
  closedRanges: ClosedRange[];
};

// Spanish day names in business.hours -> Luxon weekday numbers.
const DAY_TO_WEEKDAY: Record<string, number> = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
  Domingo: 7,
};

// Sensible defaults seeded from the marketing hours already on the site, so the
// first time the owner opens /admin the form is pre-filled with his real hours.
export const DEFAULT_SETTINGS: Settings = {
  slotMinutes: 40,
  weeklyHours: (() => {
    const wh: Record<number, DayConfig> = {};
    for (let d = 1; d <= 7; d++) {
      wh[d] = { enabled: false, ranges: [{ open: "10:00", close: "19:00" }] };
    }
    for (const h of business.hours) {
      const wd = DAY_TO_WEEKDAY[h.day];
      if (!wd) continue;
      wh[wd] = h.ranges.length
        ? { enabled: true, ranges: h.ranges.map((r) => ({ ...r })) }
        : { enabled: false, ranges: [{ open: "10:00", close: "19:00" }] };
    }
    return wh;
  })(),
  closedRanges: [],
};

// Accepts either the old single-range shape ({ enabled, open, close }) or the
// new multi-range shape ({ enabled, ranges }) and always returns the new shape.
// This migrates any settings saved before split shifts existed, transparently.
export function normalizeSettings(raw: unknown): Settings {
  const obj = (raw && typeof raw === "object" ? raw : {}) as {
    slotMinutes?: number;
    weeklyHours?: Record<
      string,
      {
        enabled?: boolean;
        open?: string;
        close?: string;
        ranges?: { open?: string; close?: string }[];
      }
    >;
    closedRanges?: { start?: string; end?: string; label?: string }[];
  };
  const slotMinutes =
    typeof obj.slotMinutes === "number" ? obj.slotMinutes : DEFAULT_SETTINGS.slotMinutes;

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const closedRanges: ClosedRange[] = Array.isArray(obj.closedRanges)
    ? obj.closedRanges
        .filter(
          (r) =>
            r &&
            typeof r.start === "string" &&
            typeof r.end === "string" &&
            isoDate.test(r.start) &&
            isoDate.test(r.end) &&
            r.end >= r.start
        )
        .map((r) => ({
          start: r.start as string,
          end: r.end as string,
          ...(r.label?.trim() ? { label: r.label.trim().slice(0, 60) } : {}),
        }))
    : [];

  const wh: Record<number, DayConfig> = {};
  for (let d = 1; d <= 7; d++) {
    const src = obj.weeklyHours?.[d];
    let ranges: TimeRange[] = [];
    if (src) {
      if (Array.isArray(src.ranges)) {
        ranges = src.ranges
          .filter((r) => r && r.open && r.close)
          .map((r) => ({ open: r.open as string, close: r.close as string }));
      } else if (src.open && src.close) {
        ranges = [{ open: src.open, close: src.close }];
      }
    }
    if (ranges.length === 0) ranges = [{ open: "10:00", close: "19:00" }];
    wh[d] = { enabled: Boolean(src?.enabled), ranges };
  }
  return { slotMinutes, weeklyHours: wh, closedRanges };
}

// Is this ISO date inside one of the owner's closed (vacation/holiday) ranges?
// Returns the matching range (so callers can surface its label) or undefined.
export function isDateClosed(dateISO: string, settings: Settings): ClosedRange | undefined {
  return settings.closedRanges?.find((r) => dateISO >= r.start && dateISO <= r.end);
}

export type Slot = string; // "HH:mm" wall-clock in BOOKING_TZ

// Pure generator: candidate wall-clock slots for an ISO date (YYYY-MM-DD),
// across ALL of the day's ranges. No calendar filtering happens here.
//
// When `rule` is given, the day's normal slot grid is ignored entirely —
// instead the rule's own fixed start times are offered, on any day whose
// hours reach into the evening (so a Saturday that closes at 14:00 never
// gets an 18:00 option). This lets a special service run past the day's
// usual closing time, which candidateSlots' regular fit-before-close check
// would otherwise reject.
export function candidateSlots(dateISO: string, settings: Settings, rule?: ServiceRule): Slot[] {
  const day = DateTime.fromISO(dateISO, { zone: BOOKING_TZ });
  if (!day.isValid) return [];
  const cfg = settings.weeklyHours[day.weekday];
  if (!cfg?.enabled || !cfg.ranges?.length) return [];

  if (rule) {
    const toMinutes = (hhmm: string) => {
      const [h, m] = hhmm.split(":").map(Number);
      return h * 60 + m;
    };
    const earliestAllowed = Math.min(...rule.allowedStartTimes.map(toMinutes));
    const reachesEvening = cfg.ranges.some((r) => toMinutes(r.close) >= earliestAllowed);
    if (!reachesEvening) return [];
    return [...rule.allowedStartTimes].sort();
  }

  const set = new Set<string>();
  for (const range of cfg.ranges) {
    const [oh, om] = range.open.split(":").map(Number);
    const [ch, cm] = range.close.split(":").map(Number);
    if ([oh, om, ch, cm].some(Number.isNaN)) continue;
    const closeMin = ch * 60 + cm;
    // A slot only counts if it fully fits before this range's closing time.
    for (let t = oh * 60 + om; t + settings.slotMinutes <= closeMin; t += settings.slotMinutes) {
      const hh = String(Math.floor(t / 60)).padStart(2, "0");
      const mm = String(t % 60).padStart(2, "0");
      set.add(`${hh}:${mm}`);
    }
  }
  return [...set].sort();
}

// Wall-clock slot on a date -> its start/end as tz-aware Luxon DateTimes.
export function slotInstants(dateISO: string, slot: Slot, slotMinutes: number) {
  const start = DateTime.fromISO(`${dateISO}T${slot}`, { zone: BOOKING_TZ });
  const end = start.plus({ minutes: slotMinutes });
  return { start, end };
}
