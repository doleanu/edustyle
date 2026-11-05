import { NextRequest, NextResponse } from "next/server";
import { hasSms } from "@/lib/booking/config";
import { claimOnce } from "@/lib/booking/store";
import { sendSms } from "@/lib/booking/sms";
import { smsBody, verifySignature, type NotifyKind } from "@/lib/booking/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Twilio calls this as a WhatsApp message changes status. If the WhatsApp
// message ends up failed/undelivered (typically: the client's number isn't on
// WhatsApp), the same text is re-sent as an SMS so nobody is left uninformed.
// The URL carries the message details + an HMAC, so it can't be forged.
export async function POST(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p") ?? "";
  const s = req.nextUrl.searchParams.get("s") ?? "";
  if (!verifySignature(p, s)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const status = String(form?.get("MessageStatus") ?? "");
  const sid = String(form?.get("MessageSid") ?? form?.get("SmsSid") ?? "");
  if (!["failed", "undelivered"].includes(status)) {
    return NextResponse.json({ ok: true, ignored: status });
  }
  if (!hasSms() || !sid) return NextResponse.json({ ok: true });

  // Twilio can repeat a callback: only ever fall back once per message.
  if (!(await claimOnce(`wa-fallback:${sid}`, 60 * 60 * 24))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const [kind, to, firstName, service, day, time] = p.split("|");
  if ((kind !== "confirm" && kind !== "reminder") || !to) {
    return NextResponse.json({ ok: true });
  }
  await sendSms(
    to,
    smsBody({ kind: kind as NotifyKind, firstName, service, day, time })
  ).catch(() => false);
  return NextResponse.json({ ok: true, fallback: "sms" });
}
