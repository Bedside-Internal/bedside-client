import "server-only";
import { cookies } from "next/headers";

/**
 * lib/features.ts
 *
 * Server-side fetch against the API service's /api/features endpoints.
 * Must run in a Server Component or Server Action — never client-side —
 * both because of the `server-only` guard below and because the request
 * needs to carry the Clerk session cookie to satisfy featuresRouter's
 * requireClerkAuth.
 *
 * Mirrors the exact pattern already used by getDashboardData() in the
 * dashboard page: NEXT_PUBLIC_API_URL as the base URL, session forwarded
 * by passing the incoming cookie header straight through (no Bearer
 * token — the API service's Clerk middleware reads the session cookie
 * itself).
 */

export type FeatureType = "track" | "format";

export interface PublicFeature {
  key: string;
  type: FeatureType;
  parent_track: string | null;
  order: number;
  icon: string;
  title: string;
  subtitle: string;
  href: string | null;
  available: boolean;
}

async function fetchApi<T>(path: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const cookieStore = await cookies();

  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store", // feature availability should never be stale-cached at the fetch layer
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(`Feature API request failed (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * GET /api/features?type=track
 * GET /api/features?type=format&parent=track-medical-school
 *
 * Returns ALL matching features, including unavailable ones — callers
 * render disabled "coming soon" cards rather than hiding them, so don't
 * filter this list; use `available` per-item at render time.
 */
export async function getFeatures(type: FeatureType, parent?: string): Promise<PublicFeature[]> {
  const params = new URLSearchParams({ type });
  if (parent) params.set("parent", parent);
  return fetchApi<PublicFeature[]>(`/api/features?${params.toString()}`);
}

/** GET /api/features/:key — single lookup. */
export async function getFeature(key: string): Promise<PublicFeature | null> {
  try {
    return await fetchApi<PublicFeature>(`/api/features/${encodeURIComponent(key)}`);
  } catch {
    return null;
  }
}

/** Builds the parent_track id from a URL-style track slug, e.g. "medical-school" -> "track-medical-school". */
export function toTrackId(track: string): string {
  return `track-${track}`;
}