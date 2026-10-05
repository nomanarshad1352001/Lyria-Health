/**
 * POST /api/waitlist — join the waiting list (double opt-in step 1)
 *
 * Spam protection, layered:
 *   1. Honeypot field (`company`) — bots that fill it get a fake 200.
 *   2. Time-to-fill check — submissions under ~1.2s are bots; fake 200 again.
 *   3. Per-IP fixed-window rate limit.
 *   4. Server-side validation + disposable-domain blocklist.
 *
 * GDPR: records consent wording version, source and a hashed IP in the
 * consent log. Collecting/confirming double opt-in; nothing is emailed
 * until the address owner confirms.
 */
import { NextRequest, NextResponse } from "next/server";
import { consent } from "@/content/copy";
import {
  findByEmail,
  ipHash,
  pendingSignup,
  type TierId,
} from "@/lib/store";
import { buildConfirmationEmail, deliver } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import crypto from "node:crypto";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIER_IDS: TierId[] = ["essential", "plus", "complete"];
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
]);

function fakeSuccess() {
  // Deliberate ambiguity — bots get nothing signal-worthy back.
  return NextResponse.json({ ok: true, state: "confirm_sent" });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tier = typeof body.tier === "string" && body.tier ? body.tier : null;
  const source = String(body.source ?? "unknown").slice(0, 48);
  const honeypot = String(body.company ?? "");
  const startedAt = Number(body.startedAt ?? 0);
  const agreed = body.consent === true;

  // 1) Honeypot
  if (honeypot) return fakeSuccess();

  // 2) Time-to-fill (only enforce the "too fast" direction)
  if (startedAt && Date.now() - startedAt < 1200) return fakeSuccess();

  // 3) Rate limit — 5 join attempts / 10 min / IP
  const ip = clientIp(req.headers);
  const rl = rateLimit(`join:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  // 4) Validation
  if (!name || name.length > 80) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 422 });
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  const domain = email.split("@")[1]!.toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return NextResponse.json({ ok: false, error: "disposable_email" }, { status: 422 });
  }
  if (tier !== null && !TIER_IDS.includes(tier as TierId)) {
    return NextResponse.json({ ok: false, error: "invalid_tier" }, { status: 422 });
  }
  if (!agreed) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 422 });
  }

  // Already confirmed? No resend, no enumeration details beyond a friendly note.
  const existing = findByEmail(email);
  if (existing && existing.status === "confirmed") {
    return NextResponse.json({ ok: true, state: "already" });
  }

  const { subscriber, fresh } = pendingSignup({
    name,
    email,
    tier: tier as TierId | null,
    source,
    ipHashValue: ipHash(ip),
  });

  const origin = new URL(req.url).origin;
  const confirmUrl = `${origin}/api/waitlist/confirm?token=${subscriber.confirmToken}`;
  const unsubscribeUrl = `${origin}/api/waitlist/unsubscribe?token=${subscriber.manageToken}`;

  const mail = buildConfirmationEmail({ name, confirmUrl, unsubscribeUrl });
  await deliver({
    id: crypto.randomUUID(),
    to: subscriber.email,
    toName: name,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    createdAt: new Date().toISOString(),
    kind: "confirmation",
  });

  // Demo convenience: while the transport is the stub (no SMTP), surface a
  // link to the in-browser mailbox so the double opt-in flow is testable.
  const isStub = process.env.EMAIL_TRANSPORT !== "live";
  return NextResponse.json({
    ok: true,
    state: fresh ? "confirm_sent" : "resent",
    wordingVersion: consent.version,
    ...(isStub ? { previewUrl: `/mailbox?to=${encodeURIComponent(subscriber.email)}` } : {}),
  });
}
