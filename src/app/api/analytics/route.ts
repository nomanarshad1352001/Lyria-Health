/**
 * POST /api/analytics — privacy-friendly page-view counting.
 *
 * Cookieless, fingerprint-free, IP-free. We store ONLY aggregate counts:
 * { '/faq': 12 }. No user identifiers, no sessions, no cross-site anything.
 * This is deliberately much less than Plausible/Umami collect, and it's
 * compliant without a cookie banner because nothing is stored on (or
 * about) the device or person.
 */
import { NextRequest, NextResponse } from "next/server";

interface AnalyticsState {
  counts: Map<string, number>;
  startedAt: string;
}

const globalKey = "__lyria_analytics__";
const g = globalThis as unknown as Record<string, AnalyticsState>;
if (!g[globalKey]) {
  g[globalKey] = { counts: new Map(), startedAt: new Date().toISOString() };
}
const state = g[globalKey];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { p?: unknown };
    const p = typeof body.p === "string" ? body.p : "";
    // Store the path only (no query strings — they can carry personal data).
    if (p.startsWith("/") && !p.includes("?") && p.length <= 120) {
      if (state.counts.size < 200 || state.counts.has(p)) {
        state.counts.set(p, (state.counts.get(p) ?? 0) + 1);
      }
    }
  } catch {
    /* ignore malformed beacons */
  }
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({
    note: "Aggregate, cookieless counts only. No IP, no identifiers.",
    since: state.startedAt,
    pages: Object.fromEntries([...state.counts.entries()].sort((a, b) => b[1] - a[1])),
    total: [...state.counts.values()].reduce((a, b) => a + b, 0),
  });
}
