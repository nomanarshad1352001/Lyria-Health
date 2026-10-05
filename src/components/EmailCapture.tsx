"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Inbox,
  Loader2,
  MailCheck,
} from "lucide-react";
import { consent, tiers, compliance } from "@/content/copy";

type Phase =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; state: "confirm_sent" | "resent" | "already"; previewUrl?: string }
  | { kind: "error"; message: string };

const ERROR_COPY: Record<string, string> = {
  invalid_email: "Please enter a valid email address.",
  disposable_email:
    "Please use a permanent email address — temporary or disposable addresses can't be confirmed.",
  name_required: "Please tell us your name.",
  consent_required: "Please tick the consent box so we're allowed to email you.",
  rate_limited: "Too many attempts from this connection — please wait a few minutes and try again.",
  invalid_tier: "Please choose a membership tier, or “Not sure yet”.",
};

/**
 * The single CTA of the site — used in the hero and the final band.
 * Collects name + email + optional tier ONLY. No health data, ever.
 */
export default function EmailCapture({
  source,
  dark = false,
  idPrefix = "form",
}: {
  source: string;
  dark?: boolean;
  idPrefix?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    // Prefill tier from the URL (?tier=plus) when a tier card brought us here.
    const paramTier = new URLSearchParams(window.location.search).get("tier");
    if (paramTier && tiers.some((t) => t.id === paramTier)) setTier(paramTier);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPhase({ kind: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          tier: tier || null,
          source,
          consent: agreed,
          startedAt: startedAt.current,
          // Honeypot — read from the form, never state
          company: (new FormData(e.currentTarget).get("company") as string) ?? "",
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        state?: "confirm_sent" | "resent" | "already";
        error?: string;
        previewUrl?: string;
      };
      if (res.ok && data.ok) {
        setPhase({
          kind: "success",
          state: data.state ?? "confirm_sent",
          previewUrl: data.previewUrl,
        });
      } else {
        setPhase({
          kind: "error",
          message: ERROR_COPY[data.error ?? ""] ?? "Something went wrong — please try again.",
        });
      }
    } catch {
      setPhase({ kind: "error", message: "Network hiccup — please try again." });
    }
  }

  /* ── Success states ─────────────────────────────────────────────── */
  if (phase.kind === "success") {
    const isAlready = phase.state === "already";
    return (
      <div
        role="status"
        className={`rounded-3xl border p-6 sm:p-8 ${
          dark ? "border-white/15 bg-white/[0.06]" : "border-ink/10 bg-paper"
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-full ${
              dark ? "bg-sage/20 text-sage" : "bg-pine/10 text-pine"
            }`}
          >
            {isAlready ? <CheckCircle2 className="size-5" /> : <MailCheck className="size-5" />}
          </span>
          <div>
            <p className={`font-display text-2xl leading-snug ${dark ? "text-cream" : "text-ink"}`}>
              {isAlready
                ? "You're already confirmed on the list."
                : phase.state === "resent"
                  ? "We've re-sent your confirmation email."
                  : "One more step — check your inbox."}
            </p>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                dark ? "text-cream/70" : "text-ink/65"
              }`}
            >
              {isAlready
                ? "Your place is held. Founding members are invited in waiting-list order at launch."
                : "Click the confirmation link in the email we just sent and your place is held. Nothing arrives within a few minutes? Check junk, or simply submit this form again to resend."}
            </p>
            {phase.previewUrl && (
              <Link
                href={phase.previewUrl}
                className={`btn mt-5 px-5 py-2.5 text-sm ${
                  dark ? "btn-primary bg-cream text-forest hover:bg-white" : "btn-primary"
                }`}
              >
                <Inbox className="size-4" />
                Open the demo mailbox
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────────────── */
  const inputTone = dark
    ? "border-white/20 bg-white/[0.06] text-cream placeholder:text-cream/45 focus:border-sage"
    : "border-ink/15 bg-cream text-ink placeholder:text-ink/40 focus:border-pine";
  const labelTone = dark ? "text-cream/80" : "text-ink/75";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Join the Lyria Health waiting list"
      className={`rounded-3xl border p-5 sm:p-7 ${
        dark ? "border-white/15 bg-white/[0.04]" : "border-ink/10 bg-paper shadow-[0_24px_60px_-30px_rgba(14,26,20,0.25)]"
      }`}
    >
      <fieldset disabled={phase.kind === "submitting"} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor={`${idPrefix}-name`} className={`text-sm font-medium ${labelTone}`}>
              Name
            </label>
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors ${inputTone}`}
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={`${idPrefix}-email`} className={`text-sm font-medium ${labelTone}`}>
              Email
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.co.uk"
              className={`w-full rounded-xl border px-4 py-3.5 text-[15px] outline-none transition-colors ${inputTone}`}
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor={`${idPrefix}-tier`} className={`text-sm font-medium ${labelTone}`}>
            Membership interest <span className={dark ? "text-cream/45" : "text-ink/40"}>(optional)</span>
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}-tier`}
              name="tier"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className={`w-full appearance-none rounded-xl border px-4 py-3.5 pr-11 text-[15px] outline-none transition-colors ${inputTone} ${tier === "" ? (dark ? "text-cream/45" : "text-ink/40") : ""}`}
            >
              <option value="">Not sure yet</option>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.strap}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 ${dark ? "text-cream/50" : "text-ink/40"}`}
              aria-hidden
            />
          </div>
        </div>

        {/* Honeypot — invisible to humans, ignored by assistive tech */}
        <div className="hp-field" aria-hidden="true">
          <label>
            Company (leave blank)
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            id={`${idPrefix}-consent`}
            name="consent"
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-describedby={`${idPrefix}-consent-text`}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-pine"
          />
          <label
            htmlFor={`${idPrefix}-consent`}
            id={`${idPrefix}-consent-text`}
            className={`cursor-pointer text-[13px] leading-relaxed ${dark ? "text-cream/75" : "text-ink/70"}`}
          >
            {consent.text}{" "}
            <Link href="/privacy" className="u-sweep font-medium underline underline-offset-2">
              Read the Privacy Notice
            </Link>
            .
          </label>
        </div>

        {phase.kind === "error" && (
          <p
            role="alert"
            className={`rounded-xl border px-4 py-3 text-sm ${
              dark
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-[#b4653f]/40 bg-[#b4653f]/10 text-[#8a4a2c]"
            }`}
          >
            {phase.message}
          </p>
        )}

        <button
          type="submit"
          className={`btn w-full px-6 py-4 text-[15px] ${dark ? "btn-light" : "btn-primary"}`}
        >
          {phase.kind === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Joining…
            </>
          ) : (
            <>
              Join the waiting list <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>

        <p className={`text-center text-xs leading-relaxed ${dark ? "text-cream/60" : "text-ink/60"}`}>
          {consent.short} Consent wording {consent.version}.
        </p>
      </fieldset>
    </form>
  );
}
