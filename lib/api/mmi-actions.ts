"use server";

import { getQuestion as fetchQuestion, submitResponse as postResponse } from "./mmi";
import type {
    QuestionDetail,
    SubmitResponsePayload,
    SubmitResponseResult,
} from "@/types/mmi";

export async function getQuestion(questionId: string): Promise<QuestionDetail> {
    return fetchQuestion(questionId);
}

export async function submitResponse(
    payload: SubmitResponsePayload
): Promise<SubmitResponseResult> {
    return postResponse(payload);
}