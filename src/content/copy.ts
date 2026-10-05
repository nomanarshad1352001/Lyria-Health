/**
 * ─────────────────────────────────────────────────────────────────────────
 * LYRIA HEALTH — SINGLE SOURCE OF TRUTH FOR ALL SITE COPY
 * ─────────────────────────────────────────────────────────────────────────
 * The founder supplies all copy and compliance wording. Everything textual
 * lives in this file so supplied wording can be pasted in verbatim and
 * reviewed in one place.
 *
 * ⚠ CONSENT WORDING: if `consent.text` changes, you MUST bump
 * `consent.version`. The version is written to the consent log for every
 * sign-up so we can prove exactly what each subscriber agreed to.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Lyria Health",
  domain: "lyriahealth.co.uk",
  url: "https://lyriahealth.co.uk",
  emailPrivacy: "privacy@lyriahealth.co.uk",
  emailHello: "hello@lyriahealth.co.uk",
  company: "Lyria Health Ltd",
  tagline: "Remote GP consultations & blood biomarker testing",
};

/** GDPR / PECR consent wording + version (goes into the consent log). */
export const consent = {
  version: "v2026.1",
  text: "I would like to join the Lyria Health waiting list and receive email updates about the service and its launch. I understand I can withdraw my consent at any time, free of charge, using the unsubscribe link in every email, and that my details are processed in accordance with the Privacy Notice.",
  short: "Updates about the waiting list and launch — unsubscribe anytime, in one click.",
};

/** Regulatory compliance positioning — this is a waiting list ONLY. */
export const compliance = {
  eyebrow: "Waiting list now open · UK",
  notice:
    "Lyria Health is not yet registered with the Care Quality Commission (CQC) and is not currently providing medical services. This website operates a waiting list only: no consultations, bookings or payments are taken here, and nothing on this page constitutes medical advice.",
  footerNote:
    "This site is a waiting list for a planned service. Lyria Health Ltd is awaiting regulatory registration and does not currently provide medical services, diagnoses or advice. No payments are taken. Consultations will be delivered on a separate, regulated clinical platform at launch.",
  ico: "Registered with the Information Commissioner's Office (ICO) as a data controller (registration pending).",
};

export const hero = {
  eyebrowTop: "Remote GP + biomarker membership",
  titleA: "Modern healthcare,",
  titleB: "membership-simple.",
  titleItalic: "built around you.",
  lead: "Video consultations with UK-registered GPs and at-home blood biomarker testing — one calm membership. We're finalising our regulatory registration, so today you can simply reserve your place.",
  bullets: [
    "No payments taken — ever, until launch",
    "No health data collected on this site",
    "Double opt-in emails · one-click unsubscribe",
  ],
  imageAlt:
    "A calm portrait of a woman resting indoors with her eyes closed — the feeling Lyria is designed around.",
};

export const stats = [
  { value: "50+", label: "blood biomarkers planned per panel" },
  { value: "15 min", label: "typical planned GP video consult" },
  { value: "100%", label: "UK-registered clinicians, at launch" },
  { value: "0", label: "health questions asked on this site" },
];

export const steps = [
  {
    n: "01",
    title: "Join the waiting list",
    body: "Leave your name and email — that's all we ask. Confirm via the double opt-in email and your place is held.",
  },
  {
    n: "02",
    title: "Get your founding invite",
    body: "When registration is granted, waiting-list members are invited first, in order, with founding-member pricing locked for year one.",
  },
  {
    n: "03",
    title: "Meet your GP, from home",
    body: "On the separate clinical platform: video consult a UK-registered GP and receive an at-home biomarker kit by post, with results explained in plain English.",
  },
];

export type Tier = {
  id: "essential" | "plus" | "complete";
  name: string;
  strap: string;
  priceNote: string;
  features: string[];
  highlight?: boolean;
};

