import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { consent, site } from "@/content/copy";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Lyria Health collects, uses and protects waiting-list personal data — UK GDPR and PECR compliant: consent, double opt-in, cookieless analytics, deletion on request.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who we are",
    body: (
      <>
        {site.company} (“Lyria Health”, “we”) is the data controller for this website,{" "}
        <span className="font-medium text-ink">{site.domain}</span>. We are awaiting registration
        with the Care Quality Commission; until then this website operates a waiting list only and
        provides no medical services. Contact:{" "}
        <a className="u-sweep font-medium text-ink underline underline-offset-2" href={`mailto:${site.emailPrivacy}`}>
          {site.emailPrivacy}
        </a>
        . ICO registration: applied for.
      </>
    ),
  },
  {
    title: "2. What we collect",
    body: (
      <>
        Joining the waiting list collects exactly three things: your{" "}
        <span className="font-medium text-ink">name</span>, your{" "}
        <span className="font-medium text-ink">email address</span>, and — optionally — the{" "}
        <span className="font-medium text-ink">membership tier</span> you’re interested in. We
        deliberately collect no special category (health) data on this website, and the form asks
        no health questions. We also record the source surface you joined from (e.g. “hero”).
      </>
    ),
  },
  {
    title: "3. Lawful basis & the consent log",
    body: (
      <>
        We process waiting-list data under your consent (UK GDPR Article 6(1)(a)). To be able to
        demonstrate that consent, we keep a consent log for every subscriber: the timestamp, the
        exact consent wording version shown (currently {consent.version}), the source surface, and
        a one-way hash of the IP address — never the raw IP. The current consent wording is: “
        <span className="italic">{consent.text}</span>”
      </>
    ),
  },
  {
    title: "4. Double opt-in & email marketing (PECR)",
    body: (
      <>
        After you join, we send a single confirmation email. Your place is held only once you
        click the confirmation link — this double opt-in proves the address owner asked to join.
        Until confirmation we send nothing else. After confirmation we send occasional updates
        about the waiting list and launch. Every email carries an unsubscribe link: one click,
        immediate effect, no login. In production, unsubscribe URLs are also provided to mail
        clients via List-Unsubscribe / List-Unsubscribe-Post (one-click) headers (RFC 8058).
      </>
    ),
  },
  {
    title: "5. Analytics — privacy-friendly by design",
    body: (
      <>
        This site sets <span className="font-medium text-ink">no cookies</span> and uses no
        third-party trackers. We count page views ourselves, server-side, storing only aggregate
        numbers (e.g. “/membership — 12 views”). We never store IP addresses, device fingerprints
        or any identifier. Because nothing is stored on your device and no one is identifiable, no
        cookie banner is required under PECR. You can inspect the entire analytics dataset at{" "}
        <Link className="u-sweep font-medium text-ink underline underline-offset-2" href="/api/analytics">
          /api/analytics
        </Link>
        .
      </>
    ),
  },
  {
    title: "6. Storage, retention & security",
    body: (
      <>
        Data is stored encrypted in transit (TLS) and access is restricted to those who need it.
        Pending (unconfirmed) sign-ups are deleted if not confirmed. Confirmed subscribers are
        retained until launch or until you withdraw consent, whichever is sooner; unsubscribe
        requests are honoured immediately and erasure requests without undue delay, and in any
        case within one month. Consent logs are retained for the period the ICO expects consent
        to remain demonstrable, then destroyed.
      </>
    ),
  },
  {
    title: "7. Your rights",
    body: (
      <>
        You have the right to access, rectify, erase, restrict or object to processing of your
        data, and to data portability. The self-serve{" "}
        <Link className="u-sweep font-medium text-ink underline underline-offset-2" href="/your-data">
          Your data
        </Link>{" "}
        page supports access, unsubscribe (one click) and erasure; the waiting list can also be
        exported to CSV for portability. You may complain to the Information Commissioner’s Office
        (ICO, ico.org.uk) at any time.
      </>
    ),
  },
  {
    title: "8. Processors & transfers",
    body: (
      <>
        In this pre-launch build, no third-party processor receives your personal data: email
        transport is stubbed and analytics are first-party. Before launch we will appoint a
        transactional email provider under a UK GDPR-compliant data processing agreement, and this
        notice will be updated to name all processors; international transfers, if any, will be
        protected by an adequacy regulation or the UK IDTA/Addendum.
      </>
    ),
  },
  {
    title: "9. Children",
    body: (
      <>The waiting list is intended for adults and is not directed at children.</>
    ),
  },
  {
    title: "10. Changes to this notice",
    body: (
      <>
        If our practices change we will update this page and, where the change is material, email
        confirmed subscribers. Notice version {consent.version} — last reviewed January 2026.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-xs font-medium tracking-[0.2em] text-moss uppercase">Legal</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Privacy <span className="italic text-pine">Notice.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          Short on purpose. We collect three pieces of information, email you only after you’ve
          confirmed twice, and delete anything you ask us to. The detail:
        </p>
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {SECTIONS.map((s) => (
            <section key={s.title} className="py-7">
              <h2 className="font-display text-xl text-ink">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
