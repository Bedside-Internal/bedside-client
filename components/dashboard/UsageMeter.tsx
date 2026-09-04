import type { UsageSummary } from "@/lib/api/userQuestions";

interface UsageMeterProps {
    usage: UsageSummary;
    userTier: "free" | "paid" | "admin";
}

function MeterBar({
    label,
    used,
    limit,
    periodEnd,
    accent,
}: {
    label: string;
    used: number;
    limit: number;
    periodEnd: string;
    accent: string;
}) {
    const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
    const resetLabel = new Date(periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
                <span className="text-xs text-[var(--color-ink)]/50">
                    {limit === 0 ? "Not available on your plan" : `${used} / ${limit} this month`}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-sand)]">
                <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: accent }}
                />
            </div>
            {limit > 0 && (
                <span className="text-xs text-[var(--color-ink)]/40">Resets {resetLabel}</span>
            )}
        </div>
    );
}

export function UsageMeter({ usage, userTier }: UsageMeterProps) {
    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
            <h2 className="font-poppins text-sm font-bold uppercase tracking-wide text-[var(--color-ink)]/60">
                This Month
            </h2>
            <div className="mt-4 flex flex-col gap-4">
                <MeterBar
                    label="Submissions"
                    used={usage.submission.used}
                    limit={usage.submission.limit}
                    periodEnd={usage.submission.periodEnd}
                    accent="var(--color-mint)"
                />
                <MeterBar
                    label="AI Generations"
                    used={usage.generation.used}
                    limit={usage.generation.limit}
                    periodEnd={usage.generation.periodEnd}
                    accent="var(--color-violet)"
                />
            </div>
            {userTier === "free" && (
                <p className="mt-4 text-xs text-[var(--color-ink)]/50">
                    Upgrade to generate your own AI-powered practice questions.
                </p>
            )}
        </div>
    );
}