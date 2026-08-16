"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHomeButtonProps {
  ready: boolean;
}

export function DashboardHomeButton({ ready }: DashboardHomeButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={ready ? () => router.push("/dashboard") : undefined}
      disabled={!ready}
      aria-label="Go to dashboard"
      title={ready ? "Go to dashboard" : "Finish onboarding to unlock your dashboard"}
      className={`rounded-lg p-2 transition ${
        ready
          ? "text-[var(--color-ink)]/60 hover:bg-white"
          : "cursor-not-allowed text-[var(--color-ink)]/25"
      }`}
    >
      <Home className="h-5 w-5" strokeWidth={2.25} />
    </button>
  );
}