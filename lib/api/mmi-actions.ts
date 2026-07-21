"use server";

import { getQuestion as fetchQuestion, submitResponse as postResponse, submitMediaResponse as postMediaResponse, submitRatingResponse as postRatingResponse } from "./mmi";
import type {
    QuestionDetail,
    SubmitRatingResult,
    SubmitRatingsPayload,
    SubmitResponsePayload,
    SubmitResponseResult,
} from "@/types/mmi";

export async function getQuestion(questionId: string): Promise<QuestionDetail> {
    return fetchQuestion(questionId);
}

export async function submitResponse(payload: SubmitResponsePayload): Promise<SubmitResponseResult> {
    return postResponse(payload);
}

export async function submitMediaResponse(formData: FormData): Promise<SubmitResponseResult> {
    const attemptId = formData.get("attemptId");
    const questionId = formData.get("questionId");
    const mediaType = formData.get("mediaType");
    const blob = formData.get("media");

    if (
        typeof attemptId !== "string" ||
        typeof questionId !== "string" ||
        (mediaType !== "audio" && mediaType !== "video") ||
        !(blob instanceof Blob)
    ) {
        throw new Error("Malformed media submission");
    }

    return postMediaResponse({ attemptId, questionId, mediaType, blob });
}

export async function submitRatings(payload: SubmitRatingsPayload): Promise<SubmitRatingResult> {
    return postRatingResponse(payload);
}