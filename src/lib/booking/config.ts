// Central config + feature-detection for the booking backend.
//
// The whole booking backend is OPTIONAL. If the Google / storage env vars are
// not set, hasBookingBackend() returns false and the public booking form falls
// back to its original WhatsApp-only behaviour. This keeps the LIVE site safe
// while the Google Cloud + Upstash setup is still being wired up: the moment the
// env vars are added in Vercel, the real calendar-backed flow activates on its own.

// Canary Islands run on Atlantic/Canary — one hour BEHIND mainland Spain. Every
// slot calculation and calendar event must be pinned to this zone or bookings
// silently land an hour off.
export const BOOKING_TZ = "Atlantic/Canary";

// Only this Google account may sign in to /admin and own the connected calendar.
export const OWNER_EMAIL = (process.env.OWNER_EMAIL ?? "").toLowerCase().trim();

export function googleClientId() {
  return process.env.GOOGLE_CLIENT_ID ?? "";
}

export function googleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET ?? "";
}

// Derived from the incoming request origin so the same code works on localhost
// and on the production domain (both callback URLs must be registered in the
// Google Cloud OAuth client).
export function redirectUri(origin: string) {
  return `${origin}/api/auth/callback`;
}

function kvUrl() {
  return process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
}

function kvToken() {
  return process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
}

export function kvConfig() {
  const url = kvUrl();
  const token = kvToken();
  return url && token ? { url, token } : null;
}

export function sessionSecret() {
  return process.env.SESSION_SECRET ?? "";
}

// The /admin login password. Deliberately simple (the site's own domain) —
// this gates a low-stakes single-owner settings panel, not the calendar
// itself (that's still real Google OAuth, triggered separately once inside).
export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

// True only when every piece the backend needs is present.
export function hasBookingBackend() {
  return Boolean(
    googleClientId() &&
      googleClientSecret() &&
      OWNER_EMAIL &&
      sessionSecret() &&
      kvConfig()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SMS reminders (Twilio). Optional on top of the booking backend — same
// progressive pattern: if any of these is missing, the reminder cron endpoint
// just no-ops (503), it never blocks a booking from being created.
// ─────────────────────────────────────────────────────────────────────────────

// The account itself (starts "AC…") — every Twilio API call is scoped under
// /Accounts/{this}/…, regardless of which credential pair authenticates it.
export function twilioAccountSid() {
  return process.env.TWILIO_ACCOUNT_SID ?? "";
}

// Two ways to authenticate the REST call — either works:
//  1. The master Auth Token (Console home, next to the Account SID).
//  2. An API Key SID ("SK…") + Secret (Console → Account → API keys & tokens
//     → Create API key). Twilio's own recommended approach, since a key can
//     be revoked individually without rotating the master token. If both are
//     set, the API Key takes precedence.
export function twilioAuthToken() {
  return process.env.TWILIO_AUTH_TOKEN ?? "";
}

export function twilioApiKeySid() {
  return process.env.TWILIO_API_KEY_SID ?? "";
}

export function twilioApiKeySecret() {
  return process.env.TWILIO_API_KEY_SECRET ?? "";
}

// The Basic Auth pair to actually send with the request.
export function twilioAuthPair(): { user: string; pass: string } | null {
  const keySid = twilioApiKeySid();
  const keySecret = twilioApiKeySecret();
  if (keySid && keySecret) return { user: keySid, pass: keySecret };
  const accountSid = twilioAccountSid();
  const authToken = twilioAuthToken();
  if (accountSid && authToken) return { user: accountSid, pass: authToken };
  return null;
}

// E.164 sender, e.g. "+15017122661", or a Messaging Service SID (starts "MG…").
export function twilioFrom() {
  return process.env.TWILIO_FROM_NUMBER ?? "";
}

// Shared secret the external scheduler (GitHub Actions cron) presents as
// `Authorization: Bearer <secret>` so the reminder endpoint can't be triggered
// by randoms hitting the URL.
export function cronSecret() {
  return process.env.CRON_SECRET ?? "";
}

export function hasReminders() {
  return Boolean(
    hasBookingBackend() &&
      twilioAccountSid() &&
      twilioAuthPair() &&
      twilioFrom() &&
      cronSecret()
  );
}
