import crypto from "node:crypto";
import { sessionSecret } from "./config";

// Minimal signed-cookie session (a mini-JWT) — no external dependency. The
// payload carries the owner email + expiry, signed with HMAC-SHA256 over the
// SESSION_SECRET. Enough to gate the single-owner /admin area.

export const SESSION_COOKIE = "es_session";
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

export function createSession(email: string): string {
  const payload = { email, exp: Math.floor(Date.now() / 1000) + MAX_AGE_S };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = crypto.createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email: string;
      exp: number;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_S,
};
