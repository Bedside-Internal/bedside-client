export type ResponseMode = "written" | "audio" | "video";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionListItem {
    id: string;
    difficulty: Difficulty;
}

export interface QuestionDetail {
    id: string;
    scenario: {
        text: string;
        reading_time_seconds: number;
        response_mode: ResponseMode;
        response_time_seconds: number;
    };
    guidance_note: string;
    difficulty: Difficulty;
}

export interface Attempt {
    attemptId: string;
    formatSlug: string;
    startedAt: string;
}

export interface SubmitResponsePayload {
    attemptId: string;
    questionId: string;
    text: string;
}

export interface SubmitResponseResult {
    responseId: string;
    responseDocId: string;
}

export interface ApiErrorPayload {
    error: unknown;
}