import { getStationQuestions, getQuestion } from "@/lib/api/mmi";
import { StationRunner } from "@/components/mmi/StationRunner";
import { BeginStationButton } from "@/components/mmi/BeginStationButton";
import { getOnboardingProgress } from "@/lib/actions";

interface PreviewStationPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string }>;
}

export default async function PreviewStationPage({ params, searchParams }: PreviewStationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam } = await searchParams;

    const [{ sectionTitle, questions }, progress] = await Promise.all([
        getStationQuestions(slug, "preview"),
        getOnboardingProgress(),
    ]);

    const dashboardReady = Boolean(progress?.track && progress?.format);

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this competency yet.
                </p>
            </div>
        );
    }

    // No attempt started yet — show an explicit "Begin" step instead of
    // eagerly creating an attempt row on every page load (same fix as the
    // MMI station page).
    if (!attemptParam) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
                <p className="text-lg font-semibold text-[var(--color-ink)]">{sectionTitle}</p>
                <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                    Ready when you are — starting counts as one practice attempt.
                </p>
                <BeginStationButton formatSlug="preview" basePath="preview" slug={slug} />
            </div>
        );
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
            dashboardReady={dashboardReady}
        />
    );
}