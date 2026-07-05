import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/dashboard/Progressbar";

export interface FormatMetric {
  label: string;
  value: number;
  tone?: "mint" | "amber" | "coral" | "slate";
}

interface FormatCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  score: number;
  metrics: FormatMetric[];
  /** e.g. "38 of 114 questions" */
  progressLabel: string;
  continueHref: string;
}

export function FormatCard({
  icon: Icon,
  title,
  subtitle,
  score,
  metrics,
  progressLabel,
  continueHref,
}: FormatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
            <Icon className="h-5 w-5 text-slate-500" strokeWidth={2} />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-ink)]">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-[var(--color-ink)]">{score}</span>
      </div>

      <div className="mb-5 space-y-3">
        {metrics.map((metric) => (
          <ProgressBar key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-sand)] pt-4">
        <span className="text-sm text-slate-400">{progressLabel}</span>
        <Link
          href={continueHref}
          className="text-sm font-semibold text-[var(--color-mint)] transition hover:text-[var(--color-mint-hover)]"
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}