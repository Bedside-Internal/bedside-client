"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
    /**
     * Opt in to the phone layout. When this prop is passed (null is fine before the
     * slot has mounted), screens below `md` show a compact bar rendered into this
     * element instead of the ring, so the host can pin it to the top of the page.
     * Leave it undefined to always show the ring.
     */
    compactSlot?: HTMLElement | null;
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
    compactSlot,
}: TimerProps) {
    const [remaining, setRemaining] = useState(durationSeconds);
    const [prevSignal, setPrevSignal] = useState(`${durationSeconds}:${resetKey}`);
    const onCompleteRef = useRef(onComplete);
    const remainingRef = useRef(remaining);
    const completedSignal = useRef<string | null>(null);

    // Keep the latest callback and remaining time readable from the effects below.
    // Declared before the clock effect on purpose: effects run in order, so after a
    // reset the clock effect always reads the fresh value.
    useEffect(() => {
        onCompleteRef.current = onComplete;
        remainingRef.current = remaining;
    });

    const signal = `${durationSeconds}:${resetKey}`;
    if (signal !== prevSignal) {
        setPrevSignal(signal);
        setRemaining(durationSeconds);
    }

    // The clock is derived from a wall-clock end time, not from counting ticks.
    // Counting setInterval ticks drifts whenever the browser throttles timers (a
    // locked phone, a backgrounded tab), which silently hands the user extra time.
    // Here a late or missed tick can only make the display stale, never wrong, and
    // it is corrected as soon as the page is visible again.
    useEffect(() => {
        if (!isRunning) return;
        const endAt = Date.now() + remainingRef.current * 1000;
        const sync = () => {
            setRemaining(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
        };
        const id = setInterval(sync, 250);
        document.addEventListener("visibilitychange", sync);
        window.addEventListener("pageshow", sync);
        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", sync);
            window.removeEventListener("pageshow", sync);
        };
    }, [isRunning, signal]);

    useEffect(() => {
        if (isRunning && remaining === 0 && completedSignal.current !== signal) {
            completedSignal.current = signal;
            onCompleteRef.current?.();
        }
        if (remaining > 0) completedSignal.current = null;
    }, [remaining, isRunning, signal]);

    const pct = durationSeconds > 0 ? remaining / durationSeconds : 0;
    const ringColor =
        pct <= 0.15
            ? "var(--color-coral)"
            : pct <= 0.3
            ? "var(--color-amber)"
            : "var(--color-mint)";
    const dashOffset = CIRCUMFERENCE * (1 - pct);
    const phoneLayout = compactSlot !== undefined;

    return (
        <>
            <div className={`${phoneLayout ? "hidden md:flex" : "flex"} flex-col items-center gap-4`}>
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

            {compactSlot &&
                createPortal(
                    <div
                        role="timer"
                        aria-label={`${eyebrow}: ${formatClock(remaining)} ${label}`}
                        className="border-b border-[var(--color-ink)]/10 bg-[var(--color-cream)]/95 px-4 pb-2.5 pt-2 backdrop-blur"
                    >
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-ink)]/45">
                                {eyebrow}
                            </span>
                            <span className="flex items-baseline gap-1.5">
                                <span
                                    className="text-xl font-bold tabular-nums"
                                    style={{ color: pct <= 0.15 ? "var(--color-coral)" : "var(--color-ink)" }}
                                >
                                    {formatClock(remaining)}
                                </span>
                                <span className="text-xs text-[var(--color-ink)]/45">{label}</span>
                            </span>
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--color-sand)]">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${pct * 100}%`,
                                    backgroundColor: ringColor,
                                    transition: "width 0.25s linear, background-color 0.3s ease",
                                }}
                            />
                        </div>
                    </div>,
                    compactSlot,
                )}
        </>
    );
}