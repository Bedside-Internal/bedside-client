/**
 * Client-safe only — deliberately does NOT import anything from
 * lib/api/server-fetch.ts. That file (and its ApiError) pull in Clerk's
 * server-only auth() under the hood; importing it here, even just for the
 * error class, drags 'server-only' code into the client bundle the moment
 * a client component (ReferralAttribution) imports this module.
 *
 * lib/api/referrals.ts (the RSC-only sibling of this file) is where
 * getReferralSummary/getUnlockProgress live — those legitimately run on
 * the server and can use serverApiFetch normally.
 */

export class ReferralClientApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ReferralClientApiError";
        this.status = status;
    }
}

/** Called from ReferralAttribution with a code read out of the browser's
 * cookie jar and a Clerk client-side getToken. */
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
        throw new ReferralClientApiError(`Failed to redeem referral code (${res.status})`, res.status);
    }
}