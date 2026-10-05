/**
 * GET /api/waitlist/unsubscribe?token=… — ONE-CLICK unsubscribe.
 * Linked from every email (plus URL also sent as List-Unsubscribe header
 * in production). Immediately suppresses future email; no login needed.
 * A suppression record is retained (email + status) so they are never
 * re-added by accident — UK GDPR-compliant practice for opt-outs.
 */
import { NextRequest, NextResponse } from "next/server";
import { ipHash, unsubscribeByToken } from "@/lib/store";
import { clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const result = token
    ? unsubscribeByToken(token, ipHash(clientIp(req.headers)))
    : "invalid";

  return NextResponse.redirect(new URL(`/unsubscribed?status=${result}`, req.url), 303);
}
