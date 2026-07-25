import { NextRequest, NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/booking/session";
import { OWNER_EMAIL, hasBookingBackend } from "@/lib/booking/config";
import { getSettings, saveSettings, getRefreshToken } from "@/lib/booking/store";
import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from "@/lib/booking/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  return Boolean(s && s.email === OWNER_EMAIL);
}

// Owner reads current settings + connection status.
export async function GET(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  const connected = Boolean(await getRefreshToken());
  return NextResponse.json({ settings, connected, ownerEmail: OWNER_EMAIL });
}

// Owner saves settings.
export async function PUT(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Settings;
  try {
    body = (await req.json()) as Settings;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (
    !body ||
    typeof body.slotMinutes !== "number" ||
    body.slotMinutes < 5 ||
    body.slotMinutes > 240 ||
    !body.weeklyHours
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Normalize before persisting so the stored shape is always clean/current.
  await saveSettings(normalizeSettings(body));
  return NextResponse.json({ ok: true });
}
