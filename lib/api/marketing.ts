import { serverApiFetch } from "@/lib/api/server-fetch";
import type { TestimonialDTO } from "@/types/testimonials";

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
    next: { revalidate: 300 }, // 5 minutes
  });
}