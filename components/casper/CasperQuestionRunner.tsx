"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, User, Home } from "lucide-react";
import { TutorialOverlay } from "@/components/tutorials/TutorialOverlay";
import { useTutorial } from "@/hooks/useTutorial";
import { casperTutorial } from "@/lib/tutorials/casper";
import { Timer } from "../mmi/Timer";
import { ScenarioPanel } from "../mmi/ScenarioPanel";
import { ResponseFeedbackCard } from "../mmi/ResponseFeedbackCard";
import type { QuestionDetail, ResponseFeedback } from "@/types/formats";

interface Crumb { label: string; href?: string; }

interface CasperQuestionRunnerProps {
    question: QuestionDetail;
    breadcrumb: Crumb[];
    onExit: () => void;
    onSubmit: (responses: { promptId: string; text: string }[]) => Promise<void>;
    submitting?: boolean;
    feedback: ResponseFeedback | null;
    navPending?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    dashboardReady?: boolean;
    onDashboard?: () => void;
}

export function CasperQuestionRunner({
    question, breadcrumb, onExit, onSubmit, submitting = false, feedback,
    navPending = false, onPrev, onNext, hasPrev = false, hasNext = false,
    dashboardReady = false, onDashboard,
}: CasperQuestionRunnerProps) {
    const [texts, setTexts] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const tutorialDefinition = useMemo(() => casperTutorial(submitted ? "feedback" : "responding", {
        hasResponseTimer: question.scenario.response_time_seconds !== null,
        hasFeedback: Boolean(feedback),
    }), [submitted, question.scenario.response_time_seconds, feedback]);
    const tutorial = useTutorial(tutorialDefinition, !submitting && !navPending, question.id);
    const tutorialPaused = Boolean(tutorial.run);

    const navLocked = navPending;
    const allFilled = question.prompts.every((p) => (texts[p.id] ?? "").trim().length > 0);

    async function handleSubmit() {
        const responses = question.prompts.map((p) => ({ promptId: p.id, text: texts[p.id] ?? "" }));
        try {
            await onSubmit(responses);
            setSubmitted(true);
        } catch {
            // parent surfaces the error; stay editable
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {tutorial.run && <TutorialOverlay key={tutorial.run.id} run={tutorial.run} onEnd={tutorial.end} onPresented={tutorial.presented} />}
            <div className="flex items-center justify-between px-6 py-5">
                <nav className="flex items-center gap-2 text-sm">
                    {breadcrumb.map((crumb, i) => (
                        <span key={crumb.label} className="flex items-center gap-2">
                            {i > 0 && <span className="text-[var(--color-ink)]/30">›</span>}
                            <span className={i === breadcrumb.length - 1 ? "font-semibold text-[var(--color-ink)]" : "font-semibold text-[var(--color-mint-hover)]"}>
                                {crumb.label}
                            </span>
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <button type="button" onClick={tutorial.replay} disabled={!tutorial.canReplay || tutorialPaused}
                        aria-disabled={!tutorial.canReplay || tutorialPaused}
                        title={!tutorial.isSupported ? "Tutorials are available on larger screens" : "Replay the tutorial for this section"}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-ink)]/60 hover:bg-white focus-visible:outline-2 focus-visible:outline-mint disabled:cursor-not-allowed disabled:opacity-40">
                        Take the tour
                    </button>
                    <button type="button" onClick={onExit} aria-label="Exit station" className="rounded-lg p-2 text-[var(--color-ink)]/60 hover:bg-white">
                        <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
                    </button>
                    <button
                        type="button"
                        onClick={dashboardReady ? onDashboard : undefined}
                        disabled={!dashboardReady}
                        aria-label="Go to dashboard"
                        className={`rounded-lg p-2 transition ${dashboardReady ? "text-[var(--color-ink)]/60 hover:bg-white" : "cursor-not-allowed text-[var(--color-ink)]/25"}`}
                    >
                        <Home className="h-5 w-5" strokeWidth={2.25} />
                    </button>
                    <User className="h-6 w-6 text-[var(--color-ink)]/70" strokeWidth={1.75} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 px-6 pb-10 lg:grid-cols-2">
                <div className="flex flex-col lg:min-h-[600px]">
                    <div data-tour="question-scenario">
                        <ScenarioPanel text={question.scenario.text} videoUrl={question.scenario.video_url} />
                    </div>
                    <div className="mt-8 flex items-center gap-3">
                        <button type="button" disabled={!hasPrev || navLocked} onClick={onPrev} className="flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40">
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Prev
                        </button>
                        <button type="button" disabled={!hasNext || navLocked} onClick={onNext} className="flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40">
                            Next <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:pt-4">
                    {!submitted && question.scenario.response_time_seconds !== null && (
                        <div data-tour="casper-timer" className="flex items-center justify-between">
                            <Timer
                                isRunning={!tutorialPaused}
                                key={`respond-${question.id}`}
                                durationSeconds={question.scenario.response_time_seconds}
                                eyebrow="TIME REMAINING"
                                label={`for all ${question.prompts.length} questions`}
                                onComplete={handleSubmit}
                            />
                        </div>
                    )}

                    {!submitted && <div data-tour="casper-responses" className="flex flex-col gap-4">
                        {question.prompts.map((p, i) => (
                        <div key={p.id} className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)]">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-sand)] text-xs">Q{i + 1}</span>
                                {p.text}
                            </p>
                            <textarea
                                value={texts[p.id] ?? ""}
                                onChange={(e) => setTexts((t) => ({ ...t, [p.id]: e.target.value }))}
                                placeholder="Type your response here..."
                                rows={5}
                                className="w-full resize-none rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-sand)]/40 p-4 text-[15px] leading-relaxed text-[var(--color-ink)] outline-none focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20"
                            />
                            <p className="mt-1 text-right text-xs text-[var(--color-ink)]/40">Suggested: 3-5 sentences</p>
                        </div>
                        ))}
                    </div>}

                    {!submitted && (
                        <button
                            data-tour="casper-submit"
                            type="button"
                            disabled={!allFilled || submitting}
                            onClick={handleSubmit}
                            className="ml-auto flex items-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting ? "Submitting…" : "Submit all & get feedback"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    )}

                    {submitted && feedback && (
                        <div data-tour="question-feedback" className="flex flex-col gap-4">
                            <ResponseFeedbackCard feedback={feedback} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
