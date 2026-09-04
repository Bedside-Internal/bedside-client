"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startAttemptAction } from "@/lib/api/mmi-actions";

interface BeginStationButtonProps {
  formatSlug: string; // "mmi" | "preview"
  basePath: string;   // "mmi" | "preview"
  slug: string;
  label?: string;
  qid?: string;
}

export function BeginStationButton({ formatSlug, basePath, slug, label = "Begin →", qid }: BeginStationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [blocked, setBlocked] = useState(false);

  function handleClick() {
    startTransition(async () => {
      const result = await startAttemptAction(formatSlug);
      if (result.ok) {
        const qidParam = qid ? `&qid=${encodeURIComponent(qid)}` : "&q=0";
        router.push(`/${basePath}/${slug}?attempt=${result.attemptId}${qidParam}`);
      } else if (result.reason === "paywall") {
        setBlocked(true);
      }
    });
  }

  if (blocked) {
    return (
      <p className="rounded-xl bg-[var(--color-coral)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-coral)]">
        You&apos;ve used all your free attempts, check out the pricing tab in the home screen for more information.
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:opacity-50"
    >
      {isPending ? "Starting…" : label}
    </button>
  );
}