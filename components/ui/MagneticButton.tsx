"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import clsx from "clsx";

export default function MagneticButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.28;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.transition = "box-shadow 0.1s, transform 0.05s";
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition =
      "box-shadow 0.12s, transform 0.5s cubic-bezier(0.16,1,0.3,1)";
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={clsx("hoverable inline-block", className)}
    >
      {children}
    </a>
  );
}
