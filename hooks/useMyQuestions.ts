"use client";

import { useState, useEffect, useCallback } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import type { UserSubmittedQuestion, CreateUserQuestionInput } from "@/types/userQuestions";

export function useMyQuestions(initialItems: UserSubmittedQuestion[] = []) {
    const apiFetch = useApiFetch();
    const [items, setItems] = useState<UserSubmittedQuestion[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(() => {
        return apiFetch<UserSubmittedQuestion[]>("/api/questions/mine")
            .then((data) => {
                setItems(data);
                setError(null);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load questions");
            });
    }, [apiFetch]);

    useEffect(() => {
        load();
    }, [load]);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await load();
        } finally {
            setLoading(false);
        }
    }, [load]);

    const create = useCallback(
        async (input: CreateUserQuestionInput) => {
            setSubmitting(true);
            setError(null);
            try {
                const newItem = await apiFetch<UserSubmittedQuestion>("/api/questions/mine", {
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

    return { items, loading, error, submitting, clearError: () => setError(null), create, refetch };
}