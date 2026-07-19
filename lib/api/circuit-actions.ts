"use server";

import { startCircuitAttempt as startCircuitAttemptServer } from "@/lib/api/circuit";
import type { CircuitAttemptState } from "@/types/circuit";

export async function startCircuit(): Promise<CircuitAttemptState> {
    return startCircuitAttemptServer();
}