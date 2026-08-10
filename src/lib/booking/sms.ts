// Thin wrapper around Twilio's REST API — no SDK dependency, same pattern as
// google.ts (raw HTTP call with the auth handled inline).

import { twilioAccountSid, twilioAuthPair, twilioFrom } from "./config";

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

export async function sendSms(to: string, body: string): Promise<boolean> {
  // The URL path always takes the real Account SID ("AC…") — even when
  // authenticating with an API Key, which is a separate credential ("SK…")
  // that isn't itself an account.
  const accountSid = twilioAccountSid();
  const auth = twilioAuthPair();
  const from = twilioFrom();
  if (!accountSid || !auth || !from) return false;

  const params = new URLSearchParams({ To: to, Body: body });
  // A Messaging Service SID (starts "MG…") replaces a single From number.
  params.set(from.startsWith("MG") ? "MessagingServiceSid" : "From", from);

  const res = await fetch(
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
  return res.ok;
}
