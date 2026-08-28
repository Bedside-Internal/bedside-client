"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { redeemReferralCode } from "@/lib/api/referrals-client";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals/cookie";

/**
 * Mount once, high up the authenticated tree (e.g. the dashboard/onboarding
 * layout) — reads the `bedside_ref` cookie set by /r/[code], redeems it
 * against the now-signed-in user, then clears the cookie so it never fires
 * twice. Renders nothing.
 *
 * Deliberately silent on failure (stale code, self-referral, etc.) — this
 * is a background attribution step, not something that should interrupt
 * the user's first moments in the app with an error toast.
 */
export function ReferralAttribution() {
    const { isSignedIn, getToken } = useAuth();
    const attempted = useRef(false);

    useEffect(() => {
        if (!isSignedIn || attempted.current) return;

        const code = getCookie(REFERRAL_COOKIE_NAME);
        if (!code) return;

        attempted.current = true;
        redeemReferralCode(code, getToken)
            .catch(() => {
                // Best-effort — see comment above.
            })
            .finally(() => {
                clearCookie(REFERRAL_COOKIE_NAME);
            });
    }, [isSignedIn, getToken]);

    return null;
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string): void {
    document.cookie = `${name}=; path=/; max-age=0`;
}