/**
 * POST /api/waitlist/access — Right of access (UK GDPR Art. 15).
 * Returns everything we hold for an email address (tokens stripped).
 *
 * PRODUCTION NOTE: verify ownership first (e.g. email a signed access link,
 * exactly like the deletion flow's confirmation step) before releasing data.
 * This demo build returns it directly for evaluability.
 */
import { NextRequest, NextResponse } from "next/server";
import { accessByEmail, findByEmail } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const ip = clientIp(req.headers);
  const rl = rateLimit(`access:${ip}`, 6, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const email = String(body.email ?? "").trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const record = accessByEmail(email);
  // In production the one-click unsubscribe URL is delivered by email only;
  // here (demo) it accompanies the access response so the flow is testable.
  const raw = findByEmail(email);
  const manageUrl = raw?.manageToken
    ? `${new URL(req.url).origin}/api/waitlist/unsubscribe?token=${raw.manageToken}`
    : null;
  return NextResponse.json({ ok: true, found: record !== null, record, manageUrl });
}
