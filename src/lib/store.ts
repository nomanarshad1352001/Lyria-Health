/**
 * ─────────────────────────────────────────────────────────────────────────
 * WAITING LIST REPOSITORY (in-memory demo implementation)
 * ─────────────────────────────────────────────────────────────────────────
 * Per the brief, this build uses DUMMY DATA — no database connection.
 * The module deliberately exposes a narrow repository interface so a
 * Drizzle/PostgreSQL adapter can be dropped in later (same function
 * signatures, swap the bodies for `db` calls) without touching the API
 * routes or UI. That future adapter also covers referral, booking and
 * payment records — the schema below is designed not to change.
 *
 * Consent log: every state change appends an immutable `ConsentEvent`
 * with timestamp, wording version, source and a one-way IP hash.
 * ─────────────────────────────────────────────────────────────────────────
 */
import crypto from "node:crypto";
import { consent } from "@/content/copy";

export type TierId = "essential" | "plus" | "complete";
export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type ConsentEventType =
  | "signup_pending"
  | "notification_resent"
  | "confirmed"
  | "unsubscribed"
  | "erasure_completed";

export interface ConsentEvent {
  type: ConsentEventType;
  at: string; // ISO 8601 timestamp
  wordingVersion: string; // consent wording version shown at the time
  source: string; // UI surface, e.g. "hero" | "tier:plus" | "footer-band"
  ipHash: string; // one-way truncated hash — never the raw IP
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  tier: TierId | null;
  status: SubscriberStatus;
  source: string;
  wordingVersion: string;
  confirmToken: string | null;
  manageToken: string | null;
  createdAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  events: ConsentEvent[];
}

interface StoreState {
  byEmail: Map<string, Subscriber>;
  byConfirmToken: Map<string, string>; // token -> email
  byManageToken: Map<string, string>; // token -> email
  auditLog: Array<ConsentEvent & { emailHash: string }>;
}

export const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const ipHash = (ip: string) =>
  sha256(`lyria:${process.env.LOG_SALT ?? "demo-salt"}:${ip}`).slice(0, 16);

const newToken = () => crypto.randomBytes(24).toString("base64url");

/* ── Seed: plausible dummy subscribers so exports/demo screens have data ── */
function seedSubscriber(
  partial: Pick<Subscriber, "name" | "email" | "tier" | "source"> & {
    status: SubscriberStatus;
    daysAgo: number;
    confirmDay?: number;
  },
): Subscriber {
  const created = new Date(Date.now() - partial.daysAgo * 86_400_000);
  const confirmToken = newToken();
  const manageToken = newToken();
  const sub: Subscriber = {
    id: crypto.randomUUID(),
    name: partial.name,
    email: partial.email,
    tier: partial.tier,
    status: partial.status,
    source: partial.source,
    wordingVersion: consent.version,
    confirmToken,
    manageToken,
    createdAt: created.toISOString(),
    confirmedAt:
      partial.status !== "pending"
        ? new Date(created.getTime() + 3_600_000 * (partial.confirmDay ?? 2)).toISOString()
        : null,
    unsubscribedAt:
      partial.status === "unsubscribed"
        ? new Date(created.getTime() + 86_400_000 * 4).toISOString()
        : null,
    events: [
      {
        type: "signup_pending",
        at: created.toISOString(),
        wordingVersion: consent.version,
        source: partial.source,
        ipHash: ipHash("seed"),
      },
      ...(partial.status !== "pending"
        ? [
            {
              type: "confirmed" as const,
              at: new Date(
                created.getTime() + 3_600_000 * (partial.confirmDay ?? 2),
              ).toISOString(),
              wordingVersion: consent.version,
              source: "email-confirm",
              ipHash: ipHash("seed"),
            },
          ]
        : []),
      ...(partial.status === "unsubscribed"
        ? [
            {
              type: "unsubscribed" as const,
              at: new Date(created.getTime() + 86_400_000 * 4).toISOString(),
              wordingVersion: consent.version,
              source: "email-one-click",
              ipHash: ipHash("seed"),
            },
          ]
        : []),
    ],
  };
  return sub;
}

function buildInitialState(): StoreState {
  const seed: Subscriber[] = [
    seedSubscriber({ name: "Amara Osei", email: "amara.osei@example.co.uk", tier: "plus", source: "hero", status: "confirmed", daysAgo: 12 }),
    seedSubscriber({ name: "Daniel Whitmore", email: "d.whitmore@example.com", tier: "complete", source: "tier:complete", status: "confirmed", daysAgo: 9, confirmDay: 1 }),
    seedSubscriber({ name: "Priya Nair", email: "priya.nair@example.org", tier: null, source: "footer-band", status: "pending", daysAgo: 6 }),
    seedSubscriber({ name: "Tom Ellery", email: "tom.ellery@example.co.uk", tier: "essential", source: "tier:essential", status: "confirmed", daysAgo: 5 }),
    seedSubscriber({ name: "Sofia Marchetti", email: "sofia.m@example.com", tier: "plus", source: "hero", status: "unsubscribed", daysAgo: 14 }),
    seedSubscriber({ name: "James Okafor", email: "j.okafor@example.net", tier: null, source: "faq", status: "pending", daysAgo: 2 }),
  ];
  const state: StoreState = {
    byEmail: new Map(),
    byConfirmToken: new Map(),
    byManageToken: new Map(),
    auditLog: [],
  };
  for (const s of seed) {
    state.byEmail.set(s.email.toLowerCase(), s);
    if (s.confirmToken) state.byConfirmToken.set(s.confirmToken, s.email.toLowerCase());
    if (s.manageToken) state.byManageToken.set(s.manageToken, s.email.toLowerCase());
  }
  return state;
}

