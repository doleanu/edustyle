import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { hasBookingBackend } from "@/lib/booking/config";
import { getSettings, getRefreshToken } from "@/lib/booking/store";
import { DEFAULT_SETTINGS, candidateSlots, slotInstants, isDateClosed } from "@/lib/booking/settings";
import { getBusy, createEvent } from "@/lib/booking/google";
import { toE164 } from "@/lib/booking/sms";
import { getServiceRule } from "@/lib/booking/serviceRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
  company?: string; // honeypot (bots fill it; humans never see it)
};

// Public: creates a real appointment on the owner's calendar.
export async function POST(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!(await getRefreshToken())) {
    return NextResponse.json({ error: "not_connected" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Silently accept spam so bots get no signal.
  if (body.company) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const service = (body.service ?? "").trim();
  const date = (body.date ?? "").trim();
  const time = (body.time ?? "").trim();
  if (
    !name ||
    !phone ||
    !service ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time)
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Reject unparseable phone numbers here rather than accepting a mistyped
  // one and having the SMS reminder silently fail on every cron cycle —
  // give the client a chance to fix it while they're still on the form.
  if (!toE164(phone)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  // Reject bookings inside a vacation/holiday range even if a stale client
  // (cached page, old date-picker state) still posts one — the DatePicker
  // greys these out, but the server is the real gate.
  if (isDateClosed(date, settings)) {
    return NextResponse.json({ error: "closed" }, { status: 400 });
  }
  // The posted time must be a real bookable slot for that date (inside the
  // day's working ranges, on the slot grid — or, for a service with its own
  // rule, one of that rule's fixed start times) — blocks booking during a
  // break, or a "Pack completo" outside its 18:00/18:30 window.
  const rule = getServiceRule(service);
  if (!candidateSlots(date, settings, rule).includes(time)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }
  const { start, end } = slotInstants(date, time, rule?.durationMinutes ?? settings.slotMinutes);
  if (!start.isValid || start.toUTC() <= DateTime.utc()) {
    return NextResponse.json({ error: "past" }, { status: 400 });
  }

  // Re-check the slot is still free immediately before booking (best-effort
  // guard against two people grabbing the same slot).
  const busy = (await getBusy(start.toUTC().toISO()!, end.toUTC().toISO()!)) ?? [];
  const clash = busy.some(
    (b) =>
      start.toUTC() < DateTime.fromISO(b.end) && end.toUTC() > DateTime.fromISO(b.start)
  );
  if (clash) return NextResponse.json({ error: "taken" }, { status: 409 });

  const startWall = start.toFormat("yyyy-LL-dd'T'HH:mm:ss");
  const endWall = end.toFormat("yyyy-LL-dd'T'HH:mm:ss");
  const ok = await createEvent({
    summary: `${service} — ${name}`,
    description: `Reserva online\nCliente: ${name}\nTeléfono: ${phone}\nServicio: ${service}`,
    startWall,
    endWall,
    clientName: name,
    clientPhone: phone,
  });
  if (!ok) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
