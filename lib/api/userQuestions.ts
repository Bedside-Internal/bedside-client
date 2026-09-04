import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import type {
    UserSubmittedQuestion,
    CreateUserQuestionInput,
    CreateUserQuestionResponse,
} from "@/types/userQuestions";

export const UserQuestionsApiError = ApiError;

/** Server-Component-only — call to get user's submitted questions. */
export async function getMyQuestions(): Promise<UserSubmittedQuestion[]> {
    return serverApiFetch<UserSubmittedQuestion[]>("/api/questions/mine");
}

/** Server-Component-only — call to submit a new question. */
export async function createUserQuestion(
    input: CreateUserQuestionInput,
): Promise<CreateUserQuestionResponse> {
    return serverApiFetch<CreateUserQuestionResponse>("/api/questions/mine", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export interface QuotaStatus {
    used: number;
    limit: number;
    periodEnd: string; // ISO date string
}

export interface UsageSummary {
    submission: QuotaStatus;
    generation: QuotaStatus;
}

/** Server-Component-only — this month's submission/generation usage. */
export async function getUsageSummary(): Promise<UsageSummary> {
    return serverApiFetch<UsageSummary>("/api/questions/usage");
}

export interface SectionOption {
    id: string;
    slug: string;
    title: string;
}

export async function getQuestionSections(formatSlug = "mmi"): Promise<SectionOption[]> {
    return serverApiFetch<SectionOption[]>(`/api/questions/sections?format=${encodeURIComponent(formatSlug)}`);
}

export interface ScoringDimension {
    label: string;
    weight: number;
}

export interface QuestionDraftResponse {
    sectionId: string;
    difficulty: "easy" | "medium" | "hard";
    model: string;
    draft: {
        scenario_text: string;
        guidance_note: string;
        model_answer: string;
        scoring_rubric: { dimensions: ScoringDimension[] };
    };
}

export interface ConfirmPrivateQuestionInput {
    sectionId: string;
    difficulty: "easy" | "medium" | "hard";
    scenarioText: string;
    guidanceNote: string;
    modelAnswer: string;
    scoringRubric: { dimensions: ScoringDimension[] };
}

export interface PrivateQuestionResult {
    id: string;
    sectionId: string;
    scope: "private";
    isActive: boolean;
}

export interface MyPrivateQuestion {
    id: string;
    sectionId: string;
    sectionSlug: string;
    sectionTitle: string;
    difficulty: "easy" | "medium" | "hard";
    isActive: boolean;
    scope: "private" | "pending_public" | "public";
    createdAt: string;
}

export async function getMyPrivateQuestions(): Promise<MyPrivateQuestion[]> {
    return serverApiFetch<MyPrivateQuestion[]>("/api/questions/mine/private");
}

export interface FormatOption {
    id: string;
    slug: string;
    title: string;
}

export async function getQuestionFormats(): Promise<FormatOption[]> {
    return serverApiFetch<FormatOption[]>("/api/questions/formats");
}