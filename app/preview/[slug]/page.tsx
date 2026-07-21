import { redirect } from "next/navigation";
import { getStationQuestions, getQuestion, startAttempt } from "@/lib/api/mmi";
import { StationRunner } from "@/components/mmi/StationRunner";

interface PreviewStationPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string }>;
}

export default async function PreviewStationPage({ params, searchParams }: PreviewStationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam } = await searchParams;

    const { sectionTitle, questions } = await getStationQuestions(slug, "preview");

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this competency yet.
                </p>
            </div>
        );
    }

    if (!attemptParam) {
        const attempt = await startAttempt("preview");
        redirect(`/preview/${slug}?attempt=${attempt.attemptId}&q=0`);
    }

    const requestedIndex = qParam ? parseInt(qParam, 10) : 0;
    const index = Number.isFinite(requestedIndex)
        ? Math.max(0, Math.min(questions.length - 1, requestedIndex))
        : 0;

    const currentQuestion = await getQuestion(questions[index].id);

    return (
        <StationRunner
            basePath="preview"
            formatLabel="PREview"
            stationListHref="/onboarding/medical-school/format-preview"
            slug={slug}
            stationTitle={sectionTitle}
            questionIds={questions}
            attemptId={attemptParam}
            initialIndex={index}
            initialQuestion={currentQuestion}
        />
    );
}