"use client";

import { RatingScale } from "./RatingScale";
import type { RatingLabel, ResponseItemDetail } from "@/types/mmi";

interface RatingItemRowProps {
    item: ResponseItemDetail;
    index: number; // 0-based — drives the A/B/C/D badge
    value: RatingLabel | null;
    onChange: (rating: RatingLabel) => void;
}

export function RatingItemRow({ item, index, value, onChange }: RatingItemRowProps) {
    const letter = String.fromCharCode(65 + index);

    return (
        <div className="border-b border-[var(--color-sand)] px-5 py-4 last:border-b-0">
            <div className="mb-3 flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-sand)] text-xs font-semibold text-[var(--color-ink)]/60">
                    {letter}
                </span>
                <p className="text-sm leading-relaxed text-[var(--color-ink)]">{item.text}</p>
            </div>
            <RatingScale name={`Rating for option ${letter}`} value={value} onChange={onChange} />
        </div>
    );
}