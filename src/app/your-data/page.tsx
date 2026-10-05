import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DataRightsForm from "@/components/DataRightsForm";

export const metadata: Metadata = {
  title: "Your data — access, unsubscribe, delete",
  description:
    "Exercise your UK GDPR rights: view the data Lyria Health holds about you, unsubscribe in one click, or request complete erasure.",
};

export default function YourDataPage() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-xs font-medium tracking-[0.2em] text-moss uppercase">
          Your data, your call
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Three rights, <span className="italic text-pine">one page.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          Under UK GDPR you can see everything we hold about you, withdraw consent (unsubscribe),
          or have your data erased entirely. In this build those actions work instantly, in-stream;
          at launch they’ll be confirmed via a link emailed to the address concerned — proving
          it’s really you.
        </p>
        <div className="mt-10">
          <DataRightsForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
