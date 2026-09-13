export type ResponseMode = "written" | "audio" | "video" | "rated_items";
export type Difficulty = "easy" | "medium" | "hard";
export type RatingLabel = "very_ineffective" | "ineffective" | "effective" | "very_effective";

export interface FormatOverviewItem {
    icon: string;
    title: string;
    description: string;
    href: string;
    totalQuestions: number;
    completedQuestions: number;
}

export interface QuestionListItem {
    id: string;
    difficulty: Difficulty;
}

export interface ResponseItemDetail {
    id: string;
    text: string;
}

export interface QuestionDetail {
    id: string;
    scenario: {
        text: string;
        video_url: string | null;
        reading_time_seconds: number;
        response_mode: ResponseMode;
        response_time_seconds: number | null;
    };
    prompts: ScenarioPrompt[]; // length 1 for MMI/PREview, 2 for CASPer
    guidance_note: string;
    difficulty: Difficulty;
    response_items?: ResponseItemDetail[];
}

export interface Attempt {
    attemptId: string;
    formatSlug: string;
    startedAt: string;
}

export type ComposePayload =
    | { mode: "written"; text: string }
    | { mode: "audio" | "video"; blob: Blob }
    | { mode: "rated_items"; ratings: { itemId: string; rating: RatingLabel }[] };

export interface SubmitResponsePayload {
    attemptId: string;
    questionId: string;
    responses: { promptId: string; text: string }[];
}

export interface SubmitResponseResult {
    responseId: string;
    responseDocId: string;
    feedback: ResponseFeedback | null;
}

export interface SubmitMediaResponsePayload {
    attemptId: string;
    questionId: string;
    mediaType: "audio" | "video";
    blob: Blob;
}

export interface SubmitRatingsPayload {
    attemptId: string;
    questionId: string;
    ratings: { itemId: string; rating: RatingLabel }[];
}

export interface DimensionScore {
    label: string;
    score: number;
    rationale: string;
}

export interface ResponseFeedback {
    overallScore: number;
    dimensionScores: DimensionScore[];
    promptScores: PromptScore[];
    strengths: string[];
    areasToImprove: string[];
    summary: string;
    tier: "basic" | "full";
}

export interface RatingItemResult {
    itemId: string;
    itemText: string;
    submittedRating: RatingLabel;
    correctRating: RatingLabel;
    pointsEarned: number;
}

export interface RatingResponseFeedback {
    overallScore: number;
    items: RatingItemResult[];
}

export interface SubmitRatingResult {
    responseId: string;
    responseDocId: string;
    feedback: RatingResponseFeedback;
}

/** Discriminate with `"items" in feedback */
export type AnyResponseFeedback = ResponseFeedback | RatingResponseFeedback;

export interface ApiErrorPayload {
    error: unknown;
}

export interface SectionQuestions {
    sectionTitle: string;
    questions: QuestionListItem[];
}

export interface CompetencyDTO {
    icon: string;
    title: string;
    description: string;
    href: string;
    totalScenarios: number;
    completedScenarios: number;
}

export interface ScenarioPrompt {
    id: string;
    text: string;
}

export interface PromptScore {
    promptId: string;
    score: number;
}