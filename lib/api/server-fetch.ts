import "server-only";
import { auth } from "@clerk/nextjs/server";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, payload: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

interface ServerApiFetchOptions extends RequestInit {
  /**
   * Skip the Clerk auth() lookup and send the request with no Bearer
   * token. ONLY for routes with no requireAuth on the API side (currently
   * just marketingRouter), DO NOT set this for anything that reads
   * user-specific data.
   */
  skipAuth?: boolean;
}

/**
 * lib/api/server-fetch.ts
 *
 * THE single way Server Components/Actions talk to the API service.
 * Always Bearer-token auth via Clerk's getToken(). NEVER cookie-forwarding.
 * Cookie-forwarding breaks the moment the API lives on a different
 * domain/subdomain than the frontend (cross-site cookie scoping), which
 * is exactly what took down /api/dashboard and /api/features before.
 * Bearer tokens don't care what domain the API is on.
 */
export async function serverApiFetch<T>(path: string, init?: ServerApiFetchOptions): Promise<T> {
  const { skipAuth, ...requestInit } = init ?? {};

  let token: string | null = null;
  if (!skipAuth) {
    const { getToken } = await auth();
    token = await getToken();
  }

  const isFormData = requestInit.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...requestInit,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestInit.headers,
    },
    ...(skipAuth ? {} : { cache: requestInit.cache ?? "no-store" }),
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, payload);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}