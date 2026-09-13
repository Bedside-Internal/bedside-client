import { NextRequest, NextResponse } from "next/server";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals/cookie";

const REFERRAL_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

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