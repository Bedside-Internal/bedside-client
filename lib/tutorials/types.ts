export type TutorialStage = "overview" | "reading" | "responding" | "feedback";
export type TutorialStatus = "presented" | "completed";
export type TutorialOutcome = "completed" | "dismissed" | "interrupted";
export type TutorialFormat = "mmi" | "preview" | "casper" | "dashboard" | "my-questions";

export interface TutorialProgress {
    dismissed: boolean;
    stages: Partial<Record<TutorialStage, TutorialStatus>>;
}

export interface TutorialStep {
    target: string;
    title: string;
    content: string;
}

export interface TutorialDefinition {
    format: TutorialFormat;
    stage: TutorialStage;
    pausesTimer: boolean;
    steps: TutorialStep[];
}

/** Opt in at the route, never by inspecting a shared component's location. */
export interface TutorialContext {
    format: "mmi" | "preview" | "casper";
    practiceKind: "single-station";
}
