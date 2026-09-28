import type { TutorialDefinition } from "./types";

const target = (name: string) => `[data-tour="${name}"]`;

export function dashboardTutorial(): TutorialDefinition {
    return {
        format: "dashboard",
        stage: "overview",
        pausesTimer: false,
        steps: [
            { target: target("dashboard-formats"), title: "Continue your practice", content: "Open a format to resume practice and see your recent progress." },
            { target: target("dashboard-actions"), title: "Use quick actions", content: "Jump to useful tools, including your saved and submitted questions." },
            { target: target("dashboard-readiness"), title: "Follow your progress", content: "Review readiness, performance trends, recent activity, and your practice streak." },
        ],
    };
}

export function myQuestionsTutorial(): TutorialDefinition {
    return {
        format: "my-questions",
        stage: "overview",
        pausesTimer: false,
        steps: [
            { target: target("questions-usage"), title: "Check your allowance", content: "See how much question generation and importing is available on your plan." },
            { target: target("questions-tools"), title: "Choose how to add questions", content: "Submit a question for review, generate one with AI, or import questions and decks." },
            { target: target("questions-library"), title: "Manage your questions", content: "Review question status, sharing options, and available practice actions here." },
        ],
    };
}
