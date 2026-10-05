import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Tiers from "@/components/Tiers";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Tiers />

        <section
          id="faq"
          aria-labelledby="faq-title"
          className="border-y border-ink/10 bg-paper"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <Reveal className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-moss uppercase">
                  Straight answers
                </p>
                <h2
                  id="faq-title"
                  className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl"
                >
                  Questions, <span className="italic text-pine">answered.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-ink/60">
                Including the two questions a healthcare site should never dodge: what we do with
                your data, and when we can actually see you.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Faq />
            </Reveal>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
