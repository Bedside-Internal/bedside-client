import { serverApiFetch } from "@/lib/api/server-fetch";
import type { TestimonialDTO } from "@/types/testimonials";


export async function getTestimonials(): Promise<TestimonialDTO[]> {
  return serverApiFetch<TestimonialDTO[]>("/api/marketing/testimonials", {
    cache: "force-cache",
    next: { revalidate: 300 }, // 5 minutes — plenty fresh for marketing copy
  });
}