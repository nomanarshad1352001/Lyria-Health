/**
 * POST /api/waitlist/deletion — Right to erasure (UK GDPR Art. 17).
 * Removes the waiting-list record for an email address "without undue
 * delay" and appends a hashed, non-identifying line to the audit log so the
 * erasure itself is evidenced.
 *
 * PRODUCTION NOTE: confirm ownership first by emailing a signed deletion
 * link (same double opt-in mechanic as sign-up) before erasing.
 */
import { NextRequest, NextResponse } from "next/server";
import { eraseByEmail, ipHash } from "@/lib/store";
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
  const rl = rateLimit(`delete:${ip}`, 6, 10 * 60 * 1000);
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
  if (body.confirm !== true) {
    return NextResponse.json({ ok: false, error: "confirmation_required" }, { status: 422 });
  }

  const deleted = eraseByEmail(email, ipHash(ip));
  return NextResponse.json({ ok: true, deleted });
}
