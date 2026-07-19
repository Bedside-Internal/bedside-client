import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { CircuitPreview, CircuitAttemptState, CircuitResults } from "@/types/circuit";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Circuit API request failed (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getCircuitPreview(): Promise<CircuitPreview> {
  return authedFetch<CircuitPreview>("/api/mmi/circuit/preview");
}

export async function startCircuitAttempt(): Promise<CircuitAttemptState> {
  return authedFetch<CircuitAttemptState>("/api/mmi/circuit/attempts", { method: "POST" });
}

export async function getCircuitAttempt(attemptId: string): Promise<CircuitAttemptState> {
  return authedFetch<CircuitAttemptState>(`/api/mmi/circuit/attempts/${encodeURIComponent(attemptId)}`);
}

export async function getCircuitResults(attemptId: string): Promise<CircuitResults> {
  return authedFetch<CircuitResults>(`/api/mmi/circuit/attempts/${encodeURIComponent(attemptId)}/results`);
}