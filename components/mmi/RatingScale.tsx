"use client";

import type { RatingLabel } from "@/types/mmi";

const RATING_OPTIONS: { value: RatingLabel; label: string }[] = [
    { value: "very_ineffective", label: "Very Ineffective" },
    { value: "ineffective", label: "Ineffective" },
    { value: "effective", label: "Effective" },
    { value: "very_effective", label: "Very Effective" },
];

const ACTIVE_STYLES: Record<RatingLabel, string> = {
    very_ineffective: "border-[var(--color-coral)] bg-[var(--color-coral)]/10 text-[var(--color-coral)]",
    ineffective: "border-[var(--color-amber)] bg-[var(--color-amber)]/10 text-[var(--color-amber)]",
    effective: "border-[var(--color-mint)] bg-[var(--color-mint)]/10 text-[var(--color-mint-hover)]",
    very_effective: "border-[var(--color-mint)] bg-[var(--color-mint)] text-white",
};

const DOT_STYLES: Record<RatingLabel, string> = {
    very_ineffective: "bg-[var(--color-coral)]",
    ineffective: "bg-[var(--color-amber)]",
    effective: "bg-[var(--color-mint)]",
    very_effective: "bg-white",
};

interface RatingScaleProps {
    name: string;
    value: RatingLabel | null;
    onChange: (value: RatingLabel) => void;
}

export function RatingScale({ name, value, onChange }: RatingScaleProps) {
    return (
        <div role="radiogroup" aria-label={name} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RATING_OPTIONS.map((opt) => {
                const active = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(opt.value)}
                        className={[
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                            active
                                ? ACTIVE_STYLES[opt.value]
                                : "border-[var(--color-ink)]/10 bg-white text-[var(--color-ink)]/60 hover:bg-[var(--color-sand)]",
                        ].join(" ")}
                    >
                        <span
                            className={[
                                "h-2 w-2 shrink-0 rounded-full",
                                active ? DOT_STYLES[opt.value] : "bg-[var(--color-ink)]/25",
                            ].join(" ")}
                        />
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}