import { createHmac, timingSafeEqual } from "node:crypto";
import { business } from "@/lib/business";
import {
  cronSecret,
  hasWhatsApp,
  waConfirmSid,
  waFrom,
  waReminderSid,
} from "./config";
import { gsmSafe, sendSms, sendWhatsAppTemplate } from "./sms";

// One place that decides HOW a client gets told about their appointment.
//   WhatsApp configured -> approved utility template (~$0.025), and if
//                          WhatsApp can't deliver it (number not on WhatsApp,
//                          etc.) /api/twilio/status re-sends it as SMS.
//   otherwise            -> SMS, as before ($0.0875 per segment).
// Nobody ends up without a message, and nothing here ever throws into the
// booking path.

export type NotifyKind = "confirm" | "reminder";

export type NotifyInput = {
  kind: NotifyKind;
  /** E.164, e.g. +34612345678 */
  to: string;
  firstName: string;
  /** confirm only */
  service?: string;
  /** dd/LL — confirm only */
  day?: string;
  /** HH:mm */
  time: string;
};

// SMS wording. ASCII-only and short on purpose (single GSM-7 segment).
export function smsBody(i: Omit<NotifyInput, "to">): string {
  const first = gsmSafe(i.firstName.slice(0, 12));
  if (i.kind === "confirm") {
    return (
      `Hola ${first}! Cita confirmada en Eduardo Style: ${gsmSafe(i.service ?? "")}, ` +
      `${i.day} ${i.time}. Cambios por WhatsApp (no respondas a este numero).`
    );
  }
  return (
    `Hola ${first}! Te recordamos tu cita en Eduardo Style hoy a las ${i.time}. ` +
    `Para cambios, escribenos por WhatsApp (no respondas a este numero).`
  );
}

// ── signed callback URL (so the status webhook can't be forged by a stranger)
function sign(payload: string): string {
  return createHmac("sha256", cronSecret()).update(payload).digest("hex").slice(0, 32);
}

export function verifySignature(payload: string, sig: string): boolean {
  if (!cronSecret() || !sig) return false;
  const a = Buffer.from(sign(payload));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function fallbackPayload(i: Omit<NotifyInput, "to">, to: string): string {
  return [i.kind, to, i.firstName, i.service ?? "", i.day ?? "", i.time].join("|");
}

function callbackUrl(i: NotifyInput): string {
  const payload = fallbackPayload(i, i.to);
  const q = new URLSearchParams({ p: payload, s: sign(payload) });
  return `${business.siteUrl}/api/twilio/status?${q.toString()}`;
}

/** Returns true if the message was handed to Twilio (WhatsApp or SMS). */
export async function notify(i: NotifyInput): Promise<boolean> {
  try {
    if (hasWhatsApp()) {
      const ok = await sendWhatsAppTemplate({
        to: i.to,
        from: waFrom(),
        contentSid: i.kind === "confirm" ? waConfirmSid() : waReminderSid(),
        // Template variables — see the wording in docs: confirm = {1 name,
        // 2 service, 3 day, 4 time}; reminder = {1 name, 2 time}.
        variables:
          i.kind === "confirm"
            ? { "1": i.firstName, "2": i.service ?? "", "3": i.day ?? "", "4": i.time }
            : { "1": i.firstName, "2": i.time },
        statusCallback: callbackUrl(i),
      });
      if (ok) return true;
      // Twilio rejected the request outright (bad template/sender): SMS now.
    }
    return await sendSms(i.to, smsBody(i));
  } catch {
    return false;
  }
}
