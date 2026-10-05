/**
 * GET /api/waitlist/confirm?token=… — double opt-in step 2.
 * Clicked from the confirmation email. Confirms and redirects to a page.
 */
import { NextRequest, NextResponse } from "next/server";
import { confirmByToken, ipHash } from "@/lib/store";
import { clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const result = token
    ? confirmByToken(token, ipHash(clientIp(req.headers)))
    : "invalid";

  return NextResponse.redirect(new URL(`/confirmed?status=${result}`, req.url), 303);
}
