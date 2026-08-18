"use client";

import { useState } from "react";
import clsx from "clsx";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import MagneticButton from "@/components/ui/MagneticButton";
import type { PricingTierDTO } from "@/types/marketing";

function TierCard({ tier, delay }: { tier: PricingTierDTO; delay?: "d1" | "d2" }) {
  const cycles = tier.billingCycles;
  const [selectedMonths, setSelectedMonths] = useState<number | null>(
    tier.defaultCycleMonths ?? cycles[0]?.months ?? null,
  );
  const active = cycles.find((c) => c.months === selectedMonths) ?? cycles[0];

  const displayPrice = active ? active.price : tier.price;
  const displayPeriod = active ? `/ ${active.months} mo` : tier.periodLabel;
  const displayNote = active
    ? `$${active.perMonth.toFixed(2)}/mo billed once${active.savingsPct ? ` — save ${active.savingsPct}%` : ""}`
    : tier.priceNote;
  const buttonLabel = active
    ? tier.buttonLabel.replace(/\d+-month/, `${active.months}-month`)
    : tier.buttonLabel;

  return (
    <RevealOnScroll delay={delay} className="flex-1 min-w-[280px]">
      <div
        className={clsx(
          "relative h-full rounded-[10px] border-[2.5px] border-ink p-11 px-9 shadow-hard transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]",
          tier.featured ? "bg-mint" : "bg-white",
        )}
      >
        {tier.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-coral px-3.5 py-1 text-xs font-bold text-white">
            {tier.badge}
          </div>
        )}
        <div
          className={clsx(
            "mb-5 text-[13px] font-bold uppercase tracking-wider",
            tier.featured ? "text-ink/60" : "text-neutral-400",
          )}
        >
          {tier.title}
        </div>

        <div className="mb-1 flex items-baseline gap-1">
          <span className="font-display text-[64px] leading-none tracking-tighter text-ink">
            ${displayPrice.toFixed(active ? 2 : 0)}
          </span>
          {displayPeriod && (
            <span className={clsx("text-lg font-semibold", tier.featured ? "text-ink/60" : "text-neutral-400")}>
              {displayPeriod}
            </span>
          )}
        </div>
        <div className={clsx("mb-7 text-sm", tier.featured ? "text-ink/60" : "text-neutral-400")}>
          {displayNote}
        </div>

        {cycles.length > 1 && (
          <div className="mb-9 grid grid-cols-3 gap-1.5 rounded-xl border-2 border-ink/15 bg-white/40 p-1.5">
            {cycles.map((cycle) => (
              <button
                key={cycle.id}
                type="button"
                onClick={() => setSelectedMonths(cycle.months)}
                className={clsx(
                  "relative flex flex-col items-center gap-0.5 rounded-lg py-2.5 text-center transition-colors",
                  cycle.months === selectedMonths
                    ? "bg-ink text-cream"
                    : "text-ink/60 hover:bg-white/60 hover:text-ink",
                )}
              >
                {cycle.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-amber px-2 py-[1px] text-[9px] font-bold text-ink">
                    {cycle.badge}
                  </span>
                )}
                <span className="text-[13px] font-bold">{cycle.months} mo</span>
                <span
                  className={clsx(
                    "text-[11px] font-medium",
                    cycle.months === selectedMonths ? "text-cream/70" : "text-ink/50",
                  )}
                >
                  ${cycle.perMonth.toFixed(2)}/mo
                </span>
              </button>
            ))}
          </div>
        )}

        <div
          className={clsx(
            "mb-9 flex flex-col gap-3.5 border-t-2 pt-7",
            tier.featured ? "border-ink/20" : "border-[#f0ede6]",
          )}
        >
          {tier.features.map((f) => (
            <div
              key={f.id}
              className={clsx(
                "flex items-center gap-2.5 text-[15px]",
                tier.featured
                  ? "font-medium text-ink"
                  : f.included
                    ? "text-neutral-600"
                    : "text-neutral-300",
              )}
            >
              <span
                className={clsx(
                  "font-bold",
                  tier.featured ? "" : f.included ? "text-mint" : "text-neutral-200",
                )}
              >
                {f.included ? "✓" : "✗"}
              </span>
              {f.label}
            </div>
          ))}
        </div>

        <MagneticButton
          href="#"
          className={clsx(
            "block w-full rounded-md border-[2.5px] border-ink py-4 text-center text-base font-semibold shadow-hard transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:translate-x-[3px] hover:translate-y-[3px]",
            tier.featured
              ? "bg-ink font-bold text-cream shadow-hard-mint hover:shadow-[2px_2px_0_#3BBA9C]"
              : "text-ink hover:shadow-[2px_2px_0_#1a1a1a]",
          )}
        >
          {buttonLabel}
        </MagneticButton>
      </div>
    </RevealOnScroll>
  );
}

export default function Pricing({ tiers }: { tiers: PricingTierDTO[] }) {
  if (tiers.length === 0) return null;

  return (
    <section id="pricing" className="bg-cream px-[5vw] py-[120px]">
      <div className="mx-auto max-w-[1000px]">
        <RevealOnScroll className="mb-[72px] text-center">
          <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint">Pricing</span>
          </div>
          <h2 className="font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
            Simple. No tricks.
          </h2>
        </RevealOnScroll>

        <div className="flex flex-wrap items-stretch gap-6">
          {tiers.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} delay={i === 0 ? undefined : i === 1 ? "d1" : "d2"} />
          ))}
        </div>
      </div>
    </section>
  );
}