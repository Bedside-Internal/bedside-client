"use client";

import { useMemo, useState } from "react";
import { useTutorial } from "@/hooks/useTutorial";
import { mmiTutorial } from "@/lib/tutorials/mmi";
import type { TutorialContext } from "@/lib/tutorials/types";
import { TutorialOverlay } from "@/components/tutorials/TutorialOverlay";
import { ArrowLeft, ArrowRight, User, Home } from "lucide-react";
import { Timer } from "../mmi/Timer";
import { ScenarioPanel } from "../mmi/ScenarioPanel";
import { ComposerMode, ResponseComposer } from "../mmi/ResponseComposer";
import type { AnyResponseFeedback, ComposePayload, QuestionDetail } from "@/types/formats";
import { RatingTaskAndLegend } from "../mmi/RatingTaskAndLegend";
import { RatingFeedback } from "../mmi/RatingFeedback";
import { RatingPanel } from "../mmi/RatingPanel";
import { ResponseFeedbackCard } from "../mmi/ResponseFeedbackCard";

type Phase = "reading" | "responding" | "submitted";

interface Crumb {
    label: string;
    href?: string;
}

interface QuestionRunnerProps {
    tutorialContext?: TutorialContext;
    question: QuestionDetail;
    breadcrumb: Crumb[];
    onExit: () => void;
    onSubmit: (payload: ComposePayload) => Promise<void>;
    submitting?: boolean;
    feedback: AnyResponseFeedback | null;
    navPending?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    dashboardReady?: boolean;
    onDashboard?: () => void;
    composerProps?: { allowedModes?: ComposerMode[] };
}

