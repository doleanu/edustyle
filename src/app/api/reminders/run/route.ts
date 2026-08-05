import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { BOOKING_TZ, cronSecret, hasReminders } from "@/lib/booking/config";
import { listUpcomingUnreminded, markReminderSent } from "@/lib/booking/google";
import { sendSms, toE164 } from "@/lib/booking/sms";
import { getRefreshToken } from "@/lib/booking/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// How far ahead of the appointment the text goes out. Polled by an external
// cron (GitHub Actions, every ~10 min — see .github/workflows/reminders.yml)
// rather than Vercel's own cron, since Vercel's Hobby plan only allows
// once-a-day schedules and this needs to fire within a tight window.
const LEAD_MINUTES = 60;
// Look a little further out than LEAD_MINUTES so a delayed cron tick (or one
// run getting skipped) still catches every event before it's "due" — the
// reminderSent flag on the calendar event makes re-checking the same event
// across runs harmless, never a double text.
const LOOKAHEAD_MINUTES = 75;

// Triggered by the external scheduler, not a human — guarded by a shared
// secret instead of the /admin session cookie.
export async function POST(req: NextRequest) {
  if (!hasReminders()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${cronSecret()}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!(await getRefreshToken())) {
    return NextResponse.json({ error: "not_connected" }, { status: 503 });
  }

  const now = DateTime.utc();
  const events = await listUpcomingUnreminded(
    now.toISO()!,
    now.plus({ minutes: LOOKAHEAD_MINUTES }).toISO()!
  );

  const due = events.filter(
    (e) => DateTime.fromISO(e.startUTC).diff(now, "minutes").minutes <= LEAD_MINUTES
  );

  let sent = 0;
  let failed = 0;
  for (const e of due) {
    const to = toE164(e.clientPhone);
    if (!to) {
      failed++;
      continue;
    }
    const startLocal = DateTime.fromISO(e.startUTC).setZone(BOOKING_TZ);
    const firstName = e.clientName.split(" ")[0] || e.clientName;
    const body =
      `Hola ${firstName}! Te recordamos tu cita en Eduardo Style hoy a las ` +
      `${startLocal.toFormat("HH:mm")}. Si necesitas cambiarla, escríbenos por WhatsApp.`;
    const ok = await sendSms(to, body);
    if (ok) {
      sent++;
      await markReminderSent(e.id);
    } else {
      failed++;
    }
  }

  return NextResponse.json({ ok: true, checked: events.length, sent, failed });
}
