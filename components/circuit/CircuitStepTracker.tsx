import { Check } from "lucide-react";
import type { CircuitStationState } from "@/types/circuit";

interface CircuitStepTrackerProps {
  stations: CircuitStationState[];
  currentIndex: number;
  className?: string;
}

export function CircuitStepTracker({ stations, currentIndex, className = "" }: CircuitStepTrackerProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-1 gap-y-2 py-3 sm:gap-x-2 sm:py-4 ${className}`}>
      {stations.map((station, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={station.sectionSlug} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7 font-semibold ${
                done
                  ? "bg-[var(--color-mint)] text-white"
                  : active
                    ? "border-2 border-[var(--color-mint)] text-[var(--color-mint)]"
                    : "border border-[var(--color-ink)]/15 text-[var(--color-ink)]/35"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </div>
            {i < stations.length - 1 && (
              <div className={`h-px w-3 sm:w-6 ${done ? "bg-[var(--color-mint)]" : "bg-[var(--color-ink)]/15"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}