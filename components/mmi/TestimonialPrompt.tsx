"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import StarRating from "@/components/ui/StarRating";
import type { TestimonialEligibilityDTO, TestimonialNameDisplay } from "@/types/marketing";

interface TestimonialPromptProps {
    attemptId?: string;
}

type PromptState = "checking" | "hidden" | "asking" | "form" | "submitted";

const NAME_DISPLAY_OPTIONS: { value: TestimonialNameDisplay; label: string }[] = [
    { value: "full_name", label: "Full name" },
    { value: "first_name_only", label: "First name only" },
    { value: "anonymous", label: "Anonymous" },
];

const STICKER_BORDER = "border-2 border-ink shadow-[4px_4px_0px_0px_theme(colors.ink)]";

export default function TestimonialPrompt({ attemptId }: TestimonialPromptProps) {
    const apiFetch = useApiFetch();
    const [state, setState] = useState<PromptState>("checking");
    const [rating, setRating] = useState(0);
    const [quote, setQuote] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [nameDisplay, setNameDisplay] = useState<TestimonialNameDisplay>("first_name_only");
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { eligible } = await apiFetch<TestimonialEligibilityDTO>(
                    "/api/marketing/testimonials/eligibility",
                );
                if (!cancelled) setState(eligible ? "asking" : "hidden");
            } catch {
                if (!cancelled) setState("hidden"); // fail closed — never block the results page over this
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [apiFetch]);

    const handleDismiss = () => {
        setState("hidden");
        apiFetch("/api/marketing/testimonials/dismiss", { method: "POST" }).catch(() => { }); // fire-and-forget
    };

    const handleSubmit = async () => {
        if (!rating || quote.trim().length < 10 || !consent) return;
        setSubmitting(true);
        setError(null);
        try {
            await apiFetch("/api/marketing/testimonials/submit", {
                method: "POST",
                body: JSON.stringify({
                    rating,
                    quote: quote.trim(),
                    subtitle: subtitle.trim() || undefined,
                    audience: "applicant",
                    nameDisplay,
                    consentToPublish: true,
                    attemptId,
                }),
            });
            setState("submitted");
        } catch {
            setError("Couldn't submit that — mind trying again?");
        } finally {
            setSubmitting(false);
        }
    };

    if (state === "checking" || state === "hidden") return null;

    if (state === "submitted") {
        return (
            <div className={`rounded-2xl bg-white px-6 py-5 ${STICKER_BORDER}`}>
                <p className="text-sm font-medium text-ink">Thanks for the feedback — it means a lot. 🎉</p>
            </div>
        );
    }

    if (state === "asking") {
        return (
            <div className="flex flex-col gap-4">
                <p className="text-[17px] font-medium text-ink/80">
                    Got a sec? Tell us how this practice session went.
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setState("form")}
                        className={`rounded-full bg-amber px-6 py-3 text-[15px] font-bold text-ink transition-transform hover:-translate-y-0.5 ${STICKER_BORDER}`}
                    >
                        Leave feedback
                    </button>
                    <button
                        onClick={handleDismiss}
                        aria-label="Dismiss"
                        className="text-ink/30 transition-colors hover:text-ink/60"
                    >
                        <X size={22} />
                    </button>
                </div>
            </div>
        );
    }

    // state === "form"
    return (
        <div className={`relative w-full max-w-[420px] rounded-2xl bg-white px-7 py-6 ${STICKER_BORDER}`}>
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[19px] font-bold text-ink">Share your feedback</h3>
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss"
                    className="text-ink/40 transition-colors hover:text-ink/70"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="mb-5">
                <label className="mb-2 block text-[13px] font-medium text-ink/50">Your rating</label>
                <StarRating value={rating} onChange={setRating} size={28} />
            </div>

            <div className="mb-5">
                <label className="mb-2 block text-[13px] font-medium text-ink/50">Your quote</label>
                <textarea
                    rows={4}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="What stood out about your practice session?"
                    className="w-full resize-none rounded-lg border border-ink/15 bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-mint"
                />
            </div>

            <div className="mb-5">
                <label className="mb-2 block text-[13px] font-medium text-ink/50">
                    School <span className="text-ink/30">(optional)</span>
                </label>
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Harvard Medical School, MS2"
                    maxLength={120}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ink/40"
                />
            </div>

            <div className="mb-5">
                <label className="mb-2 block text-[13px] font-medium text-ink/50">Show my name as</label>
                <div className="flex gap-2">
                    {NAME_DISPLAY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setNameDisplay(opt.value)}
                            className={`flex-1 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${nameDisplay === opt.value
                                ? "bg-ink text-white"
                                : "border border-ink/15 bg-white text-ink hover:bg-sand"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <label className="mb-6 flex items-start gap-2.5 text-[13px] leading-snug text-ink/60">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-ink/25 accent-ink"
                />
                I agree Bedside may publicly display this quote and rating, along with the name option I selected
                above, on the website and in marketing materials.
            </label>

            {error && <p className="mb-3 text-[12px] text-coral">{error}</p>}

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !rating || quote.trim().length < 10 || !consent}
                    className="rounded-full bg-sand px-6 py-2.5 text-[14px] font-semibold text-ink/40 transition-colors enabled:bg-amber enabled:text-ink enabled:hover:bg-amber/90 disabled:cursor-not-allowed"
                >
                    {submitting ? "Sending…" : "Submit feedback"}
                </button>
            </div>
        </div>
    );
}