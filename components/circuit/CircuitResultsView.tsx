import { CircularProgress } from "@/components/dashboard/Circularprogress";
import { ProgressBar } from "@/components/dashboard/Progressbar";
import { resolveIcon } from "@/lib/iconRegistry";
import { RunAnotherCircuitButton } from "@/components/circuit/RunAnotherCircuitButton";
import { CheckCircle2 } from "lucide-react";
import type { CircuitResults } from "@/types/circuit";

function performanceTier(score: number): string {
  if (score >= 85) return "Strong performance";
  if (score >= 70) return "Solid performance";
  return "Room to grow";
}

interface CircuitResultsViewProps {
  results: CircuitResults;
  completeLabel: string;
  breakdownLabel: string;
  backHref: string;
  formatSlug: string;
  basePath: string;
  runAnotherLabel?: string;
}

export function CircuitResultsView({
  results,
  completeLabel,
  breakdownLabel,
  backHref,
  formatSlug,
  basePath,
  runAnotherLabel,
}: CircuitResultsViewProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 text-center shadow-sm">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-mint)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-mint)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> {completeLabel}
          </span>

          <div className="mb-4 flex justify-center">
            <CircularProgress value={results.overallScore} suffix="/100" size={140} />
          </div>

          <h1 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">
            {performanceTier(results.overallScore)}
          </h1>
          <p className="mb-6 text-sm text-[var(--color-ink)]/55">
            {results.percentile !== null && (
              <>You&apos;re in the top {results.percentile}% of users who&apos;ve completed this. </>
            )}
            {results.standoutStationLabel && <>Your {results.standoutStationLabel} was your standout skill.</>}
          </p>

          <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-sand)] pt-4 text-center">
            <div>
              <p className="text-lg font-bold text-[var(--color-ink)]">{results.totalMinutes}</p>
              <p className="text-xs text-[var(--color-ink)]/45">min total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--color-ink)]">
                {results.stationsCompleted}/{results.stationsTotal}
              </p>
              <p className="text-xs text-[var(--color-ink)]/45">sections done</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--color-ink)]">
                {results.percentile !== null ? `Top ${results.percentile}%` : "—"}
              </p>
              <p className="text-xs text-[var(--color-ink)]/45">ranking</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/45">
            {breakdownLabel}
          </p>
          <div className="space-y-4">
            {results.stations.map((station) => {
              const Icon = resolveIcon(station.iconKey ?? "");
              return (
                <div key={station.sectionSlug} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--color-ink)]/40" strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <ProgressBar label={station.title} value={station.score ?? 0} tone={station.needsFocus ? "coral" : undefined} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-[var(--color-ink)]">
                    {station.score ?? "—"}
                  </span>
                  {station.needsFocus && (
                    <span className="shrink-0 rounded-full bg-[var(--color-coral)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-coral)]">
                      Focus here
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--color-sand)] pt-4">
            <a href={backHref} className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]">
              Review all feedback
            </a>
            <RunAnotherCircuitButton formatSlug={formatSlug} basePath={basePath} label={runAnotherLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}