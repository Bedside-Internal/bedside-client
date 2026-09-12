import { redirect } from "next/navigation";
import { getCircuitAttempt } from "@/lib/api/circuit";
import { getQuestion } from "@/lib/api/mmi";
import { CircuitTransition } from "@/components/circuit/CircuitTransition";
import { CircuitStationRunner } from "@/components/circuit/CircuitStationRunner";
import { getOnboardingProgress } from "@/lib/actions";

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
            breadcrumbLabel="PREview Mock"
            exitHref="/onboarding/medical-school/format-preview"
            dashboardReady={dashboardReady}
        />
    );
}