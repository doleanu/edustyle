import { NextRequest, NextResponse } from "next/server";
import { OWNER_EMAIL, adminPassword, hasBookingBackend } from "@/lib/booking/config";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/booking/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple email+password login for /admin — separate from the Google OAuth
// flow, which is only for connecting the calendar (triggered by its own
// button once inside the dashboard). Both end up creating the same session
// cookie, so /api/settings doesn't need to know or care which path was used.
export async function POST(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const email = (body.email ?? "").toLowerCase().trim();
  const password = body.password ?? "";
  const expected = adminPassword();

  if (!expected || email !== OWNER_EMAIL || password !== expected) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(OWNER_EMAIL), sessionCookieOptions);
  return res;
}
