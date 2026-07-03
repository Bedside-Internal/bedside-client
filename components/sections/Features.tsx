import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { features, type Feature } from "@/lib/data";

const delays = ["", "d1", "d2"] as const;

const accentHex: Record<Feature["accent"], string> = {
  mint: "#3BBA9C",
  coral: "#E85D4A",
  amber: "#F9A03F",
  violet: "#7C6AF7",
};

export default function Features() {
  return (
    <section id="features" className="bg-sand px-[5vw] py-[120px]">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <RevealOnScroll>
            <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
                Every format
              </span>
            </div>
            <h2 className="max-w-[460px] font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
              Six formats. Zero extra tabs.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay="d1">
            <p className="max-w-[320px] text-base leading-relaxed text-neutral-600">
              Most tools charge per track. We give you everything — all
              formats, one subscription.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <RevealOnScroll key={feature.label} delay={delays[i % 3]} className="group relative">
              {/* Static shadow layer: never animates, so hover only moves a transform (GPU-cheap) instead of animating box-shadow (repaint-heavy). */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-lg bg-ink translate-x-[9px] translate-y-[9px]"
              />
              <div
                className="relative h-full rounded-lg border-[2.5px] border-t-[5px] border-ink bg-white p-7 transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]"
                style={{ borderTopColor: accentHex[feature.accent] }}
              >
                <div
                  className="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink"
                  style={{ background: accentHex[feature.accent] }}
                />
                <h3 className="mb-2.5 mt-3.5 text-[19px] font-bold tracking-tight text-ink">
                  {feature.label}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {feature.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
