import Image from "next/image";
import Reveal from "@/components/Reveal";
import { biomarkers, steps } from "@/content/copy";
import { Plus } from "lucide-react";

export default function HowItWorks() {
  return (
    <>
      <section
        id="how-it-works"
        aria-labelledby="how-title"
        className="on-dark bg-forest text-cream"
      >
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-28">
          {/* Sticky intro + still-life */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="text-xs font-medium tracking-[0.2em] text-sage uppercase">
                  How it works
                </p>
                <h2
                  id="how-title"
                  className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl"
                >
                  Three steps between you and <span className="italic text-sage">calmer care.</span>
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/70">
                  Everything clinical — consultations, kits, results — will live on a separate,
                  regulated platform at launch. This site only ever holds the waiting list.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <figure className="mt-9 overflow-hidden rounded-3xl border border-white/10">
                  <Image
                    src="https://images.pexels.com/photos/7195088/pexels-photo-7195088.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=760&w=570"
                    alt="A laptop and stethoscope arranged calmly on a white table — where remote consults will happen."
                    width={570}
                    height={760}
                    sizes="(max-width: 1024px) 100vw, 34vw"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                  />
                </figure>
              </Reveal>
            </div>
          </div>

          {/* Steps */}
          <ol className="flex flex-col lg:col-span-7">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <li className="grid gap-5 border-t border-white/15 py-10 first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr] sm:gap-10 lg:py-12">
                  <span className="font-display text-5xl text-gold/90 italic sm:text-6xl">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-[1.7rem]">{s.title}</h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream/70">
                      {s.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}

            <Reveal delay={320}>
              <div className="mt-4 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <p className="text-xs font-medium tracking-[0.18em] text-sage uppercase">
                    Planned panel
                  </p>
                  <p className="mt-3 font-display text-3xl leading-tight">
                    50+ blood biomarkers, read by a GP — <span className="italic">not an app.</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-cream/65">
                    From lipids and HbA1c to ferritin and vitamin D, every result is planned to come
                    with a clinician-written explanation in plain English.
                  </p>
                </div>
                <Image
                  src="https://images.pexels.com/photos/37548861/pexels-photo-37548861.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Rows of blood sample vials waiting for analysis in a laboratory rack."
                  width={1200}
                  height={627}
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="h-full min-h-44 w-full rounded-2xl object-cover"
                />
              </div>
            </Reveal>
          </ol>
        </div>
      </section>

      {/* Biomarker marquee */}
      <div aria-hidden className="marquee border-b border-ink/10 bg-mist/60 py-4">
        <div className="marquee-track">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {biomarkers.map((b) => (
                <span
                  key={`${half}-${b}`}
                  className="flex items-center gap-6 px-6 text-[13px] font-medium tracking-[0.16em] whitespace-nowrap text-ink/60 uppercase"
                >
                  {b} <Plus className="size-3.5 text-moss" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
