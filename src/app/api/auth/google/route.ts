import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { consentUrl } from "@/lib/booking/google";
import { hasBookingBackend } from "@/lib/booking/config";

export const runtime = "nodejs";

// Kicks off the Google OAuth consent flow for the shop owner.
export async function GET(req: NextRequest) {
  if (!hasBookingBackend()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const origin = req.nextUrl.origin;
  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(consentUrl(origin, state));
  // CSRF guard: echo this back and compare in the callback.
  res.cookies.set("es_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
