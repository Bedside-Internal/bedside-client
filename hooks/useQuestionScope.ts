"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiFetch } from "@/lib/api/use-api-fetch";

export function useQuestionScope() {
    const apiFetch = useApiFetch();
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestShare = useCallback(
        async (id: string) => {
            setPendingId(id);
            setError(null);
            try {
                await apiFetch(`/api/questions/${id}/request-share`, { method: "POST" });
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to request sharing");
            } finally {
                setPendingId(null);
            }
        },
        [apiFetch, router],
    );

    const cancelShare = useCallback(
        async (id: string) => {
            setPendingId(id);
            setError(null);
            try {
                await apiFetch(`/api/questions/${id}/cancel-share`, { method: "POST" });
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to cancel share request");
            } finally {
                setPendingId(null);
            }
        },
        [apiFetch, router],
    );

    const makePrivate = useCallback(
        async (id: string) => {
            setPendingId(id);
            setError(null);
            try {
                await apiFetch(`/api/questions/${id}/make-private`, { method: "POST" });
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to make private");
            } finally {
                setPendingId(null);
            }
        },
        [apiFetch, router],
    );

    return { pendingId, error, clearError: () => setError(null), requestShare, cancelShare, makePrivate };
}