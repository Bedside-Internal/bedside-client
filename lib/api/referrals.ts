import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";

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

/** Client-only — called from ReferralAttribution with a code read out of
 * the browser's cookie jar, so this can't go through the server-only
 * serverApiFetch helper used above. Hits the same API base directly. */
export async function redeemReferralCode(code: string, getToken: () => Promise<string | null>): Promise<void> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/api/referrals/redeem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
    });
    if (!res.ok && res.status !== 204) {
        throw new ApiError(res.status, `Failed to redeem referral code (${res.status})`);
    }
}