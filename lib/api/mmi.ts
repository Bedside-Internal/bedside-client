import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import type {
    Attempt,
    QuestionDetail,
    SectionQuestions,
    SubmitMediaResponsePayload,
    SubmitRatingResult,
    SubmitRatingsPayload,
    SubmitResponsePayload,
    SubmitResponseResult,
} from "@/types/mmi";

// Kept as an alias so existing `instanceof MmiApiError` checks elsewhere
// (if any) keep working without a repo-wide rename.
export const MmiApiError = ApiError;

/** Server-Component-only — call once, when a station page first loads. */
export async function getStationQuestions(
    slug: string,
    formatSlug: string = "mmi",
): Promise<SectionQuestions> {
    return serverApiFetch<SectionQuestions>(
        `/api/mmi/sections/${encodeURIComponent(slug)}/questions?format=${encodeURIComponent(formatSlug)}`
    );
}

/** Server-Component-only — call once per circuit, before the first question renders. */
export async function startAttempt(formatSlug: string = "mmi"): Promise<Attempt> {
    return serverApiFetch<Attempt>("/api/mmi/attempts", {
        method: "POST",
        body: JSON.stringify({ formatSlug }),
    });
}

/** Server-only. Client components should call the wrapped version in mmi-actions.ts instead. */
export async function getQuestion(questionId: string): Promise<QuestionDetail> {
    return serverApiFetch<QuestionDetail>(
        `/api/mmi/questions/${encodeURIComponent(questionId)}`
    );
}

/** Server-only. Client components should call the wrapped version in mmi-actions.ts instead. */
export async function submitResponse(
    payload: SubmitResponsePayload
): Promise<SubmitResponseResult> {
    return serverApiFetch<SubmitResponseResult>("/api/mmi/responses", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function submitMediaResponse(
    payload: SubmitMediaResponsePayload
): Promise<SubmitResponseResult> {
    const formData = new FormData();
    formData.set("attemptId", payload.attemptId);
    formData.set("questionId", payload.questionId);
    formData.set("mediaType", payload.mediaType);
    formData.set("media", payload.blob); // field name must match multer's upload.single("media")

    return serverApiFetch<SubmitResponseResult>("/api/mmi/responses/media", {
        method: "POST",
        body: formData,
    });
}

export async function submitRatingResponse(
    payload: SubmitRatingsPayload
): Promise<SubmitRatingResult> {
    return serverApiFetch<SubmitRatingResult>("/api/mmi/responses/ratings", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}