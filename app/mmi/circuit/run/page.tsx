import { redirect } from "next/navigation";
import { getCircuitAttempt } from "@/lib/api/circuit";
import { getQuestion } from "@/lib/api/mmi";
import { CircuitTransition } from "@/components/circuit/CircuitTransition";
import { CircuitStationRunner } from "@/components/circuit/CircuitStationRunner";

const STATION_TIPS: Record<string, string> = {
  communication: "In Communication stations, interviewers assess tone and empathy as much as content — slow down and listen.",
  "ethical-reasoning": "Structure your answer: acknowledge the situation → explore the angles → land on a position. Don't jump straight to a verdict.",
  "critical-thinking": "Think out loud — interviewers are scoring your reasoning process, not just your final answer.",
  "role-play": "Stay in character, but don't lose sight of the underlying goal of the scenario.",
  collaboration: "Show how you'd bring others in, not just what you'd decide alone.",
  "personal-reflective": "Specific personal examples land better than general statements about your values.",
};

interface CircuitRunPageProps {
  searchParams: Promise<{ attempt?: string; station?: string; phase?: string }>;
}

export default async function CircuitRunPage({ searchParams }: CircuitRunPageProps) {
  const { attempt: attemptId, station: stationParam, phase } = await searchParams;
  if (!attemptId) redirect("/mmi/circuit");

  const state = await getCircuitAttempt("mmi", attemptId);
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
        basePath="/mmi/circuit"
        unitLabel="Station"
        tips={STATION_TIPS}
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
      basePath="/mmi/circuit"
      resultsPath={(id) => `/mmi/circuit/${id}/results`}
      breadcrumbLabel="MMI Circuit"
    />
  );
}