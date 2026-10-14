"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { startCircuit } from "@/lib/api/circuit-actions";

interface RunAnotherCircuitButtonProps {
  formatSlug: string;
  basePath: string;
  label?: string;
}

export function RunAnotherCircuitButton({ formatSlug, basePath, label = "Run another circuit →" }: RunAnotherCircuitButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const attempt = await startCircuit(formatSlug);
      router.push(`${basePath}/run?attempt=${attempt.attemptId}&station=0&phase=question`);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="w-full rounded-xl bg-[var(--color-mint)] px-4 py-3 text-sm sm:w-auto sm:py-2 font-semibold text-white hover:bg-[var(--color-mint-hover)] disabled:opacity-50"
    >
      {isPending ? "Starting…" : label}
    </button>
  );
}