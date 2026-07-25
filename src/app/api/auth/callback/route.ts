import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/booking/google";
import { saveRefreshToken } from "@/lib/booking/store";
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/booking/session";
import { OWNER_EMAIL, hasBookingBackend } from "@/lib/booking/config";

export const runtime = "nodejs";

// Handles Google's redirect back: verifies the account is the owner, stores the
// refresh token, and opens an admin session.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  if (!hasBookingBackend()) {
    return NextResponse.redirect(`${origin}/admin?error=config`);
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get("es_oauth_state")?.value;
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(`${origin}/admin?error=state`);
  }

  try {
    const { email, refreshToken } = await exchangeCode(origin, code);
    if (email !== OWNER_EMAIL) {
      return NextResponse.redirect(`${origin}/admin?error=denied`);
    }
    if (refreshToken) await saveRefreshToken(refreshToken);

    const res = NextResponse.redirect(`${origin}/admin`);
    res.cookies.set(SESSION_COOKIE, createSession(email), sessionCookieOptions);
    res.cookies.set("es_oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch {
    return NextResponse.redirect(`${origin}/admin?error=oauth`);
  }
}
