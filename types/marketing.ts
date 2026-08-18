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