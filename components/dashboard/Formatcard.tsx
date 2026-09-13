"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProgressBar } from "@/components/dashboard/Progressbar";

export interface FormatMetric {
  label: string;
  value: number;
  tone?: "mint" | "amber" | "coral" | "slate";
}

interface FormatCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  score: number;
  metrics: FormatMetric[];
  progressLabel: string;
  continueHref: string;
}

export function FormatCard({
  icon,
  title,
  subtitle,
  score,
  metrics,
  progressLabel,
  continueHref,
}: FormatCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (metrics.length === 0) {
    return (
      <Link
        href={continueHref}
        className="group flex items-center gap-4 rounded-2xl border border-dashed border-[var(--color-sand)] bg-white/60 p-5 transition hover:border-[var(--color-mint)]/40 hover:bg-white"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--color-ink)]">{title}</p>
          <p className="text-sm text-slate-400">{subtitle} · not started yet</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[var(--color-mint)] group-hover:text-[var(--color-mint-hover)]">
          Get started →
        </span>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-ink)]">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-[var(--color-ink)]">{score}</span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-slate-400 transition hover:text-[var(--color-ink)]"
      >
        <span>{expanded ? "Hide breakdown" : "View breakdown"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="mb-2 space-y-3 pt-1">
          {metrics.map((metric) => (
            <ProgressBar key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
          ))}
        </div>
      )}

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