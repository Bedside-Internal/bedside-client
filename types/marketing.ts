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
}