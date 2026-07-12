"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
    /** Total length of this phase, in seconds. */
    durationSeconds: number;
    /** Small tracked-out caption above the ring, e.g. "READING TIME". */
    eyebrow: string;
    /** Small caption under the clock, e.g. "to read" or "remaining". */
    label: string;
    /** Pause/resume without losing progress. */
    isRunning?: boolean;
    /** Fires once when the clock reaches 0:00. */
    onComplete?: () => void;
    /** Change this to force the clock back to durationSeconds (e.g. new question id). */
    resetKey?: string | number;
}

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatClock(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Timer({
    durationSeconds,
    eyebrow,
    label,
    isRunning = true,
    onComplete,
    resetKey,
}: TimerProps) {
    const [remaining, setRemaining] = useState(durationSeconds);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetKey is intentionally the resync trigger
    useEffect(() => {
        setRemaining(durationSeconds);
    }, [durationSeconds, resetKey]);

    useEffect(() => {
        if (!isRunning) return;
        const id = setInterval(() => {
            setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [isRunning]);

    useEffect(() => {
        if (remaining === 0) onCompleteRef.current?.();
    }, [remaining]);

    const pct = durationSeconds > 0 ? remaining / durationSeconds : 0;
    const ringColor =
        pct <= 0.15
            ? "var(--color-coral)"
            : pct <= 0.3
            ? "var(--color-amber)"
            : "var(--color-mint)";
    const dashOffset = CIRCUMFERENCE * (1 - pct);

    return (
        <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-ink)]/45">
                {eyebrow}
            </span>
            <div className="relative h-[200px] w-[200px]">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                    <circle
                        cx="100"
                        cy="100"
                        r={RADIUS}
                        fill="none"
                        stroke="var(--color-sand)"
                        strokeWidth="10"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r={RADIUS}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-4xl font-bold tabular-nums text-[var(--color-ink)]">
                        {formatClock(remaining)}
                    </span>
                    <span className="text-xs text-[var(--color-ink)]/45">{label}</span>
                </div>
            </div>
        </div>
    );
}