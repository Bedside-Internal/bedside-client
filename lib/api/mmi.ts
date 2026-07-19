import { auth } from "@clerk/nextjs/server";
import type {
    Attempt,
    QuestionDetail,
    QuestionListItem,
    SubmitMediaResponsePayload,
    SubmitResponsePayload,
    SubmitResponseResult,
} from "@/types/mmi";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class MmiApiError extends Error {
    status: number;
    payload: unknown;

    constructor(status: number, payload: unknown) {
        super(`MMI API request failed with status ${status}`);
        this.status = status;
        this.payload = payload;
    }
}

async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const { getToken } = await auth();
    const token = await getToken();

    const isFormData = init?.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
            ...init?.headers,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        let payload: unknown = null;
        try {
            payload = await res.json();
        } catch {
            // response had no JSON body
        }
        throw new MmiApiError(res.status, payload);
    }

    return res.json() as Promise<T>;
}

/** Server-Component-only — call once, when a station page first loads. */
export async function getStationQuestions(slug: string): Promise<QuestionListItem[]> {
    return authedFetch<QuestionListItem[]>(
        `/api/mmi/sections/${encodeURIComponent(slug)}/questions`
    );
}

/** Server-Component-only — call once per circuit, before the first question renders. */
export async function startAttempt(): Promise<Attempt> {
    return authedFetch<Attempt>("/api/mmi/attempts", { method: "POST" });
}

/** Server-only. Client components should call the wrapped version in mmi-actions.ts instead. */
export async function getQuestion(questionId: string): Promise<QuestionDetail> {
    return authedFetch<QuestionDetail>(
        `/api/mmi/questions/${encodeURIComponent(questionId)}`
    );
}

/** Server-only. Client components should call the wrapped version in mmi-actions.ts instead. */
export async function submitResponse(
    payload: SubmitResponsePayload
): Promise<SubmitResponseResult> {
    return authedFetch<SubmitResponseResult>("/api/mmi/responses", {
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

    return authedFetch<SubmitResponseResult>("/api/mmi/responses/media", {
        method: "POST",
        body: formData,
    });
}