import { Redis } from "@upstash/redis";
import type { Storage } from "./service";

/** Upstash Redis / Vercel KV — for sites that already have it. `prefix` namespaces the keys. */
export function redisStorage(opts: { url: string; token: string; prefix: string }): Storage {
  const redis = new Redis({ url: opts.url, token: opts.token });
  return {
    async read(name) {
      const raw = await redis.get<unknown>(`${opts.prefix}:${name}`);
      if (raw === null || raw === undefined) return null;
      // Upstash may hand back an already-parsed object for JSON strings
      return typeof raw === "string" ? raw : JSON.stringify(raw);
    },
    async write(name, value) {
      await redis.set(`${opts.prefix}:${name}`, value);
    },
  };
}
