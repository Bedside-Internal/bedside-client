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
    // Next.js 15 route params are async — if you're still on 14, change this
    // to `{ slug: string }` and drop the `await` below.
    params: Promise<{ slug: string }>;
}

export default async function StationPage({ params }: StationPageProps) {
    const { slug } = await params;

    const [questions, attempt] = await Promise.all([
        getStationQuestions(slug),
        startAttempt(),
    ]);

    if (questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 text-center">
                <p className="text-sm text-[var(--color-ink)]/60">
                    No questions are available for this station yet.
                </p>
            </div>
        );
    }

    const firstQuestion = await getQuestion(questions[0].id);

    return (
        <StationRunner
            slug={slug}
            stationTitle={STATION_TITLES[slug] ?? slug}
            questionIds={questions}
            attemptId={attempt.attemptId}
            initialQuestion={firstQuestion}
        />
    );
}