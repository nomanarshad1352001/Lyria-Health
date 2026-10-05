import Image from "next/image";
import { Lock, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import EmailCapture from "@/components/EmailCapture";
import Reveal from "@/components/Reveal";
import { compliance, hero, stats } from "@/content/copy";

const bulletIcons = [ShieldCheck, Lock, MailCheck];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* soft eucalyptus glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[34rem] rounded-full bg-mist/70 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-24">
        {/* Copy + form */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-paper px-4 py-1.5 text-xs font-medium tracking-[0.12em] text-ink/70 uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 animate-pulse-dot rounded-full bg-moss" />
              </span>
              {compliance.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1
              id="hero-title"
              className="mt-7 font-display text-[clamp(2.6rem,10.5vw,4.6rem)] leading-[0.98] tracking-[-0.015em] text-ink"
            >
              {hero.titleA}
              <br />
              <span className="text-pine">{hero.titleB}</span>
              <br />
              <span className="italic">{hero.titleItalic}</span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-ink/70">{hero.lead}</p>
          </Reveal>

          <Reveal delay={240}>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5" aria-label="Our promises">
              {hero.bullets.map((b, i) => {
                const Icon = bulletIcons[i] ?? Sparkles;
                return (
                  <li key={b} className="flex items-center gap-2 text-sm font-medium text-ink/75">
                    <Icon className="size-4 text-moss" aria-hidden /> {b}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={310} className="mt-9 max-w-xl">
            <EmailCapture source="hero" idPrefix="hero" />
            <p className="mt-4 text-xs leading-relaxed text-ink/65">{compliance.notice}</p>
          </Reveal>
        </div>

        {/* Imagery */}
        <div className="relative lg:col-span-5">
          <Reveal delay={200} className="relative">
            <div
              aria-hidden
              className="absolute -top-6 -right-6 hidden size-28 rounded-full border border-gold/60 lg:block"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 shadow-[0_40px_80px_-40px_rgba(14,26,20,0.45)]">
              <Image
                src="https://images.pexels.com/photos/8012045/pexels-photo-8012045.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
                alt={hero.imageAlt}
                width={800}
                height={1200}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <p className="absolute top-4 left-4 rounded-full bg-cream/90 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-forest uppercase backdrop-blur">
                Awaiting CQC registration
              </p>
            </div>

            {/* floating consult card */}
            <div className="absolute -bottom-10 -left-4 hidden w-60 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_24px_50px_-24px_rgba(14,26,20,0.5)] sm:block lg:-left-10">
              <Image
                src="https://images.pexels.com/photos/7195429/pexels-photo-7195429.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=480"
                alt="A GP holding a video consultation on a laptop (illustrative)."
                width={480}
                height={300}
                sizes="240px"
                className="h-28 w-full object-cover"
              />
              <p className="px-4 py-3 text-[13px] leading-snug font-medium text-ink/80">
                GP video consult — planned 15 minutes, from your sofa.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-y border-ink/10 bg-paper">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="px-2 text-center lg:px-6">
                <dt className="order-2 mx-auto mt-2 max-w-[15rem] text-[13px] leading-snug text-ink/60">
                  {s.label}
                </dt>
                <dd className="order-1 font-display text-4xl text-forest sm:text-5xl">
                  {s.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
