import Link from "next/link";
import { Lock } from "lucide-react";
import type { ResponseFeedback } from "@/types/mmi";

interface ResponseFeedbackCardProps {
    feedback: ResponseFeedback;
}

export function ResponseFeedbackCard({ feedback }: ResponseFeedbackCardProps) {
    const isFull = feedback.tier === "full";

    return (
        <>
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--color-ink)]">Response submitted</span>
                <span className="rounded-full bg-[var(--color-mint)]/10 px-3 py-1 text-sm font-bold text-[var(--color-mint-hover)]">
                    {feedback.overallScore}/100
                </span>
            </div>

            <p className="text-sm leading-relaxed text-[var(--color-ink)]/70">{feedback.summary}</p>

            {isFull ? (
                <>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {feedback.dimensionScores.map((d) => (
                            <div key={d.label} className="rounded-xl bg-[var(--color-sand)] px-4 py-3">
                                <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-ink)]">
                                    <span>{d.label}</span>
                                    <span>{d.score}/10</span>
                                </div>
                                <p className="mt-1 text-xs text-[var(--color-ink)]/60">{d.rationale}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mint-hover)]">
                                Strengths
                            </p>
                            <ul className="mt-1 space-y-1 text-sm text-[var(--color-ink)]/70">
                                {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-coral)]">
                                Areas to improve
                            </p>
                            <ul className="mt-1 space-y-1 text-sm text-[var(--color-ink)]/70">
                                {feedback.areasToImprove.map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {feedback.strengths[0] && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-mint-hover)]">
                                Strengths
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-ink)]/70">• {feedback.strengths[0]}</p>
                        </div>
                    )}

                    <Link
                        href="/#pricing"
                        className="group flex items-center justify-between rounded-xl border border-dashed border-[var(--color-ink)]/15 bg-[var(--color-sand)]/60 px-4 py-3 transition hover:border-[var(--color-amber)]/50 hover:bg-[var(--color-amber)]/5"
                    >
                        <div className="flex items-center gap-2.5">
                            <Lock className="h-4 w-4 text-[var(--color-ink)]/40" strokeWidth={2} />
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-ink)]">
                                    See your full breakdown
                                </p>
                                <p className="text-xs text-[var(--color-ink)]/50">
                                    Per-dimension scores, rationale, and areas to improve — with Pro
                                </p>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-amber)] group-hover:underline">
                            Upgrade
                        </span>
                    </Link>
                </>
            )}
        </>
    );
}