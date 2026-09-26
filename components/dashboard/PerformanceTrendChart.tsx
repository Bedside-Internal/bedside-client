"use client";

import {
    ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface SessionPoint { attemptId: string; completedAt: string; score: number }
interface BucketPoint { label: string; averageScore: number; sessionsCount: number; midpointT: number }
interface TrendData {
    points: BucketPoint[];
    sessions: SessionPoint[];
    monthlyAverage: number | null;
    sessionsThisMonth: number;
}

export function PerformanceTrendChart({ data }: { data: TrendData }) {
    if (data.sessions.length === 0) {
        return (
            <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 text-sm text-[var(--color-ink)]/50">
                Complete a session to start tracking your progress.
            </div>
        );
    }

    const linePoints = data.points.map((p) => ({ timestamp: p.midpointT, avg: p.averageScore }));
    const dotPoints = data.sessions.map((s) => ({
        timestamp: new Date(s.completedAt).getTime(),
        score: s.score,
    }));

    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-semibold text-[var(--color-ink)]">Progress over time</h3>
                {data.monthlyAverage !== null && (
                    <span className="text-sm text-[var(--color-ink)]/55">
                        This month:{" "}
                        <span className="font-semibold text-[var(--color-mint)]">{data.monthlyAverage}</span> avg
                        {" · "}{data.sessionsThisMonth} session{data.sessionsThisMonth === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <ComposedChart margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-sand)" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        stroke="var(--color-ink)"
                        opacity={0.4}
                        fontSize={12}
                    />
                    <YAxis domain={[0, 100]} stroke="var(--color-ink)" opacity={0.4} fontSize={12} />
                    <Tooltip
                        labelFormatter={(t) => new Date(t as number).toLocaleDateString()}
                        formatter={(value, name) => {
                            const v = typeof value === "number" ? value : Number(value);
                            const label = name === "avg" ? "Bucket avg" : "Session score";
                            return [`${v}/100`, label];
                        }}
                    />
                    <Line
                        data={linePoints}
                        dataKey="avg"
                        type="monotone"
                        stroke="var(--color-mint)"
                        strokeWidth={2.5}
                        dot={false}
                    />
                    <Scatter data={dotPoints} dataKey="score" fill="var(--color-amber)" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}