/**
 * Tiny fixed-window rate limiter (in-memory). Enough for launch-scale spam
 * protection on a single instance; swap for Redis/Upstash when scaling out.
 */

type Bucket = { count: number; resetAt: number };

const globalKey = "__lyria_rate_limit__";
const g = globalThis as unknown as Record<string, Map<string, Bucket>>;
if (!g[globalKey]) g[globalKey] = new Map();
const buckets = g[globalKey];

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "127.0.0.1";
}
