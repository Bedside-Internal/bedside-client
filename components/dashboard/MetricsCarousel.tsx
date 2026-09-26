"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FormatMetric {
    label: string;
    value: number;
    tone?: "mint" | "amber" | "coral" | "slate";
}

interface MetricsCarouselProps {
    metrics: FormatMetric[];
}

const fillColor: Record<NonNullable<FormatMetric["tone"]>, string> = {
    mint: "bg-[var(--color-mint)]",
    amber: "bg-[var(--color-amber)]",
    coral: "bg-[var(--color-coral)]",
    slate: "bg-slate-300",
};

const valueColor: Record<NonNullable<FormatMetric["tone"]>, string> = {
    mint: "text-[var(--color-ink)]",
    amber: "text-[var(--color-amber)]",
    coral: "text-[var(--color-coral)]",
    slate: "text-[var(--color-ink)]",
};

export function MetricsCarousel({ metrics }: MetricsCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateArrows = () => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, [metrics]);

    const scrollByCard = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.querySelector("[data-card]") as HTMLElement | null;
        const step = (card?.offsetWidth ?? 160) + 12; // width + gap
        el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
    };

    return (
        <div className="relative">
            {canScrollLeft && (
                <button
                    type="button"
                    onClick={() => scrollByCard(-1)}
                    aria-label="Scroll left"
                    className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-sand)] bg-white text-slate-500 shadow-sm transition hover:text-[var(--color-ink)]"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
            )}

            <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {metrics.map((metric) => {
                    const tone = metric.tone ?? "mint";
                    const percent = Math.min(100, Math.max(0, metric.value));
                    return (
                        <div
                            key={metric.label}
                            data-card
                            className="flex w-36 shrink-0 snap-start flex-col gap-2 rounded-xl border border-[var(--color-sand)] bg-[var(--color-cream)] p-3"
                        >
                            <span className="text-xs leading-snug text-slate-400">{metric.label}</span>
                            <span className={`text-lg font-bold ${valueColor[tone]}`}>{metric.value}</span>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-sand)]">
                                <div
                                    className={`h-full rounded-full ${fillColor[tone]}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {canScrollRight && (
                <button
                    type="button"
                    onClick={() => scrollByCard(1)}
                    aria-label="Scroll right"
                    className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-sand)] bg-white text-slate-500 shadow-sm transition hover:text-[var(--color-ink)]"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}