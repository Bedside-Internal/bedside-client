"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let hot = false;
    let raf = 0;
    let last = 0;

    const draw = () => {
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${hot ? 1.8 : 1})`
      );
      ringRef.current?.style.setProperty(
        "transform",
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${hot ? 1.5 : 1})`
      );
    };

    const tick = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      const k = 1 - Math.exp(-dt / 20);
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      draw();
      // stop the loop once the ring has caught up
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      start();
    };

    const onOver = (e: MouseEvent) => {
      const next = !!(e.target as HTMLElement).closest("a, button, .hoverable");
      if (next !== hot) {
        hot = next;
        dotRef.current?.setAttribute("data-hot", String(hot));
        ringRef.current?.setAttribute("data-hot", String(hot));
        start();
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        data-hot="false"
        className="pointer-events-none fixed left-0 top-0 z-[2147483647] hidden h-[10px] w-[10px] rounded-full bg-ink will-change-transform transition-[background-color] duration-150 data-[hot=true]:bg-mint md:block"
      />
      <div
        ref={ringRef}
        data-hot="false"
        className="pointer-events-none fixed left-0 top-0 z-[2147483646] hidden h-[34px] w-[34px] rounded-full border-[1.5px] border-ink/25 will-change-transform transition-[border-color] duration-200 data-[hot=true]:border-mint/50 md:block"
      />
    </>
  );
}