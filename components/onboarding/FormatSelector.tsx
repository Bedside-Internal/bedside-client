"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Users, Grid2x2, Monitor, Video, type LucideIcon } from "lucide-react";
import { SelectableCard } from "./SelectableCard";
import { saveFormat } from "@/lib/actions";

interface Format {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    disabled?: boolean;
}

const formats: Format[] = [
    {
        id: "traditional",
        icon: Users,
        title: "Traditional",
        description: "Panel & one-on-one interviews with faculty or an admissions committee",
    },
    {
        id: "mmi",
        icon: Grid2x2,
        title: "MMI",
        description: "Multiple Mini Interviews — timed ethical and situational stations in a circuit",
    },
    {
        id: "casper",
        icon: Monitor,
        title: "CASPer",
        description: "Situational Judgment Test — written and video responses completed online",
    },
    {
        id: "preview",
        icon: Video,
        title: "PREview",
        description: "Professional Readiness Evaluation — video-based assessment by Acuity Insights",
    },
];

export function FormatSelector({ track = "medical-school" }: { track?: string }) {
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
                        key={format.id}
                        variant="vertical"
                        icon={format.icon}
                        title={format.title}
                        description={format.description}
                        disabled={format.disabled}
                        selected={selected === format.id}
                        onSelect={format.disabled ? undefined : () => setSelected(format.id)}
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