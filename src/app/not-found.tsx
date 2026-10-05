import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="grid min-h-[60vh] place-items-center px-4 py-20 text-center">
        <div>
          <p className="font-display text-7xl text-pine italic sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-3xl text-ink">This page isn’t on the list.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink/65">
            The link may be old or mistyped. The waiting list, however, is exactly where you’d
            expect it.
          </p>
          <Link href="/" className="btn btn-primary mt-8 px-6 py-3 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
