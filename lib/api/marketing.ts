import { serverApiFetch } from "@/lib/api/server-fetch";
import type { LandingPageData } from "@/types/marketing";

/**
 * No more time-based revalidate. This cache entry only refreshes when
 * /api/revalidate is called by the Express admin routes after a real write
 * (see server/src/middleware/revalidateLandingOnWrite.ts).
 */
export async function getLandingPageData(): Promise<LandingPageData> {
  return serverApiFetch<LandingPageData>("/api/marketing/landing", {
    skipAuth: true,
    next: { tags: ["marketing-landing"] },
  });
}