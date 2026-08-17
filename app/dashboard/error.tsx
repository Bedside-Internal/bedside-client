"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard failed to load:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
            <p className="text-lg font-semibold text-[var(--color-ink)]">
                Your dashboard couldn&apos;t load
            </p>
            <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                That&apos;s likely a temporary hiccup with the server or your
                connection — not your onboarding status. Try again.
            </p>
            <div className="mt-2 flex items-center gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)]"
                >
                    <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                    Try again
                </button>
            </div>
        </div>
    );
}