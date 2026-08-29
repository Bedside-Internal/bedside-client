export type TestimonialAudience = "applicant" | "partner";
export type TestimonialAvatarShape = "circle" | "square";
export type TestimonialAccent = "mint" | "coral" | "amber" | "violet";

export interface TestimonialDTO {
    id: string;
    name: string;
    subtitle: string;
    quote: string;
    audience: TestimonialAudience;
    avatarLabel: string;
    avatarShape: TestimonialAvatarShape;
    accent: TestimonialAccent;
    rating: number | null;
}

export type TestimonialNameDisplay = "full_name" | "first_name_only" | "anonymous";

export interface TestimonialEligibilityDTO {
    eligible: boolean;
    reason?:
    | "collection_off"
    | "not_in_rollout"
    | "already_submitted"
    | "already_dismissed"
    | "not_enough_attempts";
}

export interface CreateTestimonialSubmissionInput {
    rating: number;
    quote: string;
    audience: "applicant" | "partner";
    nameDisplay: TestimonialNameDisplay;
    consentToPublish: true;
    attemptId?: string;
}

export type FormatCardAccent = "mint" | "coral" | "amber" | "violet";

export interface FormatCardDTO {
    id: string;
    title: string;
    description: string;
    accent: FormatCardAccent;
}

export interface PricingFeatureDTO {
    id: string;
    label: string;
    included: boolean;
}

export interface PricingBillingCycleDTO {
    id: string;
    months: number;
    price: number;
    perMonth: number;
    savingsPct: number | null;
    badge: string | null;
}

export interface PricingRequirementsDTO {
    referralsRequired: number;
    ownTestimonialRequired: boolean;
    referredTestimonialRequired: boolean;
    requireAll: boolean;
}

export interface PricingTierDTO {
    id: string;
    title: string;
    featured: boolean;
    price: number;
    periodLabel: string;
    priceNote: string;
    badge: string | null;
    buttonLabel: string;
    defaultCycleMonths: number | null;
    features: PricingFeatureDTO[];
    billingCycles: PricingBillingCycleDTO[];
    requirements: PricingRequirementsDTO;
}

export interface FaqEntryDTO {
    id: string;
    question: string;
    answer: string;
}

export type SocialPlatform =
    | "instagram"
    | "x"
    | "discord"
    | "tiktok"
    | "youtube"
    | "linkedin"
    | "facebook"
    | "mail"
    | "custom";

export interface SocialLinkDTO {
    id: string;
    platform: SocialPlatform;
    url: string;
    label: string | null;
}

export interface AdminSocialLink extends SocialLinkDTO {
    enabled: boolean;
    sortOrder: number;
}

export interface CreateSocialLinkInput {
    platform: SocialPlatform;
    url: string;
    label?: string | null;
    enabled: boolean;
}