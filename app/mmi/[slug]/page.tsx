import { redirect } from "next/navigation";
import { getStationQuestions, getQuestion, startAttempt } from "@/lib/api/mmi";
import { StationRunner } from "@/components/mmi/StationRunner";

const STATION_TITLES: Record<string, string> = {
    "ethical-reasoning": "Ethical Reasoning",
    communication: "Communication",
    "critical-thinking": "Critical Thinking",
    "role-play": "Role Play",
    collaboration: "Collaboration",
    "personal-reflective": "Personal & Reflective",
};

interface StationPageProps {
    // Next.js 16: both params and searchParams are async.
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ attempt?: string; q?: string }>;
}

export default async function StationPage({ params, searchParams }: StationPageProps) {
    const { slug } = await params;
    const { attempt: attemptParam, q: qParam } = await searchParams;

    const questions = await getStationQuestions(slug);

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this station yet.
                </p>
            </div>
        );
    }

    // First visit: no attempt in the URL yet. Start one, then redirect so the
    // attemptId + question index live in the URL — a refresh resumes here
    // instead of silently starting a brand-new attempt at question 1.
    if (!attemptParam) {
        const attempt = await startAttempt();
        redirect(`/mmi/${slug}?attempt=${attempt.attemptId}&q=0`);
    }

    const requestedIndex = qParam ? parseInt(qParam, 10) : 0;
    const index = Number.isFinite(requestedIndex)
        ? Math.max(0, Math.min(questions.length - 1, requestedIndex))
        : 0;

    const currentQuestion = await getQuestion(questions[index].id);

    return (
        <StationRunner
            slug={slug}
            stationTitle={STATION_TITLES[slug] ?? slug}
            questionIds={questions}
            attemptId={attemptParam}
            initialIndex={index}
            initialQuestion={currentQuestion}
        />
    );
}