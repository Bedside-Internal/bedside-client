import Link from "next/link";
import { Lock } from "lucide-react";
import type { ResponseFeedback } from "@/types/formats";
import { useState } from "react";

interface ResponseFeedbackCardProps {
    feedback: ResponseFeedback;
}

export function ResponseFeedbackCard({ feedback }: ResponseFeedbackCardProps) {
    const [showIdeal, setShowIdeal] = useState(false);
    const isFull = feedback.tier === "full";

    return (
        <>
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--color-ink)]">Response submitted</span>
                <span className="rounded-full bg-[var(--color-mint)]/10 px-3 py-1 text-sm font-bold text-[var(--color-mint-hover)]">
                    {feedback.overallScore}/100
                </span>
            </div>

            {feedback.promptScores.length > 1 && (
                <div className="flex items-center gap-3">
                    {feedback.promptScores.map((p, i) => (
                        <div key={p.promptId} className="flex-1 rounded-xl bg-[var(--color-sand)] px-3 py-2 text-center">
                            <p className="text-xs font-semibold text-[var(--color-ink)]/50">Q{i + 1}</p>
                            <p className="text-sm font-bold text-[var(--color-ink)]">{p.score}</p>
                        </div>
                    ))}
                </div>
            )}

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

                    {feedback.idealResponse && (
                        showIdeal ? (
                            <div className="mt-2 rounded-xl bg-[var(--color-sand)] p-4">
                                <p className="text-xs font-semibold text-[var(--color-ink)]/50 mb-1">Ideal response</p>
                                <p className="text-sm leading-relaxed text-[var(--color-ink)]/80">{feedback.idealResponse}</p>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowIdeal(true)}
                                className="text-sm font-semibold text-[var(--color-violet)] hover:opacity-80"
                            >
                                Show ideal response
                            </button>
                        )
                    )}
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
                                    Per-dimension scores, rationale, and areas to improve using the Pro tier
                                </p>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-amber)] group-hover:underline">
                            Upgrade
                        </span>
                    </Link>

                    {feedback.idealResponse && (
                        <Link
                            href="/#pricing"
                            className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-sand)]/60 px-4 py-3 transition hover:border-[var(--color-violet)]/50 hover:bg-[var(--color-violet)]/5"
                        >
                            <div className="flex items-center gap-2.5">
                                <Lock className="h-4 w-4 text-[var(--color-ink)]/40" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-ink)]">See the ideal response</p>
                                    <p className="text-xs italic text-[var(--color-ink)]/50 line-clamp-1">
                                        "{feedback.idealResponse}"
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-amber)] group-hover:underline shrink-0">
                                Upgrade
                            </span>
                        </Link>
                    )}
                </>
            )}
        </>
    );
}