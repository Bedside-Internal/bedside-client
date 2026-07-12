"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SelectableCard } from "./SelectableCard";
import { saveFormat } from "@/lib/actions";
import { resolveIcon } from "@/lib/iconRegistry";
import type { PublicFeature } from "@/lib/features";

interface FormatSelectorProps {
    track?: string;
    // Fetched server-side by the parent page via getFeatures("format", toTrackId(track))
    // and passed down — this component itself never talks to the API directly,
    // since it's a client component and the features endpoint requires
    // server-side Clerk auth forwarding.
    formats: PublicFeature[];
}

export function FormatSelector({ track = "medical-school", formats }: FormatSelectorProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleContinue() {
        if (!selected) return;
        startTransition(async () => {
            await saveFormat(track, selected);
            router.push(`/onboarding/${track}/${selected}`);
        });
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {formats.map((format) => (
                    <SelectableCard
                        key={format.key}
                        variant="vertical"
                        icon={resolveIcon(format.icon)}
                        title={format.title}
                        description={format.subtitle}
                        disabled={!format.available}
                        selected={selected === format.key}
                        onSelect={format.available ? () => setSelected(format.key) : undefined}
                    />
                ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </button>

                <button
                    type="button"
                    disabled={!selected || isPending}
                    onClick={handleContinue}
                    className={`flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${selected && !isPending
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }`}
                >
                    {isPending ? "Saving..." : "Continue"}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </>
    );
}