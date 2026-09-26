"use server";

import { startCircuitAttempt as startCircuitAttemptServer, startMyQuestionsCircuitAttempt as startMyQuestionsCircuitAttemptServer, getMyRandomStation as getMyRandomStationServer } from "@/lib/api/circuit";
import type { CircuitAttemptState, MyRandomStationPick } from "@/types/circuit";

export async function startCircuit(formatSlug: string): Promise<CircuitAttemptState> {
  return startCircuitAttemptServer(formatSlug);
}

export type MyQuestionsActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "no_questions"; message: string }
  | { ok: false; reason: "unknown" };

function extractStatusAndMessage(err: unknown): { status: number | null; message: string | null } {
  const status = err && typeof err === "object" && "status" in err ? (err as { status: number }).status : null;
  const payload = err && typeof err === "object" && "payload" in err ? (err as { payload: unknown }).payload : null;
  const message = payload && typeof payload === "object" && "error" in payload ? String((payload as { error: unknown }).error) : null;
  return { status, message };
}

export async function startMyQuestionsCircuit(formatSlug: string): Promise<MyQuestionsActionResult<CircuitAttemptState>> {
  try {
    const attempt = await startMyQuestionsCircuitAttemptServer(formatSlug);
    return { ok: true, data: attempt };
  } catch (err) {
    const { status, message } = extractStatusAndMessage(err);
    if (status === 422) return { ok: false, reason: "no_questions", message: message ?? "You don't have your own questions for every station yet." };
    return { ok: false, reason: "unknown" };
  }
}

export async function fetchMyRandomStation(formatSlug: string): Promise<MyQuestionsActionResult<MyRandomStationPick>> {
  try {
    const pick = await getMyRandomStationServer(formatSlug);
    return { ok: true, data: pick };
  } catch (err) {
    const { status, message } = extractStatusAndMessage(err);
    if (status === 422) return { ok: false, reason: "no_questions", message: message ?? "You don't have any active questions of your own yet." };
    return { ok: false, reason: "unknown" };
  }
}