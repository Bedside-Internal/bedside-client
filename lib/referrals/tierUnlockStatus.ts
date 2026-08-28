import type { UnlockProgress } from "@/lib/api/referrals";

/** Mirrors PricingTierDTO's shape closely enough without importing the
 * whole marketing types module here — keeps this helper dependency-light. */
export interface TierRequirementsLike {
    id: string;
    title: string;
    requirements: {
        referralsRequired: number;
        ownTestimonialRequired: boolean;
        referredTestimonialRequired: boolean;
    };
}

export interface TierUnlockStatus {
    id: string;
    title: string;
    referralsRequired: number;
    referralsHave: number;
    ownTestimonialRequired: boolean;
    ownTestimonialMet: boolean;
    referredTestimonialRequired: boolean;
    referredTestimonialMet: boolean;
    unlocked: boolean;
}

export function computeTierUnlockStatus(
    tiers: TierRequirementsLike[],
    progress: UnlockProgress,
): TierUnlockStatus[] {
    return tiers.map((t) => {
        const referralsMet = progress.referralsActivated >= t.requirements.referralsRequired;
        const ownTestimonialMet = !t.requirements.ownTestimonialRequired || progress.ownTestimonialApproved;
        const referredTestimonialMet = !t.requirements.referredTestimonialRequired || progress.referredTestimonialApproved;

        return {
            id: t.id,
            title: t.title,
            referralsRequired: t.requirements.referralsRequired,
            referralsHave: progress.referralsActivated,
            ownTestimonialRequired: t.requirements.ownTestimonialRequired,
            ownTestimonialMet: progress.ownTestimonialApproved,
            referredTestimonialRequired: t.requirements.referredTestimonialRequired,
            referredTestimonialMet: progress.referredTestimonialApproved,
            unlocked: referralsMet && ownTestimonialMet && referredTestimonialMet,
        };
    });
}