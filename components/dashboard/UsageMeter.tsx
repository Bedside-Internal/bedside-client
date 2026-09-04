import type { UsageSummary } from "@/lib/api/userQuestions";

interface UsageMeterProps {
    usage: UsageSummary;
    userTier: "free" | "paid" | "admin";
}

function MeterRow({
    label,
    used,
    limit,
    accent,
}: {
    label: string;
    used: number;
    limit: number;
    accent: string;
}) {
    const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

    return (
        <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-[var(--color-ink)]">{label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-sand)]">
                <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: accent }}
                />
            </div>
            <span className="w-16 shrink-0 text-right text-xs text-[var(--color-ink)]/50">
                {limit === 0 ? "N/A" : `${used}/${limit}`}
            </span>
        </div>
    );
}

export function UsageMeter({ usage, userTier }: UsageMeterProps) {
    // Both quotas share the same monthly period boundary, so one reset
    // date covers both — no need to repeat it per row.
    const resetLabel = new Date(usage.submission.periodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white px-5 py-4">
            <div className="flex items-center justify-between">
                <h2 className="font-poppins text-xs font-bold uppercase tracking-wide text-[var(--color-ink)]/50">
                    This Month
                </h2>
                <span className="text-[11px] text-[var(--color-ink)]/40">Resets {resetLabel}</span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <MeterRow label="Submissions" used={usage.submission.used} limit={usage.submission.limit} accent="var(--color-mint)" />
                <MeterRow label="AI Generations" used={usage.generation.used} limit={usage.generation.limit} accent="var(--color-violet)" />
            </div>
            {userTier === "free" && (
                <p className="mt-3 text-[11px] text-[var(--color-ink)]/40">
                    Upgrade to generate your own AI-powered practice questions.
                </p>
            )}
        </div>
    );
}