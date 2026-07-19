"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { resolveIcon } from "@/lib/iconRegistry";
import { CircuitStepTracker } from "./CircuitStepTracker";
import type { CircuitStationState } from "@/types/circuit";

const BREAK_SECONDS = 25;

// Light, non-prescriptive prep notes shown while the break timer runs.
// Keyed by section slug — falls back to a generic tip if a slug isn't listed.
const STATION_TIPS: Record<string, string> = {
  communication: "In Communication stations, interviewers assess tone and empathy as much as content — slow down and listen.",
  "ethical-reasoning": "Structure your answer: acknowledge the situation → explore the angles → land on a position. Don't jump straight to a verdict.",
  "critical-thinking": "Think out loud — interviewers are scoring your reasoning process, not just your final answer.",
  "role-play": "Stay in character, but don't lose sight of the underlying goal of the scenario.",
  collaboration: "Show how you'd bring others in, not just what you'd decide alone.",
  "personal-reflective": "Specific personal examples land better than general statements about your values.",
};
const DEFAULT_TIP = "Take a breath. Read the next scenario carefully before you start responding.";

interface CircuitTransitionProps {
  attemptId: string;
  stations: CircuitStationState[];
  currentIndex: number; // the station we're transitioning INTO
}

export function CircuitTransition({ attemptId, stations, currentIndex }: CircuitTransitionProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(BREAK_SECONDS);
  const nextStation = stations[currentIndex];

  function proceed() {
    router.push(`/mmi/circuit/run?attempt=${attemptId}&station=${currentIndex}&phase=question`);
  }

  useEffect(() => {
    if (remaining <= 0) {
      proceed();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const Icon = resolveIcon(nextStation.iconKey ?? "");

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="flex items-center justify-between px-6 py-5">
        <button onClick={() => router.push("/dashboard")} aria-label="Exit circuit">
          <ArrowLeft className="h-5 w-5 text-[var(--color-ink)]/50" />
        </button>
        <CircuitStepTracker stations={stations} currentIndex={currentIndex} />
        <div className="w-5" />
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/40">
          break time
        </p>
        <p className="mb-6 text-5xl font-bold text-[var(--color-ink)]">{remaining}s</p>

        <h2 className="mb-2 text-xl font-semibold text-[var(--color-ink)]">
          Moving to Station {currentIndex + 1}
        </h2>
        <p className="mb-8 flex items-center gap-2 text-sm text-[var(--color-ink)]/60">
          <Icon className="h-4 w-4" strokeWidth={2} />
          Next up: <span className="font-semibold text-[var(--color-ink)]">{nextStation.title}</span>
        </p>

        <div className="mb-8 w-full rounded-xl bg-[var(--color-sand)] px-5 py-4 text-left text-sm text-[var(--color-ink)]/65">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/40">
            While you wait
          </p>
          <p>{STATION_TIPS[nextStation.sectionSlug] ?? DEFAULT_TIP}</p>
        </div>

        <button
          type="button"
          onClick={proceed}
          className="text-sm font-semibold text-[var(--color-mint)] hover:text-[var(--color-mint-hover)]"
        >
          Skip break and start now →
        </button>
      </main>
    </div>
  );
}