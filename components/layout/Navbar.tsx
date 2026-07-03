import MagneticButton from "@/components/ui/MagneticButton";

const links = [
  { href: "#features", label: "Formats" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b-2 border-ink bg-cream px-[5vw]">
      <a href="#" className="flex items-center gap-2.5 text-ink no-underline">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 0L11.8 8.2L20 10L11.8 11.8L10 20L8.2 11.8L0 10L8.2 8.2Z"
            fill="#3BBA9C"
          />
        </svg>
        <span className="font-display text-[22px] tracking-tight">
          PrepAce
        </span>
      </a>

      <div className="hidden items-center gap-7 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hoverable text-sm font-medium text-neutral-500 transition-colors hover:text-ink"
          >
            {l.label}
          </a>
        ))}
        <MagneticButton
          href="#"
          className="rounded-md border-2 border-ink bg-mint px-5 py-2.5 text-sm font-bold text-ink shadow-hard-sm transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]"
        >
          Get started →
        </MagneticButton>
      </div>
    </nav>
  );
}
