import "server-only";
import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import type { CircuitPreview, CircuitAttemptState, CircuitResults } from "@/types/circuit";

export { ApiError };

export async function getCircuitPreview(formatSlug: string): Promise<CircuitPreview> {
  return serverApiFetch<CircuitPreview>(`/api/${formatSlug}/circuit/preview`);
}

export async function startCircuitAttempt(formatSlug: string): Promise<CircuitAttemptState> {
  return serverApiFetch<CircuitAttemptState>(`/api/${formatSlug}/circuit/attempts`, { method: "POST" });
}

export async function getCircuitAttempt(formatSlug: string, attemptId: string): Promise<CircuitAttemptState> {
  return serverApiFetch<CircuitAttemptState>(`/api/${formatSlug}/circuit/attempts/${encodeURIComponent(attemptId)}`);
}

export async function getCircuitResults(formatSlug: string, attemptId: string): Promise<CircuitResults> {
  return serverApiFetch<CircuitResults>(`/api/${formatSlug}/circuit/attempts/${encodeURIComponent(attemptId)}/results`);
}