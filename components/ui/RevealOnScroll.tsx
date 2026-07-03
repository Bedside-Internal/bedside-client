"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

type Delay = "" | "d1" | "d2" | "d3" | "d4" | "d5";

export default function RevealOnScroll({
  children,
  delay = "",
  className,
}: {
  children: ReactNode;
  delay?: Delay;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "reveal",
        delay && `reveal-${delay}`,
        visible && "is-visible",
        className
      )}
    >
      {children}
    </div>
  );
}
