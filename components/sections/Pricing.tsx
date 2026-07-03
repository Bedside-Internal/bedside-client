import RevealOnScroll from "@/components/ui/RevealOnScroll";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-cream px-[5vw] py-[120px]">
      <div className="mx-auto max-w-[1000px]">
        <RevealOnScroll className="mb-[72px] text-center">
          <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
              Pricing
            </span>
          </div>
          <h2 className="font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
            Simple. No tricks.
          </h2>
        </RevealOnScroll>

        <div className="flex flex-wrap items-stretch gap-6">
          {/* Free */}
          <RevealOnScroll className="flex-1 min-w-[280px]">
            <div className="h-full rounded-[10px] border-[2.5px] border-ink bg-white p-11 px-9 shadow-hard transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]">
              <div className="mb-5 text-[13px] font-bold uppercase tracking-wider text-neutral-400">
                Free
              </div>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="font-display text-[64px] leading-none tracking-tighter text-ink">
                  $0
                </span>
              </div>
              <div className="mb-9 text-sm text-neutral-400">forever</div>
              <div className="mb-9 flex flex-col gap-3.5 border-t-2 border-[#f0ede6] pt-7">
                <div className="flex items-center gap-2.5 text-[15px] text-neutral-600">
                  <span className="font-bold text-mint">✓</span> 3 sessions /
                  month
                </div>
                <div className="flex items-center gap-2.5 text-[15px] text-neutral-600">
                  <span className="font-bold text-mint">✓</span> MMI +
                  Traditional formats
                </div>
                <div className="flex items-center gap-2.5 text-[15px] text-neutral-300">
                  <span className="font-bold text-neutral-200">✗</span> Basic
                  feedback only
                </div>
                <div className="flex items-center gap-2.5 text-[15px] text-neutral-300">
                  <span className="font-bold text-neutral-200">✗</span> No
                  session history
                </div>
              </div>
              <MagneticButton
                href="#"
                className="block w-full rounded-md border-[2.5px] border-ink py-4 text-center text-base font-semibold text-ink shadow-hard transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                Start free →
              </MagneticButton>
            </div>
          </RevealOnScroll>

          {/* Pro */}
          <RevealOnScroll delay="d1" className="flex-1 min-w-[280px]">
            <div className="relative h-full rounded-[10px] border-[2.5px] border-ink bg-mint p-11 px-9 shadow-hard transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-coral px-3.5 py-1 text-xs font-bold text-white">
                Most popular
              </div>
              <div className="mb-5 text-[13px] font-bold uppercase tracking-wider text-ink/60">
                Pro
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-display text-[64px] leading-none tracking-tighter text-ink">
                  $12
                </span>
                <span className="text-lg font-semibold text-ink/60">/mo</span>
              </div>
              <div className="mb-9 text-sm text-ink/60">
                or $89/year — save 38%
              </div>
              <div className="mb-9 flex flex-col gap-3.5 border-t-2 border-ink/20 pt-7">
                {[
                  "Unlimited sessions",
                  "All 6 interview formats",
                  "Detailed feedback + scoring",
                  "Session history & progress",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-[15px] font-medium text-ink"
                  >
                    <span className="font-bold">✓</span> {item}
                  </div>
                ))}
              </div>
              <MagneticButton
                href="#"
                className="block w-full rounded-md border-[2.5px] border-ink bg-ink py-4 text-center text-base font-bold text-cream shadow-hard-mint transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#3BBA9C] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                Get unlimited access →
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
