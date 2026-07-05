"use client";

import type { ReactNode } from "react";

interface WeakestAreaCardProps {
  eyebrow: string;
  icon: ReactNode; // server-client boundary with rendered-icon element
  title: string;
  description: string;
  ctaLabel: string;
  onStart?: () => void;
}

export function WeakestAreaCard({ eyebrow, icon, title, description, ctaLabel, onStart }: WeakestAreaCardProps) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-mint) 8%, white)",
        borderColor: "color-mix(in srgb, var(--color-mint) 25%, white)",
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-mint)]">{eyebrow}</p>
          <p className="mb-1 text-lg font-bold text-[var(--color-ink)]">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--color-mint)]"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-mint) 15%, white)" }}
        >
          {icon}
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-mint)] py-3 font-semibold text-white transition hover:bg-[var(--color-mint-hover)]"
      >
        {ctaLabel} →
      </button>
    </div>
  );
}