import type { TutorialDefinition, TutorialStage, TutorialStep } from "./types";

const target = (name: string) => `[data-tour="${name}"]`;

export function mmiTutorial(
    stage: TutorialStage,
    options: { hasResponseTimer?: boolean; hasHints?: boolean; hasFeedback?: boolean } = {},
): TutorialDefinition {
    const steps: Record<TutorialStage, TutorialStep[]> = {
        overview: [
            { target: target("mmi-station-grid"), title: "Pick a station", content: "Each station focuses on a different MMI skill. Pick one to practice questions from that category." },
            { target: `${target("mmi-station-grid")} ${target("station-progress")}`, title: "See your progress", content: "See how many questions are in each station and how many you've completed." },
            { target: target("mmi-practice-options"), title: "Choose a practice mode", content: "Try a random station for a quick drill, or start a full circuit to run through a complete MMI." },
        ],
        reading: [
            { target: target("question-scenario"), title: "Read the scenario", content: "Read through the situation and think about the main points you want to address." },
            { target: target("reading-controls"), title: "Get ready to respond", content: "Use the reading timer to prepare your response. You can start early without waiting for the timer to end." },
        ],
        responding: [
            ...(options.hasResponseTimer ? [{ target: target("response-timer"), title: "Watch your time", content: "Keep an eye on the timer as you work through your response." }] : []),
            { target: target("response-modes"), title: "Choose a response type", content: "Respond with text, audio, or video. Switch between them depending on how you want to practice." },
            { target: target("response-submission"), title: "Submit for feedback", content: options.hasHints ? "Need help? Open a hint before submitting. When you're done, submit your response for feedback." : "Submit your response when you're done to get feedback." },
        ],
        feedback: [
            { target: target("question-feedback"), title: "Review your feedback", content: options.hasFeedback === false ? "Your response was saved, but feedback isn't available this time. You can still move on to the next question." : "Check your score, what you did well, and what you can improve before the next question." },
        ],
    };
    return { format: "mmi", stage, steps: steps[stage] };
}