// Survive Next.js hot-reload / multiple server chunks in the same process.
const globalKey = "__lyria_waitlist_store__";
const g = globalThis as unknown as Record<string, StoreState>;
if (!g[globalKey]) g[globalKey] = buildInitialState();
const store = g[globalKey];

/* ──────────────────────────────────────────────────────────────────────────
 * Repository API — a Drizzle adapter re-implements exactly these functions.
 * ──────────────────────────────────────────────────────────────────────── */

export function findByEmail(email: string): Subscriber | undefined {
  return store.byEmail.get(email.toLowerCase());
}

export function pendingSignup(input: {
  name: string;
  email: string;
  tier: TierId | null;
  source: string;
  ipHashValue: string;
}): { subscriber: Subscriber; fresh: boolean; subscriberEmail: string } {
  const email = input.email.toLowerCase();
  const existing = store.byEmail.get(email);
  const event = (type: ConsentEventType): ConsentEvent => ({
    type,
    at: new Date().toISOString(),
    wordingVersion: consent.version,
    source: input.source,
    ipHash: input.ipHashValue,
  });

  if (existing && existing.status === "pending") {
    // Re-issue tokens & resend — idempotent double opt-in.
    store.byConfirmToken.delete(existing.confirmToken ?? "");
    store.byManageToken.delete(existing.manageToken ?? "");
    existing.confirmToken = newToken();
    existing.manageToken = newToken();
    existing.name = input.name;
    existing.tier = input.tier;
    existing.events.push(event("notification_resent"));
    store.byConfirmToken.set(existing.confirmToken, email);
    store.byManageToken.set(existing.manageToken, email);
    return { subscriber: existing, fresh: false, subscriberEmail: email };
  }

  const sub: Subscriber = {
    id: crypto.randomUUID(),
    name: input.name,
    email,
    tier: input.tier,
    status: "pending",
    source: input.source,
    wordingVersion: consent.version,
    confirmToken: newToken(),
    manageToken: newToken(),
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    unsubscribedAt: null,
    events: [event("signup_pending")],
  };
  store.byEmail.set(email, sub);
  store.byConfirmToken.set(sub.confirmToken!, email);
  store.byManageToken.set(sub.manageToken!, email);
  return { subscriber: sub, fresh: true, subscriberEmail: email };
}

export function confirmByToken(
  token: string,
  ipHashValue: string,
): "confirmed" | "already" | "invalid" {
  const email = store.byConfirmToken.get(token);
  if (!email) return "invalid";
  const sub = store.byEmail.get(email);
  if (!sub) return "invalid";
  if (sub.status === "confirmed") return "already";
  if (sub.status === "unsubscribed") {
    // Opting back in from a confirmation link after unsubscribe → keep them out.
    return "invalid";
  }
  sub.status = "confirmed";
  sub.confirmedAt = new Date().toISOString();
  sub.events.push({
    type: "confirmed",
    at: sub.confirmedAt,
    wordingVersion: sub.wordingVersion,
    source: "email-confirm",
    ipHash: ipHashValue,
  });
  return "confirmed";
}

export function unsubscribeByToken(
  token: string,
  ipHashValue: string,
): "unsubscribed" | "already" | "invalid" {
  const email = store.byManageToken.get(token) ?? store.byConfirmToken.get(token);
  if (!email) return "invalid";
  const sub = store.byEmail.get(email);
  if (!sub) return "invalid";
  if (sub.status === "unsubscribed") return "already";
  sub.status = "unsubscribed";
  sub.unsubscribedAt = new Date().toISOString();
  sub.events.push({
    type: "unsubscribed",
    at: sub.unsubscribedAt,
    wordingVersion: sub.wordingVersion,
    source: "email-one-click",
    ipHash: ipHashValue,
  });
  return "unsubscribed";
}

/** Right of access (Art. 15) — returns the record with tokens stripped. */
export function accessByEmail(email: string) {
  const sub = findByEmail(email);
  if (!sub) return null;
  const { confirmToken: _c, manageToken: _m, ...safe } = sub;
  return safe;
}

/** Right to erasure (Art. 17) — removes the record, keeps a hashed audit line. */
export function eraseByEmail(email: string, ipHashValue: string): boolean {
  const key = email.toLowerCase();
  const sub = store.byEmail.get(key);
  store.auditLog.push({
    type: "erasure_completed",
    at: new Date().toISOString(),
    wordingVersion: consent.version,
    source: sub ? "your-data-self-serve" : "your-data-not-found",
    ipHash: ipHashValue,
    emailHash: sha256(key).slice(0, 16),
  });
  if (!sub) return false;
  store.byConfirmToken.delete(sub.confirmToken ?? "");
  store.byManageToken.delete(sub.manageToken ?? "");
  store.byEmail.delete(key);
  return true;
}

/** CSV export rows — active list only (unsubscribed kept for suppression, flagged). */
export function exportRows() {
  return [...store.byEmail.values()].map((s) => ({
    name: s.name,
    email: s.email,
    tier_of_interest: s.tier ?? "",
    status: s.status,
    source: s.source,
    consent_wording_version: s.wordingVersion,
    signed_up_at: s.createdAt,
    confirmed_at: s.confirmedAt ?? "",
    unsubscribed_at: s.unsubscribedAt ?? "",
  }));
}

export function listCounts() {
  const all = [...store.byEmail.values()];
  return {
    total: all.length,
    pending: all.filter((s) => s.status === "pending").length,
    confirmed: all.filter((s) => s.status === "confirmed").length,
    unsubscribed: all.filter((s) => s.status === "unsubscribed").length,
    auditEvents: store.auditLog.length,
  };
}
