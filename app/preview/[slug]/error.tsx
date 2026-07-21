"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function PreviewStationError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("PREview station failed to load:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
            <p className="text-lg font-semibold text-[var(--color-ink)]">
                This scenario couldn&apos;t load
            </p>
            <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                That might be a hiccup with your session or the network. Try again, or head back and pick a different competency.
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
                <a
                    href="/onboarding/medical-school/format-preview"
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)]"
                >
                    Back to competencies
                </a>
            </div>
        </div>
    );
}