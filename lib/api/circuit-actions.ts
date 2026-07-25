"use server";
import { startCircuitAttempt as startCircuitAttemptServer } from "@/lib/api/circuit";
import type { CircuitAttemptState } from "@/types/circuit";

export async function startCircuit(formatSlug: string): Promise<CircuitAttemptState> {
  return startCircuitAttemptServer(formatSlug);
}