import { getStationQuestions, getQuestion } from "@/lib/api/mmi";
import { StationRunner } from "@/components/mmi/StationRunner";
import { BeginStationButton } from "@/components/mmi/BeginStationButton";
import { getOnboardingProgress } from "@/lib/actions";

interface StationPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string; qid?: string }>;
}

export default async function StationPage({ params, searchParams }: StationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam, qid: qidParam } = await searchParams;

    const [{ sectionTitle, questions }, progress] = await Promise.all([
        getStationQuestions(slug, "mmi"),
        getOnboardingProgress(),
    ]);

    const dashboardReady = Boolean(progress?.track && progress?.format);

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this station yet.
                </p>
            </div>
        );
    }

    // No attempt started yet — show an explicit "Begin" step instead of
    // eagerly creating an attempt row on every page load. This is the fix:
    // a stray page load, refresh, or back/forward navigation no longer
    // burns a real practice attempt; only an actual click does.
    if (!attemptParam) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
                <p className="text-lg font-semibold text-[var(--color-ink)]">{sectionTitle}</p>
                <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                    Ready when you are — starting counts as one practice attempt.
                </p>
                <BeginStationButton formatSlug="mmi" basePath="mmi" slug={slug} qid={qidParam} />
            </div>
        );
    }

    const qidIndex = qidParam ? questions.findIndex((q) => q.id === qidParam) : -1;
    const requestedIndex = qidIndex >= 0 ? qidIndex : (qParam ? parseInt(qParam, 10) : 0);
    const index = Number.isFinite(requestedIndex)
        ? Math.max(0, Math.min(questions.length - 1, requestedIndex))
        : 0;

    const currentQuestion = await getQuestion(questions[index].id);

    return (
        <StationRunner
            basePath="mmi"
            formatLabel="MMI"
            stationListHref="/onboarding/medical-school/format-mmi"
            slug={slug}
            stationTitle={sectionTitle}
            questionIds={questions}
            attemptId={attemptParam}
            initialIndex={index}
            initialQuestion={currentQuestion}
            dashboardReady={dashboardReady}
        />
    );
}