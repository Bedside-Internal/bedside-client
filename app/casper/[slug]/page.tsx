import { getStationQuestions, getQuestion } from "@/lib/api/casper";
import { CasperStationRunner } from "@/components/casper/CasperStationRunner";
import { BeginStationButton } from "@/components/mmi/BeginStationButton";
import { getOnboardingProgress } from "@/lib/actions";

interface CasperStationPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string; qid?: string }>;
}

export default async function CasperStationPage({ params, searchParams }: CasperStationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam, qid: qidParam } = await searchParams;

    const [{ sectionTitle, questions }, progress] = await Promise.all([
        getStationQuestions(slug, "casper"),
        getOnboardingProgress(),
    ]);
    const dashboardReady = Boolean(progress?.track && progress?.format);

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">No questions are available for this competency yet.</p>
            </div>
        );
    }

    if (!attemptParam) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-cream)] px-6 text-center">
                <p className="text-lg font-semibold text-[var(--color-ink)]">{sectionTitle}</p>
                <p className="max-w-sm text-sm text-[var(--color-ink)]/60">Ready when you are — starting counts as one practice attempt.</p>
                <BeginStationButton formatSlug="casper" basePath="casper" slug={slug} qid={qidParam} />
            </div>
        );
    }

    const requestedIndex = qParam ? parseInt(qParam, 10) : 0;
    const index = Number.isFinite(requestedIndex) ? Math.max(0, Math.min(questions.length - 1, requestedIndex)) : 0;
    const currentQuestion = await getQuestion(questions[index].id);

    return (
        <CasperStationRunner
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