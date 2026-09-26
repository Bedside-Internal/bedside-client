"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const SIZE_OPTIONS = [5, 10] as const;

interface SessionSizePickerProps {
    slug: string;
    basePath?: string;
    qid?: string;
    currentSize?: number;
    poolSize: number;
    canCustomize: boolean;
}

export function SessionSizePicker({
    slug,
    basePath = "mmi",
    qid,
    currentSize,
    poolSize,
    canCustomize,
}: SessionSizePickerProps) {
    const router = useRouter();

    function select(size: number | undefined) {
        const params = new URLSearchParams();
        if (qid) params.set("qid", qid);
        if (size) params.set("size", String(size));
        const qs = params.toString();
        router.push(`/${basePath}/${slug}${qs ? `?${qs}` : ""}`);
    }

    if (!canCustomize) {
        return (
            <div className="group relative flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)]/40">
                <Lock className="h-3 w-3" strokeWidth={2.5} />
                Session length: All {poolSize} questions
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-xs font-normal text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    Upgrade to choose how many questions a session covers.
                </div>
            </div>
        );
    }

    const options = [...SIZE_OPTIONS.filter((n) => n < poolSize), undefined];

    return (
        <div className="inline-flex items-center gap-1 rounded-xl bg-white p-1 shadow-[0_1px_2px_rgba(26,26,26,0.04)]">
            {options.map((opt) => {
                const active = opt === currentSize || (opt === undefined && !currentSize);
                return (
                    <button
                        key={opt ?? "all"}
                        type="button"
                        onClick={() => select(opt)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active
                                ? "bg-[var(--color-mint)] text-white"
                                : "text-[var(--color-ink)]/60 hover:bg-[var(--color-sand)]"
                            }`}
                    >
                        {opt ?? `All (${poolSize})`}
                    </button>
                );
            })}
        </div>
    );
}