"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  BellOff,
  Eraser,
  Eye,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";

type Tab = "access" | "unsubscribe" | "delete";
type Result =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "error"; message: string }
  | { kind: "access"; record: Record<string, unknown> | null }
  | { kind: "unsubscribe"; manageUrl: string | null }
  | { kind: "deleted"; deleted: boolean };

const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "access", label: "View my data", icon: Eye },
  { id: "unsubscribe", label: "Unsubscribe", icon: BellOff },
  { id: "delete", label: "Delete my data", icon: Trash2 },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function DataRightsForm() {
  const [tab, setTab] = useState<Tab>("access");
  const [email, setEmail] = useState("");
  const [sure, setSure] = useState(false);
  const [result, setResult] = useState<Result>({ kind: "idle" });

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "unsubscribe" || t === "delete" || t === "access") setTab(t);
  }, []);

  async function post(url: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json() as Promise<Record<string, unknown>>;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setResult({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    setResult({ kind: "busy" });
    try {
      if (tab === "delete") {
        const data = await post("/api/waitlist/deletion", { email: email.trim(), confirm: sure });
        if (!data.ok) {
          setResult({
            kind: "error",
            message:
              data.error === "rate_limited"
                ? "Too many attempts — please wait a few minutes."
                : "Something went wrong — please try again.",
          });
        } else {
          setResult({ kind: "deleted", deleted: Boolean(data.deleted) });
        }
      } else {
        const data = await post("/api/waitlist/access", { email: email.trim() });
        if (!data.ok) {
          setResult({
            kind: "error",
            message:
              data.error === "rate_limited"
                ? "Too many attempts — please wait a few minutes."
                : "Something went wrong — please try again.",
          });
        } else if (tab === "access") {
          setResult({
            kind: "access",
            record: data.found ? (data.record as Record<string, unknown>) : null,
          });
        } else {
          setResult({
            kind: "unsubscribe",
            manageUrl: data.found ? (data.manageUrl as string) : null,
          });
        }
      }
    } catch {
      setResult({ kind: "error", message: "Network hiccup — please try again." });
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[0_24px_60px_-30px_rgba(14,26,20,0.25)]">
      {/* Tabs */}
      <div role="tablist" aria-label="Data rights" className="grid grid-cols-3 border-b border-ink/10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setResult({ kind: "idle" });
            }}
            className={`flex items-center justify-center gap-2 px-2 py-4 text-[13px] font-medium transition-colors sm:text-sm ${
              tab === id
                ? "border-b-2 border-pine bg-cream/60 text-ink"
                : "text-ink/55 hover:text-ink"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-5 p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-ink/65">
          {tab === "access" &&
            "Enter your email to see everything the waiting list holds for it: status, tier interest, source, and the full consent log — timestamped, with the exact wording version you agreed to."}
          {tab === "unsubscribe" &&
            "Enter your email and we'll surface the same one-click unsubscribe link that appears in every email we send. One click, no login, immediate effect."}
          {tab === "delete" &&
            "Enter your email to permanently erase it from the waiting list — record, tokens and tier interest. A hashed, non-identifying audit line is kept solely to evidence that the erasure happened."}
        </p>

        <div className="grid gap-1.5">
          <label htmlFor="dr-email" className="text-sm font-medium text-ink/75">
            Email address
          </label>
          <input
            id="dr-email"
            type="email"
            autoComplete="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.co.uk"
            className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-pine"
          />
        </div>

        {tab === "delete" && (
          <div className="flex items-start gap-3">
            <input
              id="dr-sure"
              type="checkbox"
              required
              checked={sure}
              onChange={(e) => setSure(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-pine"
            />
            <label htmlFor="dr-sure" className="cursor-pointer text-[13px] leading-relaxed text-ink/70">
              I understand this permanently erases my waiting-list record and cannot be undone.
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={result.kind === "busy" || (tab === "delete" && !sure)}
          className="btn btn-primary w-full px-6 py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {result.kind === "busy" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Working…
            </>
          ) : (
            <>
              {tab === "access" && (
                <>
                  <Eye className="size-4" aria-hidden /> Show my data
                </>
              )}
              {tab === "unsubscribe" && (
                <>
                  <BellOff className="size-4" aria-hidden /> Find my unsubscribe link
                </>
              )}
              {tab === "delete" && (
                <>
                  <Eraser className="size-4" aria-hidden /> Erase my data
                </>
              )}
            </>
          )}
        </button>

        {/* Results */}
        <div aria-live="polite">
          {result.kind === "error" && (
            <p role="alert" className="rounded-xl border border-[#b4653f]/40 bg-[#b4653f]/10 px-4 py-3 text-sm text-[#8a4a2c]">
              {result.message}
            </p>
          )}

          {result.kind === "access" &&
            (result.record ? (
              <div className="rounded-2xl border border-ink/10 bg-ink p-5">
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-sage uppercase">
                  <ShieldCheck className="size-4" aria-hidden /> Record (tokens stripped)
                </p>
                <pre className="max-h-96 overflow-auto text-[12.5px] leading-relaxed break-all whitespace-pre-wrap text-cream/85">
                  {JSON.stringify(result.record, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink/70">
                We hold nothing for that address — nothing to access, nothing to delete.
              </p>
            ))}

          {result.kind === "unsubscribe" &&
            (result.manageUrl ? (
              <div className="rounded-2xl border border-ink/10 bg-cream p-5">
                <p className="text-sm leading-relaxed text-ink/70">
                  Your one-click unsubscribe link (identical to the one in every email):
                </p>
                <a href={result.manageUrl} className="btn btn-primary mt-4 px-6 py-3 text-sm">
                  <BellOff className="size-4" aria-hidden /> Unsubscribe {email.trim()} now
                </a>
              </div>
            ) : (
              <p className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink/70">
                That address isn’t on the waiting list, so there’s nothing to unsubscribe.
              </p>
            ))}

          {result.kind === "deleted" && (
            <p className="rounded-xl border border-pine/30 bg-pine/10 px-4 py-3 text-sm text-pine">
              {result.deleted
                ? "Erasure complete. The waiting list no longer holds anything for that address; a hashed audit line evidences this request."
                : "Nothing was held for that address, so nothing needed erasing. Your request has still been logged."}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
