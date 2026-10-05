import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import { tiers } from "@/content/copy";

export default function Tiers() {
  return (
    <section id="membership" aria-labelledby="tiers-title" className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-moss uppercase">
            Planned membership
          </p>
          <h2
            id="tiers-title"
            className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl"
          >
            One membership, <span className="italic text-pine">three depths.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/65">
            Everything below is planned and indicative — final pricing and contents are confirmed
            before launch, and waiting-list members see them first. No payments are taken anywhere
            on this site.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.id} delay={i * 100} className="h-full">
              <article
                className={`flex h-full flex-col rounded-[1.75rem] border p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 sm:p-8 ${
                  t.highlight
                    ? "on-dark border-forest bg-forest text-cream shadow-[0_36px_70px_-36px_rgba(12,41,32,0.7)]"
                    : "border-ink/10 bg-paper"
                }`}
              >
                {t.highlight && (
                  <p className="mb-5 w-fit rounded-full bg-gold/90 px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] text-forest uppercase">
                    Our recommendation
                  </p>
                )}
                <h3 className="font-display text-3xl">{t.name}</h3>
                <p className={`mt-1 text-sm ${t.highlight ? "text-cream/70" : "text-ink/60"}`}>
                  {t.strap}
                </p>
                <p
                  className={`mt-5 text-[13px] font-medium ${
                    t.highlight ? "text-gold" : "text-moss"
                  }`}
                >
                  {t.priceNote}
                </p>
                <ul className="mt-6 grid flex-1 content-start gap-3.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14.5px] leading-snug">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${t.highlight ? "text-sage" : "text-moss"}`}
                        aria-hidden
                      />
                      <span className={t.highlight ? "text-cream/85" : "text-ink/80"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/#join?tier=${t.id}`}
                  className={`btn mt-8 w-full px-5 py-3.5 text-sm ${
                    t.highlight ? "btn-light" : "btn-ghost"
                  }`}
                >
                  Register interest <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink/60">
            Consultations, test kits and results will be delivered on a separate, regulated
            clinical platform after registration is granted — never through this website.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
