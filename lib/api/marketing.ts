import { serverApiFetch } from "@/lib/api/server-fetch";
import type { FormatCardDTO, TestimonialDTO, PricingTierDTO, FaqEntryDTO } from "@/types/marketing";
/**
 * Backs the logged-out landing page. skipAuth: true means this never calls
 * Clerk's auth() (a "dynamic function") — matches marketingRouter having no
 * requireAuth on the API side, and is what lets the homepage qualify for
 * ISR (see `export const revalidate` in app/page.tsx) instead of full
 * SSR-per-request.
 */
export async function getTestimonials(): Promise<TestimonialDTO[]> {
  return serverApiFetch<TestimonialDTO[]>("/api/marketing/testimonials", {
    skipAuth: true,
    next: { revalidate: 300 },
  });
}

export async function getFormatCards(): Promise<FormatCardDTO[]> {
  return serverApiFetch<FormatCardDTO[]>("/api/marketing/formats", {
    skipAuth: true,
    next: { revalidate: 300 },
  });
}

export async function getPricingTiers(): Promise<PricingTierDTO[]> {
  return serverApiFetch<PricingTierDTO[]>("/api/marketing/pricing", {
    skipAuth: true,
    next: { revalidate: 300 },
  });
}

export async function getFaqEntries(): Promise<FaqEntryDTO[]> {
  return serverApiFetch<FaqEntryDTO[]>("/api/marketing/faq", {
    skipAuth: true,
    next: { revalidate: 300 },
  });
}