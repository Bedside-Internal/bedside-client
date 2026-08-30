"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch, ApiError } from "@/lib/api/use-api-fetch";
import type { UserSubmittedQuestion, CreateUserQuestionInput } from "@/types/userQuestions";

export function useMyQuestions() {
    const apiFetch = useApiFetch();
    const [items, setItems] = useState<UserSubmittedQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setItems(await apiFetch<UserSubmittedQuestion[]>("/api/questions/mine"));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load questions");
        } finally {
            setLoading(false);
        }
    }, [apiFetch]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const create = useCallback(
        async (input: CreateUserQuestionInput) => {
            setSubmitting(true);
            setError(null);
            try {
                const newItem = await apiFetch<CreateUserQuestionInput, UserSubmittedQuestion>("/api/questions/mine", {
                    method: "POST",
                    body: JSON.stringify(input),
                });
                setItems((prev) => [newItem, ...prev]);
                return newItem;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to submit question");
                throw err;
            } finally {
                setSubmitting(false);
            }
        },
        [apiFetch],
    );

    return {
        items,
        loading,
        error,
        submitting,
        clearError: () => setError(null),
        create,
        refetch,
    };
}