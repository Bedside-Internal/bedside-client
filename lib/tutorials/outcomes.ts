import type { TutorialOutcome, TutorialStatus } from "./types";

export function progressUpdateForOutcome(
    automatic: boolean,
    outcome: TutorialOutcome,
): TutorialStatus | "dismissed" | null {
    if (outcome === "completed") return "completed";
    if (outcome === "dismissed" && automatic) return "dismissed";
    return null;
}
