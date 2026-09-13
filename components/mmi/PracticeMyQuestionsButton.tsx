"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";
import { startMyQuestionsCircuit, fetchMyRandomStation } from "@/lib/api/circuit-actions";

interface PracticeMyQuestionsButtonProps {
    formatSlug: string;
    formatLabel: string;       // e.g. "MMI", "CASPer", "PREview" — used in the empty-state copy
    circuitBasePath: string;   // e.g. "/mmi/full"
    stationBasePath: string;   // e.g. "mmi"
    canUseOwnQuestions: boolean;
    hasOwnQuestions: boolean;
}

export function PracticeMyQuestionsButton({
    formatSlug,
    formatLabel,
    circuitBasePath,
    stationBasePath,
    canUseOwnQuestions,
    hasOwnQuestions,
}: PracticeMyQuestionsButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    if (!canUseOwnQuestions) {
        return (
            <div className="group relative">
                <button
                    type="button"
                    disabled
                    className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]/40 shadow-[0_1px_2px_rgba(26,26,26,0.04)] cursor-not-allowed"
                >
                    <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Practice My Questions
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-56 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    Upgrade to save and practice your own questions.
                </div>
            </div>
        );
    }

    function runFullCircuit() {
        setOpen(false);
        setError(null);
        startTransition(async () => {
            const result = await startMyQuestionsCircuit(formatSlug);
            if (!result.ok) {
                setError(result.reason === "no_questions" ? result.message : "Couldn't start that circuit. Try again.");
                return;
            }
            router.push(`${circuitBasePath}/run?attempt=${result.data.attemptId}&station=0&phase=question`);
        });
    }

    function runRandomStation() {
        setOpen(false);
        setError(null);
        startTransition(async () => {
            const result = await fetchMyRandomStation(formatSlug);
            if (!result.ok) {
                setError(result.reason === "no_questions" ? result.message : "Couldn't find a station to practice.");
                return;
            }
            router.push(`/${stationBasePath}/${result.data.sectionSlug}?qid=${result.data.questionId}`);
        });
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:opacity-50"
            >
                {isPending ? "Starting…" : "Practice My Questions"}
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>

            {open && (
                <div className="absolute bottom-full right-0 mb-2 w-64 overflow-hidden rounded-xl border border-[var(--color-sand)] bg-white shadow-lg z-10">
                    {hasOwnQuestions ? (
                        <>
                            <button type="button" onClick={runFullCircuit} className="block w-full px-4 py-3 text-left text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-sand)]">
                                Full circuit — my questions
                            </button>
                            <button type="button" onClick={runRandomStation} className="block w-full px-4 py-3 text-left text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-sand)]">
                                Random station — my questions
                            </button>
                        </>
                    ) : (
                        <Link
                            href={`/dashboard/my-questions?format=${formatSlug}`}
                            onClick={() => setOpen(false)}
                            className="block w-full px-4 py-3 text-left text-sm font-medium text-[var(--color-violet)] hover:bg-[var(--color-sand)]"
                        >
                            + Add my own {formatLabel} question
                        </Link>
                    )}
                </div>
            )}

            {error && (
                <p className="absolute right-0 top-full mt-2 w-64 text-right text-xs text-[var(--color-coral)]">
                    {error}
                </p>
            )}
        </div>
    );
}