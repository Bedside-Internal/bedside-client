"use server";

import { getQuestion as fetchQuestion, submitResponse as postResponse, submitMediaResponse as postMediaResponse, submitRatingResponse as postRatingResponse } from "./mmi";
import type {
    QuestionDetail,
    SubmitRatingResult,
    SubmitRatingsPayload,
    SubmitResponsePayload,
    SubmitResponseResult,
} from "@/types/mmi";
import { startAttempt as startAttemptServer } from "./mmi";

export type StartAttemptResult =
    | { ok: true; attemptId: string }
    | { ok: false; reason: "paywall" }
    | { ok: false; reason: "unknown" };

export async function startAttemptAction(formatSlug: string): Promise<StartAttemptResult> {
    try {
        const attempt = await startAttemptServer(formatSlug);
        return { ok: true, attemptId: attempt.attemptId };
    } catch (err) {
        const status = err && typeof err === "object" && "status" in err ? (err as { status: number }).status : null;
        if (status === 402) return { ok: false, reason: "paywall" };
        return { ok: false, reason: "unknown" };
    }
}

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