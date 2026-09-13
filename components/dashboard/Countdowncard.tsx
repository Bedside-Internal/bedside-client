interface CountdownCardProps {
    daysRemaining: number;
    prepTimeUsedPercent: number;
}

export function CountdownCard({ daysRemaining, prepTimeUsedPercent }: CountdownCardProps) {
    return (
        <div className="w-56 shrink-0 rounded-2xl bg-[var(--color-sand)]/50 p-6 text-right">
            <span className="text-3xl font-bold text-[var(--color-ink)]">{daysRemaining}</span>
            <p className="mb-4 text-sm text-slate-400">days until interview</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
                <div
                    className="h-full rounded-full bg-[var(--color-mint)]"
                    style={{ width: `${prepTimeUsedPercent}%` }}
                />
            </div>
            <p className="mt-2 text-xs text-slate-400">{prepTimeUsedPercent}% of prep time used</p>
        </div>
    );
}