const LEGEND: { value: string; label: string; dot: string; bg: string; text: string }[] = [
    {
        value: "very_ineffective",
        label: "Very Ineffective",
        dot: "bg-[var(--color-coral)]",
        bg: "bg-[var(--color-coral)]/10",
        text: "text-[var(--color-coral)]",
    },
    {
        value: "ineffective",
        label: "Ineffective",
        dot: "bg-[var(--color-amber)]",
        bg: "bg-[var(--color-amber)]/10",
        text: "text-[var(--color-amber)]",
    },
    {
        value: "effective",
        label: "Effective",
        dot: "bg-[var(--color-mint)]",
        bg: "bg-[var(--color-mint)]/10",
        text: "text-[var(--color-mint-hover)]",
    },
    {
        value: "very_effective",
        label: "Very Effective",
        dot: "bg-[var(--color-mint)]",
        bg: "bg-[var(--color-mint)]/20",
        text: "text-[var(--color-mint-hover)]",
    },
];

export function RatingTaskAndLegend() {
    return (
        <div className="mt-8 flex flex-col gap-6">
            <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-mint-hover)]">
                    YOUR TASK
                </span>
                <div className="mt-3 rounded-xl bg-[var(--color-sand)] px-5 py-4 text-sm leading-relaxed text-[var(--color-ink)]/70">
                    Rate how{" "}
                    <strong className="font-semibold text-[var(--color-ink)]">
                        effective or ineffective
                    </strong>{" "}
                    each of the following responses would be in this situation. Rate each option
                    independently.
                </div>
            </div>

            <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-ink)]/45">
                    RATING SCALE
                </span>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    {LEGEND.map((l) => (
                        <div key={l.value} className={`flex items-center gap-2 rounded-xl px-4 py-3 ${l.bg}`}>
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${l.dot}`} />
                            <span className={`text-sm font-semibold ${l.text}`}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}