"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QuestionRunner } from "./QuestionRunner";
import { getQuestion, submitMediaResponse, submitRatings, submitResponse } from "@/lib/api/mmi-actions";
import type { AnyResponseFeedback, ComposePayload, QuestionDetail, QuestionListItem, ResponseFeedback } from "@/types/mmi";

const STATION_LIST_HREF = "/onboarding/medical-school/format-mmi";

interface StationRunnerProps {
    basePath: string;
    formatLabel: string;
    stationListHref: string;
    slug: string;
    stationTitle: string;
    questionIds: QuestionListItem[];
    attemptId: string;
    initialIndex: number;
    initialQuestion: QuestionDetail;
}

export function StationRunner({
    basePath,
    formatLabel,
    stationListHref,
    slug,
    stationTitle,
    questionIds,
    attemptId,
    initialIndex,
    initialQuestion,
}: StationRunnerProps) {
    const router = useRouter();
    const [index, setIndex] = useState(initialIndex);
    const [question, setQuestion] = useState<QuestionDetail>(initialQuestion);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<AnyResponseFeedback | null>(null);
    const [isPending, startTransition] = useTransition();

    const goToIndex = useCallback(
        (nextIndex: number) => {
            const clamped = Math.max(0, Math.min(questionIds.length - 1, nextIndex));
            if (clamped === index) return;
            setError(null);
            setFeedback(null);
            startTransition(async () => {
                try {
                    const detail = await getQuestion(questionIds[clamped].id);
                    setQuestion(detail);
                    setIndex(clamped);
                    router.replace(`/${basePath}/${slug}?attempt=${attemptId}&q=${clamped}`, { scroll: false });
                } catch {
                    setError("Couldn't load that question. Try again.");
                }
            });
        },
        [index, questionIds, basePath, slug, attemptId, router]
    );

    const handleSubmit = useCallback(
        async (payload: ComposePayload) => {
            setSubmitting(true);
            setError(null);
            try {
                if (payload.mode === "written") {
                    const result = await submitResponse({ attemptId, questionId: question.id, text: payload.text });
                    setFeedback(result.feedback);
                } else if (payload.mode === "rated_items") {
                    const result = await submitRatings({ attemptId, questionId: question.id, ratings: payload.ratings });
                    setFeedback(result.feedback);
                } else {
                    const formData = new FormData();
                    formData.set("attemptId", attemptId);
                    formData.set("questionId", question.id);
                    formData.set("mediaType", payload.mode);
                    formData.set("media", payload.blob);
                    const result = await submitMediaResponse(formData);
                    setFeedback(result.feedback);
                }
            } catch {
                setError("Couldn't submit that response — your answer is still here, try again.");
                throw new Error("submit-failed");
            } finally {
                setSubmitting(false);
            }
        },
        [attemptId, question.id]
    );

    return (
        <>
            {error && (
                <div className="bg-[var(--color-coral)]/10 px-6 py-3 text-center text-sm text-[var(--color-coral)]">
                    {error}
                </div>
            )}
            <QuestionRunner
                question={question}
                breadcrumb={[
                    { label: formatLabel, href: stationListHref },
                    { label: stationTitle, href: `/${basePath}/${slug}` },
                    { label: `Question ${index + 1}` },
                ]}
                onExit={() => router.push(stationListHref)}
                onSubmit={handleSubmit}
                submitting={submitting}
                feedback={feedback}
                navPending={isPending}
                onPrev={() => goToIndex(index - 1)}
                onNext={() => goToIndex(index + 1)}
                hasPrev={index > 0}
                hasNext={index < questionIds.length - 1}
            />
        </>
    );
}