export interface StreakDay {
    label: string;
    completed: boolean;
    isToday?: boolean;
}

interface StreakCardProps {
    streakDays: number;
    message: string;
    days: StreakDay[];
}

export function StreakCard({ streakDays, message, days }: StreakCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-[var(--color-sand)] p-5">
            <span className="text-3xl">🔥</span>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--color-ink)]">{streakDays}-day streak</p>
                <p className="mb-3 text-sm text-slate-500">{message}</p>
                <div className="flex gap-2">
                    {days.map((day, i) => (
                        <span
                            key={i}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${day.completed
                                    ? "bg-[var(--color-mint)] text-white"
                                    : day.isToday
                                        ? "border-2 border-[var(--color-mint)] text-[var(--color-ink)]"
                                        : "border border-slate-200 bg-white text-slate-300"
                                }`}
                        >
                            {day.completed ? "✓" : day.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}