import { getCircuitResults } from "@/lib/api/circuit";
import { CircuitResultsView } from "@/components/circuit/CircuitResultsView";

interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function PreviewFullMockResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;
  const results = await getCircuitResults("preview", attemptId);

  return (
    <CircuitResultsView
      results={results}
      completeLabel="Mock test complete"
      breakdownLabel="Competency breakdown"
      backHref="/onboarding/medical-school/format-preview"
      formatSlug="preview"
      basePath="/preview/full"
      runAnotherLabel="Run another mock test →"
    />
  );
}