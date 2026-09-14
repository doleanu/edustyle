import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { hasBookingBackend, BOOKING_TZ } from "@/lib/booking/config";
import { getSettings, getRefreshToken } from "@/lib/booking/store";
import { DEFAULT_SETTINGS, candidateSlots, slotInstants, isDateClosed } from "@/lib/booking/settings";
import { getBusy } from "@/lib/booking/google";
import { getServiceRule } from "@/lib/booking/serviceRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: returns free time slots for a given date, or { configured: false }
// which tells the booking form to fall back to WhatsApp-only mode.
export async function GET(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ configured: false, slots: [] });
  }
  const connected = Boolean(await getRefreshToken());
  if (!connected) {
    return NextResponse.json({ configured: false, slots: [] });
  }

  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Configured, but no (valid) date yet — used as the initial probe. Also
    // hands back the owner's vacation/holiday ranges so the client-side
    // calendar can grey them out before the client even tries to pick one.
    const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
    return NextResponse.json({
      configured: true,
      slots: [],
      closedRanges: settings.closedRanges.map(({ start, end }) => ({ start, end })),
    });
  }

  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  if (isDateClosed(date, settings)) {
    return NextResponse.json({ configured: true, slots: [] });
  }
  const service = req.nextUrl.searchParams.get("service") ?? "";
  const rule = getServiceRule(service);
  const candidates = candidateSlots(date, settings, rule);
  if (candidates.length === 0) {
    return NextResponse.json({ configured: true, slots: [] });
  }

  // Query the owner's busy periods across the whole day (UTC window).
  const dayStart = DateTime.fromISO(date, { zone: BOOKING_TZ }).startOf("day").toUTC();
  const dayEnd = dayStart.plus({ days: 1 });
  const busy = (await getBusy(dayStart.toISO()!, dayEnd.toISO()!)) ?? [];
  const busyRanges = busy.map((b) => ({
    start: DateTime.fromISO(b.start),
    end: DateTime.fromISO(b.end),
  }));

  const now = DateTime.utc();
  const slotMinutes = rule?.durationMinutes ?? settings.slotMinutes;
  const free = candidates.filter((slot) => {
    const { start, end } = slotInstants(date, slot, slotMinutes);
    const startU = start.toUTC();
    const endU = end.toUTC();
    if (startU <= now) return false; // no slots in the past
    return !busyRanges.some((b) => startU < b.end && endU > b.start);
  });

  return NextResponse.json({ configured: true, slots: free });
}
