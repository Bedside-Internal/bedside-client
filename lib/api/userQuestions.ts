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