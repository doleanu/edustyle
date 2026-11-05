// Thin wrapper around Twilio's REST API — no SDK dependency, same pattern as
// google.ts (raw HTTP call with the auth handled inline).

import { twilioAccountSid, twilioAuthPair, twilioFrom, waAccountSid } from "./config";

// Clients type their phone however they like ("612 345 678", "+34612345678",
// "0034…"). Twilio needs strict E.164. Assume Spain (+34) when no country
// code is given — safe for this business, which only serves the Canary
// Islands. Returns null if it doesn't look like a plausible number at all.
export function toE164(raw: string): string | null {
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith("+")) {
    // No country code given — assume Spain. Spanish numbers are always
    // exactly 9 digits nationally (6/7 mobile, 8/9 landline); reject
    // anything else outright instead of blindly forwarding a mistyped
    // number to Twilio, where it just fails silently every reminder cycle
    // (e.g. a client who typed one digit too many).
    const national = digits.replace(/^0+/, "");
    if (!/^[6789]\d{8}$/.test(national)) return null;
    digits = `+34${national}`;
  }
  // E.164: + followed by 8–15 digits.
  return /^\+\d{8,15}$/.test(digits) ? digits : null;
}

// Twilio bills per SEGMENT: 160 chars (153 when split) in the GSM-7 alphabet,
// but a single accented character outside it (í, ó, ú, á...) flips the whole
// message to UCS-2, which is only 70 (67 split) per segment — a 135-char text
// to "María" cost 3 segments instead of 1. Client names and service names are
// free text, so fold them to plain ASCII before they go into any SMS body.
export function gsmSafe(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

async function twilioPost(
  params: URLSearchParams,
  pathAccountSid?: string
): Promise<Response | null> {
  // The URL path always takes the real Account SID ("AC…") — even when
  // authenticating with an API Key, which is a separate credential ("SK…")
  // that isn't itself an account. `pathAccountSid` targets a subaccount;
  // the parent's credentials authenticate it.
  const accountSid = pathAccountSid || twilioAccountSid();
  const auth = twilioAuthPair();
  if (!accountSid || !auth) return null;
  return fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${auth.user}:${auth.pass}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );
}

export async function sendSms(to: string, body: string): Promise<boolean> {
  const from = twilioFrom();
  if (!from) return false;
  const params = new URLSearchParams({ To: to, Body: body });
  // A Messaging Service SID (starts "MG…") replaces a single From number.
  params.set(from.startsWith("MG") ? "MessagingServiceSid" : "From", from);
  const res = await twilioPost(params);
  return Boolean(res?.ok);
}

// Sends an approved WhatsApp template. A 2xx only means Twilio accepted it:
// "this number isn't on WhatsApp" etc. fail asynchronously, which is what
// `statusCallback` is for (see /api/twilio/status — it falls back to SMS).
export async function sendWhatsAppTemplate(opts: {
  to: string; // E.164, no "whatsapp:" prefix
  from: string; // "whatsapp:+…"
  contentSid: string;
  variables: Record<string, string>;
  statusCallback?: string;
}): Promise<boolean> {
  const params = new URLSearchParams({
    To: `whatsapp:${opts.to}`,
    From: opts.from,
    ContentSid: opts.contentSid,
    ContentVariables: JSON.stringify(opts.variables),
  });
  if (opts.statusCallback) params.set("StatusCallback", opts.statusCallback);
  const res = await twilioPost(params, waAccountSid());
  return Boolean(res?.ok);
}