export const tiers: Tier[] = [
  {
    id: "essential",
    name: "Essential",
    strap: "GP access, simplified",
    priceNote: "Indicative from £25/mo — pricing confirmed pre-launch",
    features: [
      "2 remote GP consultations per year (planned)",
      "Unlimited follow-up messaging (planned)",
      "Annual health review letter (planned)",
      "Member pricing on biomarker panels",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    strap: "GP care + annual biomarkers",
    priceNote: "Indicative from £49/mo — pricing confirmed pre-launch",
    highlight: true,
    features: [
      "4 remote GP consultations per year (planned)",
      "1 annual 50+ biomarker panel, at home (planned)",
      "Results reviewed & explained by a GP (planned)",
      "Priority booking windows at launch",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    strap: "The full picture, quarterly",
    priceNote: "Indicative from £95/mo — pricing confirmed pre-launch",
    features: [
      "Unlimited remote GP consultations (planned)",
      "Quarterly 50+ biomarker panels (planned)",
      "Personal trend report & annual deep-dive (planned)",
      "Founding-member rate locked for year one",
    ],
  },
];

export const biomarkers = [
  "Full blood count",
  "Lipid profile",
  "HbA1c",
  "Ferritin",
  "Vitamin D",
  "Vitamin B12",
  "Thyroid (TSH, T4)",
  "Liver function",
  "Kidney function",
  "hs-CRP",
  "Testosterone",
  "Folate",
];

export const faqs = [
  {
    q: "Is Lyria Health available yet?",
    a: "Not yet. We are awaiting regulatory registration before we can provide any medical services. This website operates a waiting list only — joining it reserves your place and your founding-member pricing, but no consultations, bookings or payments are available or taken here.",
  },
  {
    q: "What personal data do you collect, and why?",
    a: "Only your name, email address and (optionally) the membership tier you're most interested in. We deliberately collect no health data on this site. Your details are used solely to email you about the waiting list and launch, under your consent (UK GDPR Article 6(1)(a)). We log the wording you agreed to, with a timestamp, so we can demonstrate that consent.",
  },
  {
    q: "Why do I have to confirm my email (double opt-in)?",
    a: "Double opt-in proves the person who signed up owns the email address. After you join, we send a single confirmation email — your place is only held once you click the link in it. You'll then receive occasional launch updates, and every email carries a one-click unsubscribe link, in line with PECR.",
  },
  {
    q: "How do I unsubscribe or delete my data?",
    a: "Every email has a one-click unsubscribe link — no login, no questions. For full erasure (right to be forgotten) or a copy of the data we hold about you, use the “Your data” page linked in the footer, or email privacy@lyriahealth.co.uk. Erasure requests are actioned without undue delay.",
  },
  {
    q: "Will I be asked to pay anything?",
    a: "No. We take no payments whatsoever on this site. When registration is granted, members are invited in waiting-list order and can choose to subscribe on our separate clinical platform; the waiting list itself always remains free.",
  },
  {
    q: "What are blood biomarkers?",
    a: "Biomarkers are measurable indicators in your blood — such as ferritin, vitamin D, HbA1c or cholesterol — that, once the service launches, help you and your GP understand your health over time. Our planned panels cover 50+ markers, with results explained in plain English by a clinician.",
  },
  {
    q: "How is my privacy protected?",
    a: "We follow UK GDPR and PECR: explicit consent, double opt-in, data minimisation (three fields, no health data), encryption in transit, a consent log recording the exact wording and timestamp, privacy-friendly analytics with no cookies and no IP storage, and deletion on request. Full detail is in the Privacy Notice.",
  },
];

export const footer = {
  blurb:
    "One membership for remote GP care and blood biomarker insight. Planned for the UK — join the waiting list and be first through the door.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "Membership", href: "/#membership" },
        { label: "FAQ", href: "/#faq" },
        { label: "Join the list", href: "/#join" },
      ],
    },
    {
      title: "Trust & privacy",
      links: [
        { label: "Privacy Notice", href: "/privacy" },
        { label: "Your data & deletion", href: "/your-data" },
        { label: "Unsubscribe", href: "/your-data?tab=unsubscribe" },
        { label: "Data export (CSV)", href: "/api/waitlist/export" },
      ],
    },
  ],
};
