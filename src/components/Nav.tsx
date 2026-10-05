import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Mark from "@/components/Mark";
import { compliance, site } from "@/content/copy";

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Membership", href: "/#membership" },
  { label: "FAQ", href: "/#faq" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50">
      {/* Compliance micro-bar — always visible, never dismissable */}
      <p className="bg-forest px-4 py-1.5 text-center text-[11px] font-medium tracking-[0.14em] text-cream/85 uppercase">
        Awaiting CQC registration — waiting list only
      </p>
      <div className="border-b border-ink/10 bg-cream/85 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full"
            aria-label={`${site.name} — home`}
          >
            <Mark className="size-7 sm:size-8" />
            <span className="font-display text-xl leading-none tracking-tight text-ink sm:text-[1.35rem]">
              Lyria <span className="italic">Health</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="u-sweep text-sm font-medium text-ink/75">
                {l.label}
              </Link>
            ))}
          </div>

          <Link href="/#join" className="btn btn-primary px-4 py-2.5 text-[13px] sm:px-5 sm:text-sm">
            Join the list <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      </div>
      <span className="sr-only">{compliance.notice}</span>
    </header>
  );
}
