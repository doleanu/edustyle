import { Redis } from "@upstash/redis";
import { kvConfig } from "./config";
import { normalizeSettings, type Settings } from "./settings";

// Single-tenant persistence (Upstash Redis / Vercel KV). Two keys:
//   owner:refresh_token  -> the barber's Google refresh token, obtained once at
//                           OAuth and reused server-side to read/write his
//                           calendar even when he isn't the one browsing.
//   owner:settings       -> weekly hours + slot length (JSON).

let client: Redis | null = null;

function redis(): Redis | null {
  const cfg = kvConfig();
  if (!cfg) return null;
  if (!client) client = new Redis({ url: cfg.url, token: cfg.token });
  return client;
}

// Namespaced so this can safely share an Upstash database with other projects.
const TOKEN_KEY = "edustyle:owner:refresh_token";
const SETTINGS_KEY = "edustyle:owner:settings";

export async function saveRefreshToken(token: string) {
  const r = redis();
  if (!r) throw new Error("KV not configured");
  await r.set(TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  const r = redis();
  if (!r) return null;
  return (await r.get<string>(TOKEN_KEY)) ?? null;
}

export async function clearRefreshToken() {
  const r = redis();
  if (!r) return;
  await r.del(TOKEN_KEY);
}

export async function saveSettings(s: Settings) {
  const r = redis();
  if (!r) throw new Error("KV not configured");
  await r.set(SETTINGS_KEY, JSON.stringify(s));
}

export async function getSettings(): Promise<Settings | null> {
  const r = redis();
  if (!r) return null;
  // Upstash may return the value already parsed or as a string depending on how
  // it was stored — handle both, then normalize (migrates the pre-split-shift
  // single-range shape to the current multi-range shape transparently).
  const raw = await r.get<unknown>(SETTINGS_KEY);
  if (!raw) return null;
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return normalizeSettings(parsed);
}
