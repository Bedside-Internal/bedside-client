import type { RatingResponseFeedback } from "@/types/mmi";

const LABELS: Record<string, string> = {
    very_ineffective: "Very Ineffective",
    ineffective: "Ineffective",
    effective: "Effective",
    very_effective: "Very Effective",
};

interface RatingFeedbackProps {
    feedback: RatingResponseFeedback;
}

export function RatingFeedback({ feedback }: RatingFeedbackProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--color-ink)]">Ratings submitted</span>
                <span className="rounded-full bg-[var(--color-mint)]/10 px-3 py-1 text-sm font-bold text-[var(--color-mint-hover)]">
                    {feedback.overallScore}/100
                </span>
            </div>

            <div className="divide-y divide-[var(--color-sand)] rounded-xl border border-[var(--color-sand)]">
                {feedback.items.map((item) => {
                    const correct = item.submittedRating === item.correctRating;
                    return (
                        <div key={item.itemId} className="px-4 py-3">
                            <p className="text-sm text-[var(--color-ink)]/80">{item.itemText}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span
                                    className={`rounded-full px-2.5 py-1 font-semibold ${
                                        correct
                                            ? "bg-[var(--color-mint)]/10 text-[var(--color-mint-hover)]"
                                            : "bg-[var(--color-coral)]/10 text-[var(--color-coral)]"
                                    }`}
                                >
                                    You said: {LABELS[item.submittedRating]}
                                </span>
                                {!correct && (
                                    <span className="rounded-full bg-[var(--color-sand)] px-2.5 py-1 font-semibold text-[var(--color-ink)]/60">
                                        Correct: {LABELS[item.correctRating]}
                                    </span>
                                )}
                                <span className="text-[var(--color-ink)]/40">+{item.pointsEarned} pts</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}