import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, Inbox, MailQuestion } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getOutbox } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo mailbox",
  robots: { index: false },
};

/**
 * DEMO ONLY — the transactional email transport in this build is a stub
 * (no SMTP). This page renders the in-memory outbox so the double opt-in
 * flow can be clicked end-to-end. Remove once EMAIL_TRANSPORT=live.
 */
export default async function MailboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { to } = await searchParams;
  const filter = typeof to === "string" ? to.toLowerCase() : null;
  const entries = getOutbox().filter((e) => !filter || e.to === filter);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-[#7a5c24] uppercase">
          <FlaskConical className="size-3.5" aria-hidden /> Demo transport — no real email sent
        </p>
        <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">The demo mailbox.</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          In production these messages are delivered by a transactional email provider (with
          <span className="font-medium"> List-Unsubscribe </span>
          headers set). Here they’re rendered in-browser so you can test confirmation and one-click
          unsubscribe exactly as a subscriber would.
          {filter && (
            <>
              {" "}
              Showing mail for <span className="font-medium text-ink">{filter}</span>.
            </>
          )}
        </p>

        {entries.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-ink/10 bg-paper p-10 text-center">
            <MailQuestion className="mx-auto size-8 text-ink/35" aria-hidden />
            <p className="mt-4 font-display text-2xl text-ink">Nothing here yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
              {filter
                ? "No email has been sent to that address in this session. Join the waiting list and the confirmation email will appear."
                : "Join the waiting list and the confirmation email will appear here."}
            </p>
            <Link href="/#join" className="btn btn-primary mt-6 px-6 py-3 text-sm">
              <Inbox className="size-4" aria-hidden /> Join the waiting list
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-8">
            {entries.map((e) => (
              <li key={e.id} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{e.subject}</p>
                    <p className="mt-0.5 text-xs text-ink/55">
                      From: Lyria Health &lt;hello@lyriahealth.co.uk&gt; · To: {e.toName} &lt;
                      {e.to}&gt;
                    </p>
                  </div>
                  <p className="text-xs text-ink/45">{new Date(e.createdAt).toLocaleString("en-GB")}</p>
                </div>
                <iframe
                  title={`Email: ${e.subject}`}
                  srcDoc={e.html}
                  sandbox=""
                  className="h-[480px] w-full bg-cream sm:h-[560px]"
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
