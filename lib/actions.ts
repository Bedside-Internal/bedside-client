"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

interface OnboardingProgress {
    track?: string;
    format?: string;
}

/**
 * Records which track the user landed on. Called from the track's own page
 * (e.g. /onboarding/medical-school), since that route already encodes the answer;
 * no need to intercept the click on the welcome screen.
 */
export async function saveTrack(track: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const existing = (user.publicMetadata.onboarding as OnboardingProgress) ?? {};

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            onboarding: { ...existing, track } satisfies OnboardingProgress,
        },
    });
}

/**
 * Records the chosen format within a track. Called when Continue is clicked on the format-selector step.
 */
export async function saveFormat(track: string, format: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            onboarding: { track, format } satisfies OnboardingProgress,
        },
    });
}

/**
 * Reads back wherever the user last left off, so a fresh login can resume them instead of restarting onboarding from scratch.
 */
export async function getOnboardingProgress(): Promise<OnboardingProgress | null> {
    const user = await currentUser();
    if (!user) return null;
    return (user.publicMetadata.onboarding as OnboardingProgress) ?? null;
}

/**
 * Dev/testing helper: clears saved onboarding progress so you can walk through
 * the full flow again from a clean state. Not wired to any UI; call it from
 * a temporary button, a /api/dev route, or directly in this file while testing.
 */
export async function resetOnboarding() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
   
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { onboarding: null },
    });
  }