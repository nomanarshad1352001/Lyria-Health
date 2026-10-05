/**
 * GET /api/waitlist/export — CSV export of the waiting list.
 *
 * Includes the consent-log essentials per row: wording version, source,
 * sign-up and confirmation timestamps — enough to evidence consent.
 *
 * PRODUCTION: restrict this. If EXPORT_TOKEN is set in the environment,
 * callers must send `Authorization: Bearer <token>`. In this demo build it
 * is open so the export can be exercised end-to-end.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { exportRows } from "@/lib/store";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function GET(req: NextRequest) {
  const token = process.env.EXPORT_TOKEN;
  if (token) {
    const auth = req.headers.get("authorization") ?? "";
    const provided = auth.replace(/^Bearer\s+/i, "");
    const a = Buffer.from(provided);
    const b = Buffer.from(token);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
    }
  }

  const rows = exportRows();
  const headers = [
    "name",
    "email",
    "tier_of_interest",
    "status",
    "source",
    "consent_wording_version",
    "signed_up_at",
    "confirmed_at",
    "unsubscribed_at",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(String(r[h as keyof typeof r]))).join(",")),
  ];
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lyria-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
