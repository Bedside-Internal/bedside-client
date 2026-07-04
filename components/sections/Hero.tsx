"use client";

import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz#@$%&!?';
const QUESTION = '"You discover a colleague is falsifying patient records to meet a quota. What do you do?"';

function scramble(el: HTMLSpanElement, finalText: string, startDelay: number) {
  let frame = 0;
  setTimeout(() => {
    const tick = () => {
      const revealed = Math.floor(frame / 3);
      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealed) out += finalText[i];
        else if (finalText[i] === ' ') out += ' ';
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.innerHTML = [...out].map((ch, i) =>
        i < revealed
          ? ch
          : `<span class="text-teal-400">${ch}</span>`
      ).join('');
      frame++;
      if (Math.floor(frame / 3) < finalText.length) requestAnimationFrame(tick);
      else el.textContent = finalText;
    };
    tick();
  }, startDelay);
}

export function HeroHeadline() {
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (line1.current) scramble(line1.current, 'Stop guessing', 200);
    if (line2.current) scramble(line2.current, "how you'd do.", 520);
  
    const handleScroll = () => {
      const shear = Math.min(window.scrollY * 0.14, 80);
      if (line1.current) line1.current.style.transform = `translateX(${-shear}px)`;
      if (line2.current) line2.current.style.transform = `translateX(${shear}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
  <h1 className="mb-3 font-display text-[clamp(58px,9vw,116px)] leading-[0.92] tracking-tighter text-ink overflow-visible">
    <span ref={line1} className="inline-block">Stop guessing</span>
    <br />
    <span ref={line2} className="inline-block">how you&apos;d do.</span>
  </h1>
  );
}

function useTypewriter(text: string, startDelay = 1000) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(function tick() {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i < text.length) {
        setTimeout(tick, text[i - 1] === ' ' ? 55 : 22 + Math.random() * 28);
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, startDelay]);
  return { displayed, done };
}

function useCountdown(startSeconds = 167) { // 2:47
  const [secs, setSecs] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function InterviewCard() {
  const { displayed, done } = useTypewriter(QUESTION, 1000);
  const time = useCountdown(167);

  return (
    <div className="rounded-lg border-[2.5px] border-ink bg-white p-[18px_20px] text-left shadow-hard">
      <div className="mb-2.5 flex items-center gap-1.5">
        <div className="h-[7px] w-[7px] flex-shrink-0 animate-pulse-dot rounded-full bg-coral" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-mint">
          MMI · Station 3 / 8
        </span>
      </div>
      <p className="mb-3.5 min-h-[5.2em] text-[13.5px] font-medium leading-relaxed text-ink">
        {displayed}
        {!done && <span className="inline-block w-[1.5px] h-[1em] bg-mint ml-[1px] align-text-bottom animate-blink" />}
      </p>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-medium tabular-nums ${parseInt(time) === 0 ? 'text-coral' : 'text-neutral-400'}`}>
          Thinking time: {time}
        </span>
        <div className="rounded border-[1.5px] border-ink bg-mint px-3 py-1 text-[11px] font-bold">
          Answer →
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const sy = window.scrollY;
      containerRef.current
        ?.querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((el) => {
          const s = parseFloat(el.dataset.parallax || "0");
          el.style.transform = `translateY(${sy * s}px)`;
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden px-[5vw] pb-[60px] pt-20 text-center"
    >
      {/* Sparkle top-left */}
      <div
        data-parallax="-0.08"
        className="pointer-events-none absolute left-[7%] top-[9%] z-0 animate-float-a text-mint"
      >
        <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
          <path
            d="M27 0L29.7 24.3L54 27L29.7 29.7L27 54L24.3 29.7L0 27L24.3 24.3Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Ghost sparkle top-right */}
      <div
        data-parallax="-0.04"
        className="pointer-events-none absolute right-[8%] top-[10%] animate-float-b text-ink opacity-[0.06]"
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path
            d="M60 0L65 55L120 60L65 65L60 120L55 65L0 60L55 55Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Floating interview card */}
      <div
        data-parallax="-0.13"
        className="pointer-events-none absolute right-[3.5%] top-[16%] z-10 hidden max-w-[272px] animate-float-c md:block"
      >
        <InterviewCard />
      </div>

      {/* Badge: 6 formats */}
      <div
        data-parallax="-0.06"
        className="pointer-events-none absolute bottom-[24%] left-[4%] z-10 hidden animate-float-a sm:block"
      >
        <div className="whitespace-nowrap rounded-full border-2 border-ink bg-coral px-[18px] py-[9px] text-[13px] font-bold text-white shadow-hard-sm">
          6 formats covered ✦
        </div>
      </div>

      {/* AI feedback chip */}
      <div
        data-parallax="-0.09"
        className="pointer-events-none absolute bottom-[22%] right-[4%] z-10 hidden max-w-[210px] animate-float-b md:block"
      >
        <div className="rounded-lg border-2 border-ink bg-white p-3 px-4 text-left shadow-hard-sm">
          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-mint">
            AI Feedback
          </div>
          <div className="text-xs font-medium leading-snug text-ink">
            &quot;Strong structure — add a concrete example to support your
            ethical reasoning.&quot;
          </div>
        </div>
      </div>

      {/* Small sparkle bottom-left ghost */}
      <div
        data-parallax="-0.03"
        className="pointer-events-none absolute bottom-[10%] left-[12%] animate-float-b text-mint opacity-30"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 0L15.4 12.6L28 14L15.4 15.4L14 28L12.6 15.4L0 14L12.6 12.6Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-[900px]">
        <div className="mb-9 inline-flex animate-hero-in items-center gap-2 rounded-full border-2 border-ink bg-white px-[18px] py-1.5 shadow-hard-sm">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M5.5 0L6.3 4.7L11 5.5L6.3 6.3L5.5 11L4.7 6.3L0 5.5L4.7 4.7Z"
              fill="#3BBA9C"
            />
          </svg>
          <span className="text-[13px] font-semibold text-ink">
            Built for med school applicants
          </span>
        </div>

        <HeroHeadline />

        <div
          className="mb-11 inline-block animate-hero-in rounded-lg border-[2.5px] border-ink bg-mint px-[22px] pb-1.5 shadow-hard-lg"
          style={{ animationDelay: "0.14s" }}
        >
          <span className="font-display text-[clamp(42px,6.5vw,80px)] italic leading-[1.1] tracking-tight text-ink">
            Find out.
          </span>
        </div>

        <p
          className="mx-auto mb-12 max-w-[520px] animate-hero-in text-[clamp(16px,1.8vw,19px)] leading-relaxed text-neutral-600"
          style={{ animationDelay: "0.21s" }}
        >
          Unlimited mock interviews in every med school format: MMI, panel,
          traditional, CASPer, and more. No paywalled tracks. All of it, one
          place.
        </p>

        <div
          className="flex animate-hero-in flex-wrap items-center justify-center gap-3.5"
          style={{ animationDelay: "0.28s" }}
        >
          <MagneticButton
            href="#"
            className="rounded-md border-[2.5px] border-ink bg-mint px-7 py-4 text-base font-bold text-ink shadow-hard transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Start practicing free →
          </MagneticButton>
          <MagneticButton
            href="#how"
            className="rounded-md border-[2.5px] border-ink px-7 py-4 text-base font-semibold text-ink shadow-hard transition-[box-shadow,transform] duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            How it works
          </MagneticButton>
        </div>

        <div
          className="mt-9 flex animate-hero-in flex-wrap items-center justify-center gap-4.5"
          style={{ animationDelay: "0.36s" }}
        >
          <span className="text-[13px] font-medium text-neutral-400">
            ✓ Unlimited practice
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[13px] font-medium text-neutral-400">
            ✓ 6 interview formats
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[13px] font-medium text-neutral-400">
            ✓ Instant AI feedback
          </span>
        </div>
      </div>
    </section>
  );
}
