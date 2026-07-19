import { redirect } from "next/navigation";
import { getCircuitAttempt } from "@/lib/api/circuit";
import { getQuestion } from "@/lib/api/mmi";
import { CircuitTransition } from "@/components/mmi/CircuitTransition";
import { CircuitStationRunner } from "@/components/mmi/CircuitStationRunner";

interface CircuitRunPageProps {
  searchParams: Promise<{ attempt?: string; station?: string; phase?: string }>;
}

export default async function CircuitRunPage({ searchParams }: CircuitRunPageProps) {
  const { attempt: attemptId, station: stationParam, phase } = await searchParams;
  if (!attemptId) redirect("/mmi/circuit");

  const state = await getCircuitAttempt(attemptId);
  const stationIndex = stationParam ? parseInt(stationParam, 10) : 0;
  const index = Number.isFinite(stationIndex) ? Math.max(0, Math.min(state.stations.length - 1, stationIndex)) : 0;
  const currentStation = state.stations[index];

  if (!currentStation) redirect("/mmi/circuit");

  if (phase === "transition" && index > 0) {
    return (
      <CircuitTransition
        attemptId={attemptId}
        stations={state.stations}
        currentIndex={index}
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
    />
  );
}