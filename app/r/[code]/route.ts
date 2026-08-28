import { NextRequest, NextResponse } from "next/server";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals/cookie";

// 30 days — long enough to cover "saw the link, signed up a week later"
// without the cookie lingering indefinitely.
const REFERRAL_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * bedside.app/r/{code} — stashes the code in a cookie and sends the visitor
 * to sign-up. Attribution actually happens later, client-side, once the
 * user is authenticated (see components/referrals/ReferralAttribution.tsx)
 * — this route only has to survive the redirect, not talk to the API.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const url = request.nextUrl.clone();
    url.pathname = "/sign-up";
    url.search = "";

    const response = NextResponse.redirect(url);
    response.cookies.set(REFERRAL_COOKIE_NAME, code, {
        maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        httpOnly: false, // read client-side by ReferralAttribution before it's cleared
    });
    return response;
}