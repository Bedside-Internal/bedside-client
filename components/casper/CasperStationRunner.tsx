"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CasperQuestionRunner } from "./CasperQuestionRunner";
import { getQuestion, submitResponse } from "@/lib/api/mmi-actions";
import type { QuestionDetail, QuestionListItem, ResponseFeedback } from "@/types/formats";

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

    const handleSubmit = useCallback(async (responses: { promptId: string; text: string }[]) => {
        setSubmitting(true);
        setError(null);
        try {
            const result = await submitResponse({ attemptId, questionId: question.id, responses });
            setFeedback(result.feedback);
        } catch {
            setError("Couldn't submit that response — your answers are still here, try again.");
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
            <CasperQuestionRunner
                question={question}
                breadcrumb={[
                    { label: "CASPer", href: "/onboarding/medical-school/format-casper" },
                    { label: stationTitle, href: `/casper/${slug}` },
                    { label: `Question ${index + 1}` },
                ]}
                onExit={() => router.push("/onboarding/medical-school/format-casper")}
                dashboardReady={dashboardReady}
                onDashboard={() => router.push("/dashboard")}
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