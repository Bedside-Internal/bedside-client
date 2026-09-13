"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ActivityRow } from "@/components/dashboard/Activityrow";
import { LockedActivityRow } from "@/components/dashboard/LockedActivityRow";

interface StreakDay {
    label: string;
    completed: boolean;
    isToday?: boolean;
}

interface ActivityItem {
    status: "success" | "warning";
    title: string;
    meta: string;
    score: number;
}

interface ActivityStreakCardProps {
    activityItems: ActivityItem[];
    lockedCount: number;
    streakDays: number;
    streakMessage: string;
    streakDaysList: StreakDay[];
}

export function ActivityStreakCard({
    activityItems,
    lockedCount,
    streakDays,
    streakMessage,
    streakDaysList,
}: ActivityStreakCardProps) {
    const [tab, setTab] = useState<"activity" | "streak">("activity");
    const isEmpty = activityItems.length === 0 && lockedCount === 0;

    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white shadow-sm">
            <div className="flex items-center gap-1 border-b border-[var(--color-sand)] px-3 pt-2">
                <TabButton active={tab === "activity"} onClick={() => setTab("activity")}>
                    Recent activity
                </TabButton>
                <TabButton active={tab === "streak"} onClick={() => setTab("streak")}>
                    🔥 {streakDays}-day streak
                </TabButton>
            </div>

            <div className="px-5 py-3">
                {tab === "activity" ? (
                    isEmpty ? (
                        <div className="py-8 text-center">
                            <p className="text-sm font-medium text-[var(--color-ink)]">No sessions yet</p>
                            <p className="mt-1 text-sm text-slate-400">
                                Finish your first practice session to see it show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--color-sand)]">
                            {activityItems.map((activity, i) => (
                                <ActivityRow key={`${activity.title}-${i}`} {...activity} />
                            ))}
                            {lockedCount > 0 && <LockedActivityRow count={lockedCount} />}
                        </div>
                    )
                ) : (
                    <div className="py-3">
                        <p className="mb-3 text-sm text-slate-500">{streakMessage}</p>
                        <div className="flex gap-2">
                            {streakDaysList.map((day, i) => (
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
                )}
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${active
                    ? "border-b-2 border-[var(--color-mint)] text-[var(--color-ink)]"
                    : "text-slate-400 hover:text-[var(--color-ink)]"
                }`}
        >
            {children}
        </button>
    );
}