import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert, Home } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Email confirmation",
  robots: { index: false },
};

const COPY: Record<string, { title: string; body: string; good: boolean }> = {
  confirmed: {
    title: "You're on the list.",
    body: "Email confirmed — double opt-in complete. Your place on the Lyria Health waiting list is held, and when registration is granted we'll invite members in order. From here you'll only receive occasional launch updates, each with a one-click unsubscribe link.",
    good: true,
  },
  already: {
    title: "Already confirmed.",
    body: "This email address was already confirmed, so nothing has changed — your place is held. You'll hear from us when invitations open.",
    good: true,
  },
  invalid: {
    title: "That link didn't work.",
    body: "Confirmation links are single-use and tied to one sign-up. It may have already been used, or the address was since removed. Re-join from the homepage and we'll send a fresh confirmation email straight away.",
    good: false,
  },
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { status } = await searchParams;
  const copy = COPY[String(status)] ?? COPY.invalid!;
  const Icon = copy.good ? CheckCircle2 : CircleAlert;

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
            <Link href="/" className="btn btn-primary px-6 py-3 text-sm">
              <Home className="size-4" aria-hidden /> Back to Lyria Health
            </Link>
            <Link href="/your-data" className="btn btn-ghost px-6 py-3 text-sm">
              Manage your data
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
