import type { TutorialDefinition, TutorialStage, TutorialStep } from "./types";

const target = (name: string) => `[data-tour="${name}"]`;

export function casperTutorial(
    stage: TutorialStage,
    options: { hasResponseTimer?: boolean; hasFeedback?: boolean; videoResponse?: boolean } = {},
): TutorialDefinition {
    const steps: Record<TutorialStage, TutorialStep[]> = {
        overview: [
            { target: target("casper-competency-grid"), title: "Choose a competency", content: "Pick a competency to practice the situations and decisions CASPer assesses." },
            { target: `${target("casper-competency-grid")} ${target("station-progress")}`, title: "Track your sections", content: "Each card shows the available sections and your completed practice." },
            { target: target("casper-practice-options"), title: "Choose a practice mode", content: "Start a random section, use your own questions, or run a full mock test." },
        ],
        reading: [
            { target: target("question-scenario"), title: "Review the scenario", content: "Read or watch the situation carefully and identify the perspectives and priorities involved." },
            { target: target("reading-controls"), title: "Prepare your response", content: "Use the preparation timer to organize your answer, or start responding when ready." },
        ],
        responding: options.videoResponse ? [
            ...(options.hasResponseTimer ? [{ target: target("response-timer"), title: "Watch your time", content: "Keep your response focused while the timer runs." }] : []),
            { target: target("response-modes"), title: "Record your response", content: "Use the video recorder to deliver your answer. The tour never starts recording or requests camera access." },
            { target: target("response-submission"), title: "Submit for feedback", content: "Review your recording, then submit it when you are ready." },
        ] : [
            ...(options.hasResponseTimer ? [{ target: target("casper-timer"), title: "Manage the section timer", content: "The timer covers all questions in this section, so leave time for each response." }] : []),
            { target: target("casper-responses"), title: "Answer every prompt", content: "Respond directly to each question and explain the reasoning behind your choices." },
            { target: target("casper-submit"), title: "Submit the section", content: "Complete every prompt, then submit all responses together for feedback." },
        ],
        feedback: [
            { target: target("question-feedback"), title: "Review your feedback", content: options.hasFeedback === false ? "Your response was saved, but feedback is not available this time." : "Review your score and feedback before moving to the next section." },
        ],
    };

    return { format: "casper", stage, pausesTimer: stage === "reading" || (stage === "responding" && Boolean(options.hasResponseTimer)), steps: steps[stage] };
}
