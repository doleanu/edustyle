import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/booking/session";

export const runtime = "nodejs";

// Clears the admin session cookie. The calendar connection (refresh token) is
// deliberately left intact so public bookings keep working after the owner
// closes the admin tab.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
