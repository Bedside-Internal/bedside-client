import "server-only";
import { serverApiFetch } from "./api/server-fetch";

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

/**
 * GET /api/features?type=track
 * GET /api/features?type=format&parent=track-medical-school
 *
 * Returns ALL matching features, including unavailable ones. Callers
 * render disabled "coming soon" cards rather than hiding them, so don't
 * filter this list; use `available` per-item at render time.
 */
export async function getFeatures(type: FeatureType, parent?: string): Promise<PublicFeature[]> {
  const params = new URLSearchParams({ type });
  if (parent) params.set("parent", parent);
  return serverApiFetch<PublicFeature[]>(`/api/features?${params.toString()}`, {
    skipAuth: false,
  });
}

export async function getFeature(key: string): Promise<PublicFeature | null> {
  try {
    return serverApiFetch<PublicFeature>(`/api/features/${encodeURIComponent(key)}`);
  } catch {
    return null;
  }
}

/** Builds the parent_track id from a URL-style track slug, e.g. "medical-school" -> "track-medical-school". */
export function toTrackId(track: string): string {
  return `track-${track}`;
}