"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { FaqEntryDTO } from "@/types/marketing";

export default function FAQ({ entries }: { entries: FaqEntryDTO[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (entries.length === 0) return null;

  return (
    <section id="faq" className="bg-sand px-[5vw] py-[120px]">
      <div className="mx-auto max-w-[760px]">
        <RevealOnScroll className="mb-16">
          <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
              FAQ
            </span>
          </div>
          <h2 className="font-display text-[clamp(38px,5vw,62px)] leading-none tracking-tighter text-ink">
            Good questions.
          </h2>
        </RevealOnScroll>

        <div className="border-t-2 border-ink">
          {entries.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <RevealOnScroll key={faq.id} className="border-b-2 border-ink">
                <button
                  className="hoverable flex w-full items-center justify-between gap-4 py-[22px] text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[17px] font-semibold text-ink">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink text-lg font-bold leading-none text-ink transition-colors duration-200 ${isOpen ? "bg-mint" : "bg-transparent"
                      }`}
                  >
                    {isOpen ? "−" : "+"}
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity,padding-bottom] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    maxHeight: isOpen ? 240 : 0,
                    opacity: isOpen ? 1 : 0,
                    paddingBottom: isOpen ? 24 : 0,
                  }}
                >
                  <p className="text-base leading-relaxed text-neutral-600">
                    {faq.answer}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}