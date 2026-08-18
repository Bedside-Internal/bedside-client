"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { TestimonialDTO, TestimonialAudience } from "@/types/marketing";

type Filter = "all" | "students" | "institutions";

const TABS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "students", label: "Students" },
    { id: "institutions", label: "Institutions" },
];

const audienceForFilter: Record<Exclude<Filter, "all">, TestimonialAudience> = {
    students: "applicant",
    institutions: "partner",
};

const accentClasses = {
    mint: "bg-mint",
    coral: "bg-coral",
    amber: "bg-amber",
    violet: "bg-violet",
} as const;

const delays = ["", "d1", "d2"] as const;

interface TestimonialsProps {
    testimonials: TestimonialDTO[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    const [filter, setFilter] = useState<Filter>("all");

    const visible = useMemo(() => {
        if (filter === "all") return testimonials;
        const audience = audienceForFilter[filter];
        return testimonials.filter((t) => t.audience === audience);
    }, [testimonials, filter]);

    // The API failing (or returning nothing yet) shouldn't take down the rest
    // of the landing page — just skip the section rather than rendering an
    // empty shell with a headline and no cards.
    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="bg-sand px-[5vw] py-[120px]">
            <div className="mx-auto max-w-[1160px]">
                <RevealOnScroll className="mb-10 text-center">
                    <div className="mx-auto mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-[5px]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="mx-auto max-w-[720px] font-display text-[clamp(38px,5vw,64px)] leading-none tracking-tighter text-ink">
                        Trusted by applicants and institutions.
                    </h2>
                </RevealOnScroll>

                <RevealOnScroll
                    delay="d1"
                    className="mb-12 flex flex-wrap justify-center gap-2.5"
                >
                    {TABS.map((tab) => {
                        const active = filter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFilter(tab.id)}
                                aria-pressed={active}
                                className={clsx(
                                    "rounded-full border-2 px-6 py-2.5 text-[15px] font-bold transition-colors duration-150",
                                    active
                                        ? "border-mint bg-mint text-ink"
                                        : "border-ink bg-white text-ink hover:bg-sand",
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </RevealOnScroll>

                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((t, i) => (
                        <RevealOnScroll key={t.id} delay={delays[i % 3]}>
                            <div className="h-full rounded-[20px] border border-black/5 bg-white p-7 shadow-[0_2px_14px_rgba(26,26,26,0.06)]">
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        aria-hidden
                                        className={clsx(
                                            "flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink text-sm font-bold text-ink",
                                            accentClasses[t.accent],
                                            t.avatarShape === "circle" ? "rounded-full" : "rounded-xl",
                                        )}
                                    >
                                        {t.avatarLabel}
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-bold leading-tight text-ink">
                                            {t.name}
                                        </div>
                                        <div className="text-[13px] leading-tight text-neutral-500">
                                            {t.subtitle}
                                        </div>
                                    </div>
                                </div>

                                <p className="mb-5 text-[15px] leading-relaxed text-neutral-600">
                                    {t.quote}
                                </p>

                                <div
                                    className={clsx(
                                        "text-[11px] font-bold uppercase tracking-wider",
                                        t.audience === "partner" ? "text-coral" : "text-mint",
                                    )}
                                >
                                    {t.audience === "partner" ? "Partner" : "Applicant"}
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}