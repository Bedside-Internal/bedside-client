import { getCircuitResults } from "@/lib/api/circuit";
import { CircuitResultsView } from "@/components/circuit/CircuitResultsView";

interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function CasperFullMockResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;
  const results = await getCircuitResults("casper", attemptId);

  return (
    <CircuitResultsView
      results={results}
      completeLabel="Mock test complete"
      breakdownLabel="Competency breakdown"
      backHref="/onboarding/medical-school/format-casper"
      formatSlug="casper"
      basePath="/casper/full"
      runAnotherLabel="Run another mock test →"
    />
  );
}