import { OAuth2Client } from "google-auth-library";
import {
  BOOKING_TZ,
  googleClientId,
  googleClientSecret,
  redirectUri,
} from "./config";
import { getRefreshToken } from "./store";

// Full calendar scope covers both the free/busy read and the event insert.
const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/calendar"];

export function oauthClient(origin: string) {
  return new OAuth2Client({
    clientId: googleClientId(),
    clientSecret: googleClientSecret(),
    redirectUri: redirectUri(origin),
  });
}

export function consentUrl(origin: string, state: string) {
  return oauthClient(origin).generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // force a refresh_token on every consent
    scope: SCOPES,
    state,
  });
}

// Exchange the OAuth code; returns the signed-in email + refresh token.
export async function exchangeCode(origin: string, code: string) {
  const client = oauthClient(origin);
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) throw new Error("No id_token returned");
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: googleClientId(),
  });
  const payload = ticket.getPayload();
  const email = payload?.email?.toLowerCase() ?? "";
  return { email, refreshToken: tokens.refresh_token ?? null };
}

// An OAuth client authenticated as the owner via the stored refresh token.
// google-auth-library refreshes the access token automatically on each request.
async function ownerClient(): Promise<OAuth2Client | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;
  const client = new OAuth2Client({
    clientId: googleClientId(),
    clientSecret: googleClientSecret(),
  });
  client.setCredentials({ refresh_token: refresh });
  return client;
}

export type BusyPeriod = { start: string; end: string };

// Returns the owner's busy periods in [timeMin, timeMax], or null if the
// calendar isn't connected.
export async function getBusy(
  timeMinUTC: string,
  timeMaxUTC: string
): Promise<BusyPeriod[] | null> {
  const client = await ownerClient();
  if (!client) return null;
  const res = await client.request<{
    calendars: Record<string, { busy: BusyPeriod[] }>;
  }>({
    url: "https://www.googleapis.com/calendar/v3/freeBusy",
    method: "POST",
    data: {
      timeMin: timeMinUTC,
      timeMax: timeMaxUTC,
      timeZone: "UTC",
      items: [{ id: "primary" }],
    },
  });
  return res.data.calendars.primary?.busy ?? [];
}

// Creates the appointment on the owner's primary calendar. Wall-clock times are
// passed with the timeZone field so Google resolves the correct UTC instant
// (DST-safe). `clientPhone` (if given) is stashed as a private extended
// property — that's how the reminder cron later finds who to text without a
// separate bookings database; `reminderSent` starts at "false" and the cron
// flips it once the SMS goes out, so a retry/duplicate run never double-texts.
// Returns false if the calendar isn't connected.
export async function createEvent(opts: {
  summary: string;
  description: string;
  startWall: string; // "YYYY-MM-DDTHH:mm:ss" local wall clock
  endWall: string;
  clientName?: string;
  clientPhone?: string;
}): Promise<boolean> {
  const client = await ownerClient();
  if (!client) return false;
  await client.request({
    url: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    method: "POST",
    data: {
      summary: opts.summary,
      description: opts.description,
      start: { dateTime: opts.startWall, timeZone: BOOKING_TZ },
      end: { dateTime: opts.endWall, timeZone: BOOKING_TZ },
      ...(opts.clientPhone
        ? {
            extendedProperties: {
              private: {
                reminderSent: "false",
                clientPhone: opts.clientPhone,
                clientName: opts.clientName ?? "",
              },
            },
          }
        : {}),
    },
  });
  return true;
}

export type UpcomingEvent = {
  id: string;
  summary: string;
  startUTC: string;
  clientName: string;
  clientPhone: string;
};

// Lists events starting in [timeMinUTC, timeMaxUTC) that still owe a reminder
// (reminderSent !== "true") and have a phone to text. Used by the reminder
// cron endpoint — narrow window, so this stays cheap to poll every few minutes.
export async function listUpcomingUnreminded(
  timeMinUTC: string,
  timeMaxUTC: string
): Promise<UpcomingEvent[]> {
  const client = await ownerClient();
  if (!client) return [];
  const res = await client.request<{
    items: Array<{
      id: string;
      summary?: string;
      start?: { dateTime?: string };
      extendedProperties?: { private?: Record<string, string> };
    }>;
  }>({
    url: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    method: "GET",
    params: {
      timeMin: timeMinUTC,
      timeMax: timeMaxUTC,
      singleEvents: true,
      orderBy: "startTime",
      privateExtendedProperty: "reminderSent=false",
    },
  });
  return (res.data.items ?? [])
    .filter((e) => e.start?.dateTime && e.extendedProperties?.private?.clientPhone)
    .map((e) => ({
      id: e.id,
      summary: e.summary ?? "",
      startUTC: e.start!.dateTime!,
      clientName: e.extendedProperties?.private?.clientName ?? "",
      clientPhone: e.extendedProperties!.private!.clientPhone!,
    }));
}

// Flips reminderSent so this event is never texted twice.
export async function markReminderSent(eventId: string): Promise<void> {
  const client = await ownerClient();
  if (!client) return;
  await client.request({
    url: `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(
      eventId
    )}`,
    method: "PATCH",
    data: { extendedProperties: { private: { reminderSent: "true" } } },
  });
}
