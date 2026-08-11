"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

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

/**
 * lib/api/use-api-fetch.ts
 *
 * THE single way client components talk to the API service. Always Bearer
 * token via Clerk's useAuth().getToken() — never credentials: "include" /
 * cookie-forwarding. Cookie-forwarding breaks the moment the API lives on
 * a different domain/subdomain than the frontend.
 *
 * Don't write a raw fetch() to the API in a component — import this hook
 * instead. The no-restricted-syntax ESLint rule enforces this everywhere
 * except this file and lib/api/server-fetch.ts (the Server Component
 * equivalent).
 */
export function useApiFetch() {
  const { getToken } = useAuth();

  return useCallback(
    async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
      const token = await getToken();
      const isFormData = init?.body instanceof FormData;

      const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init?.headers,
        },
        cache: "no-store",
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
    },
    [getToken],
  );
}