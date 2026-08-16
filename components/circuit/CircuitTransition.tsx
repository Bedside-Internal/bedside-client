"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CircuitStepTracker } from "./CircuitStepTracker";
import type { CircuitStationState } from "@/types/circuit";
import { resolveIcon } from "@/lib/iconRegistry";
import { DashboardHomeButton } from "../onboarding/DashboardHomeButton";

const BREAK_SECONDS = 25;
const FALLBACK_TIP = "Take a breath. Read the next scenario carefully before you start responding.";

// Owns both the key→component lookup and the instantiation, so the parent never selects a component and renders it in the same scope.
function NextStationIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-4 w-4" strokeWidth={2} />;
}

interface CircuitTransitionProps {
  attemptId: string;
  stations: CircuitStationState[];
  currentIndex: number;
  basePath: string;
  unitLabel?: string; // "Station" | "Scenario"
  tips?: Record<string, string>;
  defaultTip?: string;
  exitHref: string;
  dashboardReady: boolean;
}

export function CircuitTransition({
  attemptId,
  stations,
  currentIndex,
  basePath,
  unitLabel = "Station",
  tips = {},
  defaultTip = FALLBACK_TIP,
  exitHref,
  dashboardReady,
}: CircuitTransitionProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(BREAK_SECONDS);
  const nextStation = stations[currentIndex];
  const nextStationIcon = resolveIcon(nextStation.iconKey ?? "");

  function proceed() {
    router.push(`${basePath}/run?attempt=${attemptId}&station=${currentIndex}&phase=question`);
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

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="flex items-center justify-between px-6 py-5">
        <button onClick={() => router.push(exitHref)} aria-label="Exit">
          <ArrowLeft className="h-5 w-5 text-[var(--color-ink)]/50" />
        </button>
        <CircuitStepTracker stations={stations} currentIndex={currentIndex} />
        <DashboardHomeButton ready={dashboardReady} />
        <div className="w-5" />
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/40">break time</p>
        <p className="mb-6 text-5xl font-bold text-[var(--color-ink)]">{remaining}s</p>

        <h2 className="mb-2 text-xl font-semibold text-[var(--color-ink)]">
          Moving to {unitLabel} {currentIndex + 1}
        </h2>
        <p className="mb-8 flex items-center gap-2 text-sm text-[var(--color-ink)]/60">
          <NextStationIcon icon={nextStationIcon} />
          Next up: <span className="font-semibold text-[var(--color-ink)]">{nextStation.title}</span>
        </p>

        <div className="mb-8 w-full rounded-xl bg-[var(--color-sand)] px-5 py-4 text-left text-sm text-[var(--color-ink)]/65">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/40">While you wait</p>
          <p>{tips[nextStation.sectionSlug] ?? defaultTip}</p>
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