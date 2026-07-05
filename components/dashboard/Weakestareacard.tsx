"use client";

import type { ReactNode } from "react";

interface WeakestAreaCardProps {
  eyebrow: string;
  /** Pass an already-rendered icon element (e.g. <Grid2X2 />), not the component itself — this crosses a server/client boundary. */
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  onStart?: () => void;
}

export function WeakestAreaCard({ eyebrow, icon, title, description, ctaLabel, onStart }: WeakestAreaCardProps) {
  return (
    <div>
      <div>
        <div>
          <span>{eyebrow}</span>
          <p>{title}</p>
          <p>{description}</p>
        </div>
        <div>{icon}</div>
      </div>
      <button type="button" onClick={onStart}>
        {ctaLabel} →
      </button>
    </div>
  );
}