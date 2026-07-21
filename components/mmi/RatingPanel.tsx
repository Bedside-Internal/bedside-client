"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RatingItemRow } from "./RatingItemRow";
import type { RatingLabel, ResponseItemDetail } from "@/types/mmi";

interface RatingPanelProps {
    items: ResponseItemDetail[];
    submitting?: boolean;
    onSubmit: (ratings: { itemId: string; rating: RatingLabel }[]) => void;
    onPrevQuestion?: () => void;
    hasPrevQuestion?: boolean;
}

export function RatingPanel({
    items,
    submitting = false,
    onSubmit,
    onPrevQuestion,
    hasPrevQuestion = false,
}: RatingPanelProps) {
    const [ratings, setRatings] = useState<Record<string, RatingLabel>>({});

    const ratedCount = Object.keys(ratings).length;
    const allRated = ratedCount === items.length;

    function handleChange(itemId: string, rating: RatingLabel) {
        setRatings((prev) => ({ ...prev, [itemId]: rating }));
    }

    function handleSubmit() {
        if (!allRated || submitting) return;
        onSubmit(items.map((item) => ({ itemId: item.id, rating: ratings[item.id] })));
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="divide-y divide-[var(--color-sand)] rounded-2xl border border-[var(--color-sand)] bg-white">
                {items.map((item, i) => (
                    <RatingItemRow
                        key={item.id}
                        item={item}
                        index={i}
                        value={ratings[item.id] ?? null}
                        onChange={(rating) => handleChange(item.id, rating)}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between">
                {hasPrevQuestion ? (
                    <button
                        type="button"
                        onClick={onPrevQuestion}
                        disabled={submitting}
                        className="flex items-center gap-1 text-sm font-semibold text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Previous question
                    </button>
                ) : (
                    <span />
                )}

                <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--color-ink)]/50">
                        {ratedCount} of {items.length} rated
                    </span>
                    <button
                        type="button"
                        disabled={!allRated || submitting}
                        onClick={handleSubmit}
                        className="flex items-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/15 disabled:text-[var(--color-ink)]/40 disabled:shadow-none"
                    >
                        {submitting ? "Submitting…" : `Rate all ${items.length} to continue`}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}