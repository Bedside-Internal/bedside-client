"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QuestionRunner } from "../circuit/QuestionRunner";
import { CasperQuestionRunner } from "./CasperQuestionRunner";
import { getQuestion, submitResponse, submitMediaResponse } from "@/lib/api/mmi-actions";
import type { ComposePayload, QuestionDetail, QuestionListItem, ResponseFeedback } from "@/types/formats";

interface CasperStationRunnerProps {
    slug: string;
    stationTitle: string;
    questionIds: QuestionListItem[];
    attemptId: string;
    initialIndex: number;
    initialQuestion: QuestionDetail;
    dashboardReady: boolean;
}

export function CasperStationRunner({
    slug, stationTitle, questionIds, attemptId, initialIndex, initialQuestion, dashboardReady,
}: CasperStationRunnerProps) {
    const router = useRouter();
    const [index, setIndex] = useState(initialIndex);
    const [question, setQuestion] = useState<QuestionDetail>(initialQuestion);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<ResponseFeedback | null>(null);
    const [isPending, startTransition] = useTransition();

    const breadcrumb = [
        { label: "CASPer", href: "/onboarding/medical-school/format-casper" },
        { label: stationTitle, href: `/casper/${slug}` },
        { label: `Question ${index + 1}` },
    ];

    const goToIndex = useCallback((nextIndex: number) => {
        const clamped = Math.max(0, Math.min(questionIds.length - 1, nextIndex));
        if (clamped === index) return;
        setError(null);
        setFeedback(null);
        startTransition(async () => {
            try {
                const detail = await getQuestion(questionIds[clamped].id);
                setQuestion(detail);
                setIndex(clamped);
                router.replace(`/casper/${slug}?attempt=${attemptId}&q=${clamped}`, { scroll: false });
            } catch {
                setError("Couldn't load that question. Try again.");
            }
        });
    }, [index, questionIds, slug, attemptId, router]);


    const handleWrittenSubmit = useCallback(async (responses: { promptId: string; text: string }[]) => {
        setSubmitting(true);
        setError(null);
        try {
            const result = await submitResponse({ attemptId, questionId: question.id, responses });
            setFeedback(result.feedback);
        } catch {
            setError("Couldn't submit that response; your answers are still here, try again.");
            throw new Error("submit-failed");
        } finally {
            setSubmitting(false);
        }
    }, [attemptId, question.id]);

    const handleVideoSubmit = useCallback(async (payload: ComposePayload) => {
        setSubmitting(true);
        setError(null);
        try {
            if (payload.mode === "video" || payload.mode === "audio") {
                const formData = new FormData();
                formData.set("attemptId", attemptId);
                formData.set("questionId", question.id);
                formData.set("mediaType", payload.mode);
                formData.set("media", payload.blob);
                const result = await submitMediaResponse(formData);
                setFeedback(result.feedback);
            }
        } catch {
            setError("Couldn't submit that response; try recording again.");
            throw new Error("submit-failed");
        } finally {
            setSubmitting(false);
        }
    }, [attemptId, question.id]);

    return (
        <>
            {error && (
                <div className="bg-[var(--color-coral)]/10 px-6 py-3 text-center text-sm text-[var(--color-coral)]">
                    {error}
                </div>
            )}
            {question.scenario.response_mode === "video" ? (
                <QuestionRunner
                    question={question}
                    breadcrumb={breadcrumb}
                    onExit={() => router.push("/onboarding/medical-school/format-casper")}
                    dashboardReady={dashboardReady}
                    onDashboard={() => router.push("/dashboard")}
                    onSubmit={handleVideoSubmit}
                    submitting={submitting}
                    feedback={feedback}
                    navPending={isPending}
                    onPrev={() => goToIndex(index - 1)}
                    onNext={() => goToIndex(index + 1)}
                    hasPrev={index > 0}
                    hasNext={index < questionIds.length - 1}
                    composerProps={{ allowedModes: ["video"] }}
                />
            ) : (
                <CasperQuestionRunner
                    question={question}
                    breadcrumb={breadcrumb}
                    onExit={() => router.push("/onboarding/medical-school/format-casper")}
                    dashboardReady={dashboardReady}
                    onDashboard={() => router.push("/dashboard")}
                    onSubmit={handleWrittenSubmit}
                    submitting={submitting}
                    feedback={feedback}
                    navPending={isPending}
                    onPrev={() => goToIndex(index - 1)}
                    onNext={() => goToIndex(index + 1)}
                    hasPrev={index > 0}
                    hasNext={index < questionIds.length - 1}
                />
            )}
        </>
    );
}