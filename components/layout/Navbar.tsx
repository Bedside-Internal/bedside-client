"use client";

import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const links = [
  { href: "#features", label: "Formats" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Ignore tiny jitters (trackpads, momentum scroll) so it doesn't flicker
      if (Math.abs(delta) < 4) return;

      // Always show near the top of the page, regardless of direction
      if (currentY < 80) {
        setHidden(false);
      } else if (delta > 0) {
        // scrolling down
        setHidden(true);
      } else {
        // scrolling up
        setHidden(false);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-[100] flex h-16 items-center justify-between border-b-2 border-ink bg-cream px-[5vw] transition-transform duration-300 ease-in-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <a href="#" className="flex items-center gap-2 text-ink no-underline">
        <img src={"/bedside_logo.svg"} alt="Bedside" className="h-10 w-auto" />
        <span className="font-display text-[22px] tracking-tight">
          Bedside
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
          href="/sign-in"
          className="rounded-md border-2 border-ink bg-mint px-5 py-2.5 text-sm font-bold text-ink shadow-hard-sm transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]"
        >
          Get started →
        </MagneticButton>
      </div>
    </nav>
  );
}