import { redirect } from "next/navigation";
import { getCircuitAttempt } from "@/lib/api/circuit";
import { getQuestion } from "@/lib/api/mmi";
import { CircuitTransition } from "@/components/circuit/CircuitTransition";
import { CircuitStationRunner } from "@/components/circuit/CircuitStationRunner";
import { getOnboardingProgress } from "@/lib/actions";

// ⚠️ Confirm these keys match the actual `sections.slug` values for the
// "preview" format in Postgres — I inferred them from the competency
// names in your mock, not from the schema.
const SCENARIO_TIPS: Record<string, string> = {
    empathy: "Name the other person's feeling before you move to a solution — skipping straight to fixing it reads as dismissive.",
    "preview-collaboration": "Show how you'd bring others in, not just what you'd decide alone.",
    professionalism: "Boundaries and accountability read better than blanket positivity — it's fine to say what you won't do.",
    "conflict-management": "De-escalate first, then problem-solve. Jumping straight to 'who's right' usually backfires.",
    "self-awareness": "Specific personal examples land better than general statements about your values.",
    "preview-communication": "Clarity over cleverness — check that the other person actually understood, don't just deliver your point.",
    resilience: "Show that you stay solution-focused under pressure — don't dwell on what went wrong, show what you do next.",
    "problem-solving": "Think out loud — show your reasoning process, not just your final answer.",
};

interface PreviewFullMockRunPageProps {
    searchParams: Promise<{ attempt?: string; station?: string; phase?: string }>;
}

export default async function PreviewFullMockRunPage({ searchParams }: PreviewFullMockRunPageProps) {
    const { attempt: attemptId, station: stationParam, phase } = await searchParams;
    if (!attemptId) redirect("/preview/full");

    const [state, progress] = await Promise.all([
        getCircuitAttempt("preview", attemptId),
        getOnboardingProgress(),
      ]);
      const dashboardReady = Boolean(progress?.track && progress?.format);
    const stationIndex = stationParam ? parseInt(stationParam, 10) : 0;
    const index = Number.isFinite(stationIndex) ? Math.max(0, Math.min(state.stations.length - 1, stationIndex)) : 0;
    const currentStation = state.stations[index];
    if (!currentStation) redirect("/preview/full");

    if (phase === "transition" && index > 0) {
        return (
            <CircuitTransition
                attemptId={attemptId}
                stations={state.stations}
                currentIndex={index}
                basePath="/preview/full"
                unitLabel="Scenario"
                tips={SCENARIO_TIPS}
                defaultTip="Take a breath. Read the next scenario carefully before you start responding."
                exitHref="/onboarding/medical-school/format-preview"
                dashboardReady={dashboardReady}
            />
        );
    }

    const question = await getQuestion(currentStation.questionId);

    return (
        <CircuitStationRunner
            attemptId={attemptId}
            stations={state.stations}
            currentIndex={index}
            initialQuestion={question}
            basePath="/preview/full"
            resultsPath={(id) => `/preview/full/${id}/results`}
            breadcrumbLabel="PREview Mock"
            exitHref="/onboarding/medical-school/format-preview"
            dashboardReady={dashboardReady}
        />
    );
}