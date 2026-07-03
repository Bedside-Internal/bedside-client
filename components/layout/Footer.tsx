const productLinks = [
  { href: "#features", label: "Formats" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "#", label: "About" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-neutral-800 bg-ink px-[5vw] pb-10 pt-16">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-12 flex flex-wrap items-start justify-between gap-10">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 0L11.8 8.2L20 10L11.8 11.8L10 20L8.2 11.8L0 10L8.2 8.2Z"
                  fill="#3BBA9C"
                />
              </svg>
              <span className="font-display text-[22px] tracking-tight text-cream">
                PrepAce
              </span>
            </div>
            <p className="max-w-[240px] text-sm leading-relaxed text-cream/45">
              AI-powered mock interviews for med school applicants. Every
              format. No excuses.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-cream/40">
                Product
              </div>
              <div className="flex flex-col gap-2.5">
                {productLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="hoverable text-sm text-cream/65 no-underline"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-cream/40">
                Company
              </div>
              <div className="flex flex-col gap-2.5">
                {companyLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="hoverable text-sm text-cream/65 no-underline"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span className="text-[13px] text-cream/30">
            © {new Date().getFullYear()} PrepAce. All rights reserved.
          </span>
          <span className="text-[13px] text-cream/30">
            Built for the next generation of doctors.
          </span>
        </div>
      </div>
    </footer>
  );
}
