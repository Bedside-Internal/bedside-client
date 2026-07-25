import { getCircuitResults } from "@/lib/api/circuit";
import { CircuitResultsView } from "@/components/circuit/CircuitResultsView";

interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function CircuitResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;
  const results = await getCircuitResults("mmi", attemptId);

  return (
    <CircuitResultsView
      results={results}
      completeLabel="Full circuit complete"
      breakdownLabel="Station breakdown"
      backHref="/onboarding/medical-school/format-mmi"
      formatSlug="mmi"
      basePath="/mmi/circuit"
      runAnotherLabel="Run another circuit →"
    />
  );
}