import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import Beacon from "@/components/Beacon";
import { site } from "@/content/copy";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lyria Health — Remote GP & blood biomarker membership (launching soon)",
    template: "%s · Lyria Health",
  },
  description:
    "Join the Lyria Health waiting list: one UK membership for remote GP consultations and at-home blood biomarker testing. Awaiting CQC registration — no payments, no bookings, GDPR-first double opt-in.",
  keywords: [
    "remote GP",
    "online GP UK",
    "blood biomarker testing",
    "health membership",
    "Lyria Health",
  ],
  openGraph: {
    siteName: site.name,
    title: "Lyria Health — modern healthcare, membership-simple",
    description:
      "Remote GP consultations and 50+ blood biomarkers in one calm membership. Waiting list now open — no payments taken until launch.",
    url: site.url,
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://images.pexels.com/photos/8012045/pexels-photo-8012045.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
        width: 1200,
        height: 630,
        alt: "A calm portrait — the feeling Lyria Health is designed around.",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3efe6",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: site.company,
  url: site.url,
  description:
    "Planned UK membership service for remote GP consultations and blood biomarker testing. Currently operating a waiting list only, pending CQC registration.",
  areaServed: "GB",
  email: site.emailHello,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${serif.variable}`}>
      <body className="grain bg-cream font-sans text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Beacon />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
