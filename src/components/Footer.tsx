import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Mark from "@/components/Mark";
import { compliance, consent, footer, site } from "@/content/copy";

export default function Footer() {
  return (
    <footer className="on-dark bg-ink text-cream/80" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-full">
            <Mark className="size-9" />
            <span className="font-display text-2xl text-cream">
              Lyria <span className="italic">Health</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/60">{footer.blurb}</p>
          <p className="mt-6 max-w-md border-l-2 border-gold/60 pl-4 text-[13px] leading-relaxed text-cream/55">
            {compliance.footerNote}
          </p>
          <p className="mt-4 text-xs text-cream/55">{compliance.ico}</p>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.18em] text-cream/45 uppercase">
              {col.title}
            </p>
            <ul className="mt-5 space-y-3.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="u-sweep inline-flex items-center gap-1 text-sm text-cream/75"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-cream/45 uppercase">
            Transparency
          </p>
          <ul className="mt-5 space-y-3.5 text-sm text-cream/75">
            <li>
              <Link href="/mailbox" className="u-sweep inline-flex items-center gap-1">
                Demo mailbox <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/api/analytics" className="u-sweep inline-flex items-center gap-1">
                Analytics (aggregate only) <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.emailPrivacy}`} className="u-sweep">
                {site.emailPrivacy}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-cream/55">
            Consent wording {consent.version} · analytics are cookieless and store aggregate counts
            only.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream/55 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.company} — {site.domain}. All rights reserved.
          </p>
          <p>Designed for clarity. Built for compliance.</p>
        </div>
      </div>
    </footer>
  );
}
