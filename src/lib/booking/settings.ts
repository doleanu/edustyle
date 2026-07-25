import { DateTime } from "luxon";
import { BOOKING_TZ } from "./config";
import { business } from "@/lib/business";

// Owner-configurable scheduling settings. Weekday uses Luxon numbering:
// 1 = Monday … 7 = Sunday.
export type DayConfig = { enabled: boolean; open: string; close: string };

export type Settings = {
  slotMinutes: number;
  weeklyHours: Record<number, DayConfig>;
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
      wh[d] = { enabled: false, open: "10:00", close: "19:00" };
    }
    for (const h of business.hours) {
      const wd = DAY_TO_WEEKDAY[h.day];
      if (!wd) continue;
      wh[wd] =
        h.open && h.close
          ? { enabled: true, open: h.open, close: h.close }
          : { enabled: false, open: "10:00", close: "19:00" };
    }
    return wh;
  })(),
};

export type Slot = string; // "HH:mm" wall-clock in BOOKING_TZ

// Pure generator: candidate wall-clock slots for an ISO date (YYYY-MM-DD) from
// the owner's weekly config. No calendar filtering happens here.
export function candidateSlots(dateISO: string, settings: Settings): Slot[] {
  const day = DateTime.fromISO(dateISO, { zone: BOOKING_TZ });
  if (!day.isValid) return [];
  const cfg = settings.weeklyHours[day.weekday];
  if (!cfg?.enabled) return [];

  const [oh, om] = cfg.open.split(":").map(Number);
  const [ch, cm] = cfg.close.split(":").map(Number);
  const closeMin = ch * 60 + cm;

  const slots: Slot[] = [];
  // A slot only counts if it fully fits before closing time.
  for (let t = oh * 60 + om; t + settings.slotMinutes <= closeMin; t += settings.slotMinutes) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

// Wall-clock slot on a date -> its start/end as tz-aware Luxon DateTimes.
export function slotInstants(dateISO: string, slot: Slot, slotMinutes: number) {
  const start = DateTime.fromISO(`${dateISO}T${slot}`, { zone: BOOKING_TZ });
  const end = start.plus({ minutes: slotMinutes });
  return { start, end };
}
