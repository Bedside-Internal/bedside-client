"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(animateRing);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hot = target.closest("a, button, .hoverable");
      if (dotRef.current) {
        dotRef.current.style.width = hot ? "18px" : "10px";
        dotRef.current.style.height = hot ? "18px" : "10px";
        dotRef.current.style.background = hot ? "#3BBA9C" : "#1a1a1a";
      }
      if (ringRef.current) {
        ringRef.current.style.width = hot ? "52px" : "34px";
        ringRef.current.style.height = hot ? "52px" : "34px";
        ringRef.current.style.borderColor = hot
          ? "rgba(59,186,156,0.5)"
          : "rgba(26,26,26,0.28)";
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(animateRing);

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
        className="fixed z-[2147483647] h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink pointer-events-none transition-[width,height,background] duration-150 hidden md:block"
        style={{ left: -20, top: -20 }}
      />
      <div
        ref={ringRef}
        className="fixed z-[2147483646] h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-ink/25 pointer-events-none transition-[width,height,border-color] duration-200 hidden md:block"
        style={{ left: -50, top: -50 }}
      />
    </>
  );
}
