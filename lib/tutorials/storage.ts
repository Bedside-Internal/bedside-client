import type { TutorialProgress, TutorialStage, TutorialStatus } from "./types";

const memory = new Map<string, TutorialProgress>();
const stages: TutorialStage[] = ["overview", "reading", "responding", "feedback"];

export function tutorialStorageKey(userId: string, format: string): string {
    return `bedside:tutorial:v1:${userId}:${format}`;
}

function parseProgress(value: string): TutorialProgress {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid tutorial state");
    const record = parsed as Record<string, unknown>;
    if (typeof record.dismissed !== "boolean" || !record.stages || typeof record.stages !== "object") {
        throw new Error("Invalid tutorial state");
    }
    const result: TutorialProgress = { dismissed: record.dismissed, stages: {} };
    for (const stage of stages) {
        const status = (record.stages as Record<string, unknown>)[stage];
        if (status !== undefined && status !== "presented" && status !== "completed") {
            throw new Error("Invalid tutorial status");
        }
        if (status) result.stages[stage] = status;
    }
    return result;
}

export function readTutorialProgress(key: string): TutorialProgress {
    try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
            const stored = parseProgress(raw);
            // Keep successful in-memory writes when persistent writes were rejected.
            const cached = memory.get(key);
            if (!cached) return stored;
            for (const stage of stages) {
                if (cached.stages[stage] === "completed" || !stored.stages[stage]) {
                    if (cached.stages[stage]) stored.stages[stage] = cached.stages[stage];
                }
            }
            stored.dismissed ||= cached.dismissed;
            return stored;
        }
    } catch {
        // Storage can be denied or contain data from a corrupt/older record.
    }
    const cached = memory.get(key);
    return { dismissed: cached?.dismissed ?? false, stages: { ...cached?.stages } };
}

export function updateTutorialProgress(
    key: string,
    stage: TutorialStage,
    update: TutorialStatus | "dismissed",
): void {
    const progress = readTutorialProgress(key);
    if (update === "dismissed") progress.dismissed = true;
    else if (progress.stages[stage] !== "completed") progress.stages[stage] = update;
    memory.set(key, progress);
    try {
        window.localStorage.setItem(key, JSON.stringify(progress));
    } catch {
        // The current browser session still remembers this choice.
    }
}
