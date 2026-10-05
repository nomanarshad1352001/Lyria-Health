import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Health check — intentionally database-free.
 * This build uses in-memory/dummy data only (per brief); nothing here
 * opens a PostgreSQL connection.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "lyria-health-landing",
    database: "none (in-memory demo store)",
    time: new Date().toISOString(),
  });
}
