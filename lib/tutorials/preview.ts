import type { TutorialDefinition, TutorialStage, TutorialStep } from "./types";

const target = (name: string) => `[data-tour="${name}"]`;

export function previewTutorial(
    stage: TutorialStage,
    options: { hasResponseTimer?: boolean; hasFeedback?: boolean } = {},
): TutorialDefinition {
    const steps: Record<TutorialStage, TutorialStep[]> = {
        overview: [
            { target: target("preview-competency-grid"), title: "Choose a competency", content: "Pick a competency to practice the kinds of judgment it measures." },
            { target: `${target("preview-competency-grid")} ${target("station-progress")}`, title: "Track your scenarios", content: "Each card shows how many scenarios are available and how many you have completed." },
            { target: target("preview-practice-options"), title: "Choose a practice mode", content: "Start a quick random scenario, use your own questions, or run a full mock test." },
        ],
        reading: [
            { target: target("question-scenario"), title: "Review the situation and scale", content: "Read the scenario, then review the effectiveness scale before rating each response independently." },
            { target: target("reading-controls"), title: "Use your preparation time", content: "The reading timer gives you time to assess the situation. You can begin rating early when ready." },
        ],
        responding: [
            ...(options.hasResponseTimer ? [{ target: target("response-timer"), title: "Watch your time", content: "Complete every rating before the response timer ends." }] : []),
            { target: target("rating-options"), title: "Rate every response", content: "Judge each option independently from very ineffective to very effective." },
            { target: target("rating-submission"), title: "Submit your ratings", content: "After rating every option, submit to see the answer breakdown." },
        ],
        feedback: [
            { target: target("question-feedback"), title: "Review the rationale", content: options.hasFeedback === false ? "Your ratings were saved, but feedback is not available this time." : "Compare your ratings with the expected answers and review the rationale before continuing." },
        ],
    };

    return { format: "preview", stage, pausesTimer: stage === "reading" || (stage === "responding" && Boolean(options.hasResponseTimer)), steps: steps[stage] };
}
