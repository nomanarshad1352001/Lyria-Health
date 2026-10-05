import EmailCapture from "@/components/EmailCapture";
import Reveal from "@/components/Reveal";

export default function CtaBand() {
  return (
    <section id="join" aria-labelledby="join-title" className="px-4 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="on-dark relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-forest text-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full border border-gold/30"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full border border-white/10"
          />
          <div className="relative grid items-center gap-12 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-20">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-sage uppercase">
                Founding places, in order
              </p>
              <h2
                id="join-title"
                className="mt-4 font-display text-4xl leading-[1.05] sm:text-[3.4rem]"
              >
                Be first <span className="italic text-sage">through the door.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-cream/70">
                Join today, confirm your email, and your place is held. At launch we invite the list
                in order — with founding-member pricing locked for the first year.
              </p>
              <ul className="mt-7 space-y-2.5 text-sm text-cream/70">
                <li>— Free, always</li>
                <li>— One confirmation email, then occasional launch updates</li>
                <li>— Leave or delete your data anytime, in one click</li>
              </ul>
            </div>
            <EmailCapture source="footer-band" dark idPrefix="band" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
