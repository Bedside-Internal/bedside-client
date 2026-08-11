import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { CircuitPreview, CircuitAttemptState, CircuitResults } from "@/types/circuit";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(`Circuit API request failed (${res.status}): ${path}`, res.status);
  return res.json() as Promise<T>;
}

export async function getCircuitPreview(formatSlug: string): Promise<CircuitPreview> {
  return authedFetch<CircuitPreview>(`/api/${formatSlug}/circuit/preview`);
}

export async function startCircuitAttempt(formatSlug: string): Promise<CircuitAttemptState> {
  return authedFetch<CircuitAttemptState>(`/api/${formatSlug}/circuit/attempts`, { method: "POST" });
}

export async function getCircuitAttempt(formatSlug: string, attemptId: string): Promise<CircuitAttemptState> {
  return authedFetch<CircuitAttemptState>(`/api/${formatSlug}/circuit/attempts/${encodeURIComponent(attemptId)}`);
}

export async function getCircuitResults(formatSlug: string, attemptId: string): Promise<CircuitResults> {
  return authedFetch<CircuitResults>(`/api/${formatSlug}/circuit/attempts/${encodeURIComponent(attemptId)}/results`);
}