export function QuestionRunner({
    question,
    breadcrumb,
    onExit,
    onSubmit,
    submitting = false,
    feedback,
    navPending = false,
    onPrev,
    onNext,
    hasPrev = false,
    hasNext = false,
    dashboardReady = false,
    onDashboard,
    composerProps,
    tutorialContext,
}: QuestionRunnerProps) {
    const [phase, setPhase] = useState<Phase>("reading");
    const [prevQuestionId, setPrevQuestionId] = useState(question.id);
    const isRatedItems = question.scenario.response_mode === "rated_items";

    const [recordingBusy, setRecordingBusy] = useState(false);
    const tutorialEligible = tutorialContext?.format === "mmi" && tutorialContext.practiceKind === "single-station" && !isRatedItems;
    const tutorialDefinition = useMemo(() => mmiTutorial(phase === "submitted" ? "feedback" : phase, {
        hasResponseTimer: question.scenario.response_time_seconds !== null,
        hasHints: Boolean(question.guidance_note),
        hasFeedback: Boolean(feedback),
    }), [phase, question.scenario.response_time_seconds, question.guidance_note, feedback]);
    const tutorial = useTutorial(tutorialDefinition, tutorialEligible && !submitting && !navPending && !recordingBusy &&
        !(phase === "reading" && question.scenario.reading_time_seconds <= 0), question.id);
    const tutorialPaused = Boolean(tutorial.run);

    const navLocked = phase === "responding" || navPending;
    const navLockedReason =
        phase === "responding" ? "Submit your response before moving on" : navPending ? "Loading…" : undefined;

    if (question.id !== prevQuestionId) {
        setPrevQuestionId(question.id);
        setPhase("reading");
    }

    async function handleSubmit(payload: ComposePayload) {
        try {
            await onSubmit(payload);
            setPhase("submitted");
        } catch {
            // Parent surfaces the error; stay in the responding phase.
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
                            <span
                                className={
                                    i === breadcrumb.length - 1
                                        ? "font-semibold text-[var(--color-ink)]"
                                        : "font-semibold text-[var(--color-mint-hover)]"
                                }
                            >
                                {crumb.label}
                            </span>
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    {tutorialEligible && (
                        <button type="button" onClick={tutorial.replay} disabled={!tutorial.canReplay || tutorialPaused}
                            title={recordingBusy ? "Finish recording before opening the tutorial" : "Replay the tutorial for this phase"}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-ink)]/60 hover:bg-white focus-visible:outline-2 focus-visible:outline-mint disabled:opacity-40">
                            Take the tour
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onExit}
                        aria-label="Exit station"
                        className="rounded-lg p-2 text-[var(--color-ink)]/60 hover:bg-white"
                    >
                        <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
                    </button>
                    <button
                        type="button"
                        onClick={dashboardReady ? onDashboard : undefined}
                        disabled={!dashboardReady}
                        aria-label="Go to dashboard"
                        title={dashboardReady ? "Go to dashboard" : "Finish onboarding to unlock your dashboard"}
                        className={`rounded-lg p-2 transition ${dashboardReady
                                ? "text-[var(--color-ink)]/60 hover:bg-white"
                                : "cursor-not-allowed text-[var(--color-ink)]/25"
                            }`}
                    >
                        <Home className="h-5 w-5" strokeWidth={2.25} />
                    </button>
                    <User className="h-6 w-6 text-[var(--color-ink)]/70" strokeWidth={1.75} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 px-6 pb-10 lg:grid-cols-2">
                <div className="flex flex-col lg:min-h-[600px]">
                    <div data-tour="question-scenario" className="flex flex-1 flex-col">
                        <ScenarioPanel
                            text={question.scenario.text}
                            footerHint={
                                phase === "reading" && !isRatedItems
                                    ? "Use this time to identify the key tensions and structure your response before the timer starts."
                                    : undefined
                            }
                        >
                            {isRatedItems && <RatingTaskAndLegend />}
                        </ScenarioPanel>
                    </div>

                    {/* Rated-items nav lives inside RatingPanel */}
                    {!isRatedItems && (
                        <div className="mt-8 flex items-center gap-3">
                            <button
                                type="button"
                                disabled={!hasPrev || navLocked}
                                onClick={onPrev}
                                title={navLockedReason}
                                className="flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                                Prev
                            </button>
                            <button
                                type="button"
                                disabled={!hasNext || navLocked}
                                onClick={onNext}
                                title={navLockedReason}
                                className="flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-8 lg:pt-4">
                    {phase === "reading" && (
                        <div data-tour="reading-controls" className="flex flex-col items-center gap-8">
                            <Timer
                                key={`read-${question.id}`}
                                durationSeconds={question.scenario.reading_time_seconds}
                                eyebrow="READING TIME"
                                label="to read"
                                isRunning={!tutorialPaused}
                                onComplete={() => setPhase("responding")}
                            />
                            <button
                                type="button"
                                onClick={() => setPhase("responding")}
                                className="flex items-center gap-1 rounded-xl bg-[var(--color-mint)] px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)]"
                            >
                                I&apos;m ready, start responding
                                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                        </div>
                    )}

                    {phase === "responding" && (
                        <div className="flex w-full max-w-xl flex-col items-center gap-6">
                            {question.scenario.response_time_seconds !== null && (
                                <div data-tour="response-timer">
                                    <Timer
                                        isRunning={!tutorialPaused}
                                        key={`respond-${question.id}`}
                                        durationSeconds={question.scenario.response_time_seconds}
                                        eyebrow="RESPONSE TIME"
                                        label="remaining"
                                    />
                                </div>
                            )}
                            <div className="w-full">
                                {isRatedItems && question.response_items ? (
                                    <RatingPanel
                                        items={question.response_items}
                                        submitting={submitting}
                                        onSubmit={(ratings) => handleSubmit({ mode: "rated_items", ratings })}
                                        onPrevQuestion={onPrev}
                                        hasPrevQuestion={hasPrev && !navPending}
                                    />
                                ) : (
                                    <ResponseComposer
                                        onRecordingBusyChange={setRecordingBusy}
                                        guidanceNote={question.guidance_note}
                                        submitting={submitting}
                                        onSubmit={handleSubmit}
                                        allowedModes={composerProps?.allowedModes}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {phase === "submitted" && (
                        <div data-tour="question-feedback" className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white px-8 py-8 shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)]">
                            {feedback && "items" in feedback ? (
                                <RatingFeedback feedback={feedback} />
                            ) : feedback ? (
                                <ResponseFeedbackCard feedback={feedback} />
                            ) : (
                                <div className="text-center">
                                    <span className="text-lg font-semibold text-[var(--color-ink)]">
                                        Response submitted
                                    </span>
                                    <p className="mt-2 text-sm text-[var(--color-ink)]/60">
                                        We saved your response, but AI feedback couldn&apos;t be generated this time.
                                    </p>
                                </div>
                            )}
                            {hasNext && (
                                <button
                                    type="button"
                                    onClick={onNext}
                                    className="mt-1 flex items-center justify-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)]"
                                >
                                    Next question
                                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}