import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { steps } from "@/lib/data";

const delays = ["", "d1", "d2"] as const;

export default function HowItWorks() {
  return (
    <section id="how" className="bg-cream px-[5vw] py-[120px]">
      <div className="mx-auto max-w-[1160px]">
        <RevealOnScroll className="mb-16">
          <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
              How it works
            </span>
          </div>
          <h2 className="max-w-[520px] font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
            Three steps to interview confidence.
          </h2>
        </RevealOnScroll>

        <div className="flex flex-wrap items-stretch gap-[22px]">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.n} delay={delays[i]} className="group relative flex-1 min-w-[260px]">
              {/* Static shadow layer: never animates, so the hover only ever moves a transform (GPU-cheap) instead of animating box-shadow (repaint-heavy). */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-lg bg-ink translate-x-2 translate-y-2"
              />
              <div className="relative h-full rounded-lg border-[2.5px] border-ink bg-white p-9 px-7 transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]">
                <div className="mb-6 select-none font-display text-[80px] font-normal leading-none tracking-tighter text-[#ede9e0]">
                  {step.n}
                </div>
                <h3 className="mb-3 text-[22px] font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-600">
                  {step.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
