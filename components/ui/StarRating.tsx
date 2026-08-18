"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
    value: number; // 1-5
    onChange?: (value: number) => void; // omit for read-only display
    size?: number;
    className?: string;
}

export default function StarRating({ value, onChange, size = 16, className }: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const interactive = Boolean(onChange);
    const display = hovered ?? value;

    return (
        <div
            className={clsx("inline-flex items-center gap-0.5", className)}
            role={interactive ? "radiogroup" : "img"}
            aria-label={interactive ? "Rate your experience out of 5 stars" : `Rated ${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={!interactive}
                    role={interactive ? "radio" : undefined}
                    aria-checked={interactive ? value === n : undefined}
                    aria-label={interactive ? `${n} star${n === 1 ? "" : "s"}` : undefined}
                    onClick={() => onChange?.(n)}
                    onMouseEnter={() => interactive && setHovered(n)}
                    onMouseLeave={() => interactive && setHovered(null)}
                    className={clsx(
                        "transition-colors",
                        interactive ? "cursor-pointer" : "cursor-default",
                    )}
                >
                    <Star
                        size={size}
                        strokeWidth={1.5}
                        className={n <= display ? "fill-amber text-amber" : "fill-transparent text-ink/20"}
                    />
                </button>
            ))}
        </div>
    );
}