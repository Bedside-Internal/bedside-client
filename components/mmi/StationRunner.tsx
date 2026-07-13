"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QuestionRunner } from "./QuestionRunner";
import { getQuestion, submitResponse } from "@/lib/api/mmi-actions";
import type { QuestionDetail, QuestionListItem, ResponseFeedback } from "@/types/mmi";

const STATION_LIST_HREF = "/onboarding/medical-school/format-mmi";

interface StationRunnerProps {
    slug: string;
    stationTitle: string;
    questionIds: QuestionListItem[];
    attemptId: string;
    initialIndex: number;
    initialQuestion: QuestionDetail;
}

export function StationRunner({
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
    const [feedback, setFeedback] = useState<ResponseFeedback | null>(null);
    const [isPending, startTransition] = useTransition();

    const goToIndex = useCallback(
        (nextIndex: number) => {
            const clamped = Math.max(0, Math.min(questionIds.length - 1, nextIndex));
            if (clamped === index) return;
            setError(null);
            setFeedback(null); // clear stale feedback before the new question loads
            startTransition(async () => {
                try {
                    const detail = await getQuestion(questionIds[clamped].id);
                    setQuestion(detail);
                    setIndex(clamped);
                    router.replace(`/mmi/${slug}?attempt=${attemptId}&q=${clamped}`, {
                        scroll: false,
                    });
                } catch {
                    setError("Couldn't load that question. Try again.");
                }
            });
        },
        [index, questionIds, slug, attemptId, router]
    );

    const handleSubmit = useCallback(
        async (text: string) => {
            setSubmitting(true);
            setError(null);
            try {
                const result = await submitResponse({ attemptId, questionId: question.id, text });
                setFeedback(result.feedback);
            } catch {
                setError(
                    "Couldn't submit that response — your answer is still here, try again."
                );
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
                    { label: "MMI", href: STATION_LIST_HREF },
                    { label: stationTitle, href: `/mmi/${slug}` },
                    { label: `Question ${index + 1}` },
                ]}
                onExit={() => router.push(STATION_LIST_HREF)}
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