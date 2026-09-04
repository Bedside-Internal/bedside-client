import { useCallback, useEffect, useState } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import type {
    SectionOption,
    QuestionDraftResponse,
    ConfirmPrivateQuestionInput,
    PrivateQuestionResult,
} from "@/lib/api/userQuestions";

export function useQuestionGeneration(formatSlug = "mmi") {
    const apiFetch = useApiFetch();

    const [sections, setSections] = useState<SectionOption[]>([]);
    const [sectionsLoading, setSectionsLoading] = useState(true);

    const [draft, setDraft] = useState<QuestionDraftResponse | null>(null);
    const [generating, setGenerating] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setSectionsLoading(true);
            try {
                const result = await apiFetch<SectionOption[]>(
                    `/api/questions/sections?format=${encodeURIComponent(formatSlug)}`,
                );
                if (!cancelled) setSections(result);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load sections");
            } finally {
                if (!cancelled) setSectionsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [apiFetch, formatSlug]);

    const generate = useCallback(
        async (input: { sectionId: string; difficulty: "easy" | "medium" | "hard"; topic: string }) => {
            setGenerating(true);
            setError(null);
            try {
                const result = await apiFetch<QuestionDraftResponse>("/api/questions/generate", {
                    method: "POST",
                    body: JSON.stringify(input),
                });
                setDraft(result);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to generate question");
                throw err;
            } finally {
                setGenerating(false);
            }
        },
        [apiFetch],
    );

    const confirm = useCallback(
        async (input: ConfirmPrivateQuestionInput) => {
            setConfirming(true);
            setError(null);
            try {
                return await apiFetch<PrivateQuestionResult>("/api/questions/private", {
                    method: "POST",
                    body: JSON.stringify(input),
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to save question");
                throw err;
            } finally {
                setConfirming(false);
            }
        },
        [apiFetch],
    );

    return {
        sections,
        sectionsLoading,
        draft,
        generating,
        confirming,
        error,
        generate,
        confirm,
        clearDraft: () => setDraft(null),
        clearError: () => setError(null),
    };
}