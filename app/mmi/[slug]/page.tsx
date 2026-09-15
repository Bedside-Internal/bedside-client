import { getStationQuestions, getQuestion } from "@/lib/api/mmi";
import { StationRunner } from "@/components/mmi/StationRunner";
import { BeginStationButton } from "@/components/mmi/BeginStationButton";
import { getOnboardingProgress } from "@/lib/actions";
import { getTierStatus } from "@/lib/api/tier";
import { SessionSizePicker } from "@/components/mmi/SessionSizePicker";

interface StationPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string; qid?: string; size?: string }>;
}

export default async function StationPage({ params, searchParams }: StationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam, qid: qidParam, size: sizeParam } = await searchParams;

    const parsedSize = sizeParam ? parseInt(sizeParam, 10) : undefined;
    const sessionSize = parsedSize && Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : undefined;

    const [{ sectionTitle, questions, totalAvailable }, progress, tierStatus] = await Promise.all([
        getStationQuestions(slug, "mmi", sessionSize),
        getOnboardingProgress(),
        getTierStatus(),
    ]);

    const dashboardReady = Boolean(progress?.track && progress?.format);
    const canCustomizeSessionSize = tierStatus.tier !== "free";

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this station yet.
                </p>
            </div>
        );
    }

    if (!attemptParam) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
                <p className="text-lg font-semibold text-[var(--color-ink)]">{sectionTitle}</p>
                <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                    Ready when you are, starting counts as one practice attempt.
                </p>
                <SessionSizePicker
                    slug={slug}
                    qid={qidParam}
                    currentSize={sessionSize}
                    poolSize={totalAvailable}
                    canCustomize={canCustomizeSessionSize}
                />
                <BeginStationButton formatSlug="mmi" basePath="mmi" slug={slug} qid={qidParam} size={sessionSize} />
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
            sessionSize={sessionSize}
        />
    );
}