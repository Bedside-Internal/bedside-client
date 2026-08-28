import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";

/**
 * RSC / server-only. Uses serverApiFetch (which reads the Clerk server
 * session) — this must never be imported from a "use client" file. See
 * lib/api/referrals-client.ts for the one function client components need.
 */

export interface ReferralListItem {
    id: string;
    referredFirstName: string | null;
    createdAt: string;
    activatedAt: string | null;
    voided: boolean;
}

export interface ReferralSummary {
    code: string;
    shareUrl: string;
    referrals: ReferralListItem[];
    activatedCount: number;
}

export interface UnlockProgress {
    referralsActivated: number;
    ownTestimonialApproved: boolean;
    referredTestimonialApproved: boolean;
}

export const ReferralApiError = ApiError;

export async function getReferralSummary(): Promise<ReferralSummary> {
    return serverApiFetch<ReferralSummary>("/api/referrals/me");
}

export async function getUnlockProgress(): Promise<UnlockProgress> {
    return serverApiFetch<UnlockProgress>("/api/referrals/me/progress");
}