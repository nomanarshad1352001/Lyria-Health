"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/content/copy";

export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="group flex w-full items-center justify-between gap-6 px-1 py-6 text-left sm:py-7"
              >
                <span className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-pine sm:text-[1.35rem]">
                  {item.q}
                </span>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    isOpen
                      ? "rotate-45 border-pine bg-pine text-cream"
                      : "border-ink/20 text-ink group-hover:border-ink"
                  }`}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl px-1 pb-7 text-[15px] leading-relaxed text-ink/70">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
