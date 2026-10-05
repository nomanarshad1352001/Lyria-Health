import type { Metadata } from "next";
import Link from "next/link";
import { BellOff, CircleAlert, Home } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false },
};

const COPY: Record<string, { title: string; body: string; good: boolean }> = {
  unsubscribed: {
    title: "You've been unsubscribed.",
    body: "One click, done — you'll receive no further emails from us. Your address is kept only as a suppression entry so we never email you again by mistake. If you'd like it erased completely, use the data page below.",
    good: true,
  },
  already: {
    title: "Already unsubscribed.",
    body: "This address was already opted out, so nothing has changed. You won't hear from us again unless you choose to re-join.",
    good: true,
  },
  invalid: {
    title: "That link didn't work.",
    body: "Unsubscribe links are tied to a specific sign-up and may have already been used. You can manage or remove your details from the data page instead.",
    good: false,
  },
};

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { status } = await searchParams;
  const copy = COPY[String(status)] ?? COPY.invalid!;
  const Icon = copy.good ? BellOff : CircleAlert;

  return (
    <>
      <Nav />
      <main id="main" className="grid min-h-[70vh] place-items-center px-4 py-20">
        <div className="w-full max-w-xl rounded-3xl border border-ink/10 bg-paper p-8 text-center shadow-[0_24px_60px_-30px_rgba(14,26,20,0.25)] sm:p-12">
          <span
            className={`mx-auto grid size-14 place-items-center rounded-full ${
              copy.good ? "bg-pine/10 text-pine" : "bg-gold/15 text-[#8a6a2f]"
            }`}
          >
            <Icon className="size-7" aria-hidden />
          </span>
          <h1 className="mt-6 font-display text-4xl text-ink">{copy.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{copy.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/your-data?tab=delete" className="btn btn-primary px-6 py-3 text-sm">
              Delete my data completely
            </Link>
            <Link href="/" className="btn btn-ghost px-6 py-3 text-sm">
              <Home className="size-4" aria-hidden /> Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
