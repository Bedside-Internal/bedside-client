"use client";

import { useCallback, useState } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import type { DeckPreviewResponse, DeckCommitResult, DeckCard } from "@/types/deckImport";

export function useDeckImport(formatId: string | null) {
    const apiFetch = useApiFetch();
    const [previewing, setPreviewing] = useState(false);
    const [committing, setCommitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<DeckPreviewResponse | null>(null);
    const [result, setResult] = useState<DeckCommitResult | null>(null);

    const previewDeck = useCallback(
        async (file: File) => {
            setPreviewing(true);
            setError(null);
            try {
                const form = new FormData();
                form.append("file", file);
                if (formatId) form.append("formatId", formatId);
                const res = await apiFetch<DeckPreviewResponse>("/api/decks/import/preview", { method: "POST", body: form });
                setPreview(res);
                return res;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to read deck file");
                throw err;
            } finally {
                setPreviewing(false);
            }
        },
        [apiFetch, formatId],
    );

    const commitDeck = useCallback(
        async (promptCards: DeckCard[], knowledgeCards: DeckCard[], sourceFileName: string, shareWithApplicants: boolean) => {
            setCommitting(true);
            setError(null);
            try {
                const res = await apiFetch<DeckCommitResult>("/api/decks/import/commit", {
                    method: "POST",
                    body: JSON.stringify({ formatId, shareWithApplicants, sourceFileName, promptCards, knowledgeCards }),
                });
                setResult(res);
                return res;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Import failed");
                throw err;
            } finally {
                setCommitting(false);
            }
        },
        [apiFetch, formatId],
    );

    const reset = useCallback(() => {
        setPreview(null);
        setResult(null);
        setError(null);
    }, []);

    return { previewing, committing, error, clearError: () => setError(null), preview, result, previewDeck, commitDeck, reset };
}