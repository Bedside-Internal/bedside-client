import RevealOnScroll from "@/components/ui/RevealOnScroll";
import MagneticButton from "@/components/ui/MagneticButton";

export default function DarkCTA() {
  return (
    <section className="relative overflow-hidden bg-ink px-[5vw] py-[120px] text-center">
      <div className="pointer-events-none absolute -right-10 -top-10 text-mint opacity-[0.08]">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
          <path
            d="M150 0L163.5 136.5L300 150L163.5 163.5L150 300L136.5 163.5L0 150L136.5 136.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-8 -left-8 text-mint opacity-[0.06]">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 0L109 91L200 100L109 109L100 200L91 109L0 100L91 91Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[900px]">
        <RevealOnScroll>
          <h2 className="mb-8 font-display text-[clamp(44px,7vw,100px)] leading-[0.94] tracking-tighter text-cream">
            One tool.
            <br />
            Every format.
            <br />
            <em className="text-mint not-italic font-normal italic">
              No more open tabs.
            </em>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay="d1">
          <p className="mx-auto mb-12 max-w-[440px] text-lg leading-relaxed text-cream/55">
            Stop wasting prep time hunting across platforms. PrepAce has
            everything — start a session in seconds.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay="d2">
          <MagneticButton
            href="#"
            className="rounded-md border-[2.5px] border-ink bg-mint px-7 py-4 text-base font-bold text-ink shadow-hard-mint transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#3BBA9C] hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Start practicing free →
          </MagneticButton>
        </RevealOnScroll>
      </div>
    </section>
  );
}
