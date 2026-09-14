"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";

const DRAFT_PREFIX = "bedside:draft:";
const DEBOUNCE_MS = 400;

interface DraftEnvelope {
    text: string;
    savedAt: number;
}

function draftKey(attemptId: string, questionId: string) {
    return `${DRAFT_PREFIX}${attemptId}:${questionId}`;
}

function draftPath(attemptId: string, questionId: string) {
    return `/api/attempts/${attemptId}/questions/${questionId}/draft`;
}

// Pure, synchronous read
function readLocalDraft(key: string): DraftEnvelope | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed: DraftEnvelope = JSON.parse(raw);
        return parsed?.text?.trim() ? parsed : null;
    } catch {
        return null;
    }
}

export function useDraftAutosave(attemptId: string, questionId: string, text: string) {
    const key = draftKey(attemptId, questionId);
    const path = draftPath(attemptId, questionId);
    const apiFetch = useApiFetch();

    // Seeded synchronously from localStorage on first render
    const [restoredDraft, setRestoredDraft] = useState<DraftEnvelope | null>(() => readLocalDraft(key));

    const hasCheckedServerFallback = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSyncedTextRef = useRef<string>("");
    const textRef = useRef(text);

    // Mirror the latest text into a ref for the visibilitychange/pagehide
    // handlers to read, without needing text in their effect's deps.
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    // Server fallback
    // rule flags.
    useEffect(() => {
        if (hasCheckedServerFallback.current) return;
        hasCheckedServerFallback.current = true;

        if (readLocalDraft(key)) return; // already seeded via lazy init above

        apiFetch<{ text: string; updatedAt: string } | null>(path)
            .then((data) => {
                if (data?.text?.trim()) {
                    setRestoredDraft({ text: data.text, savedAt: new Date(data.updatedAt).getTime() });
                }
            })
            .catch(() => {
                // no server draft, or request failed — nothing to restore
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, path]);

    // Debounced localStorage write
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            try {
                if (text.trim().length === 0) {
                    window.localStorage.removeItem(key);
                    return;
                }
                window.localStorage.setItem(key, JSON.stringify({ text, savedAt: Date.now() }));
            } catch {
                // ignore
            }
        }, DEBOUNCE_MS);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [key, text]);

    // Server sync
    const syncToServer = useCallback(() => {
        const currentText = textRef.current;
        if (currentText.trim().length === 0) return;
        if (currentText === lastSyncedTextRef.current) return;

        apiFetch(path, {
            method: "POST",
            body: JSON.stringify({ text: currentText }),
            keepalive: true,
        })
            .then(() => {
                lastSyncedTextRef.current = currentText;
            })
            .catch(() => {
                // best-effort — localStorage already has the latest text regardless
            });
    }, [apiFetch, path]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "hidden") syncToServer();
        };
        window.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("pagehide", syncToServer);
        return () => {
            window.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("pagehide", syncToServer);
        };
    }, [syncToServer]);

    const clearDraft = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
        apiFetch(path, { method: "DELETE" }).catch(() => {
            // non-critical
        });
    }, [key, path, apiFetch]);

    const dismissRestore = useCallback(() => {
        setRestoredDraft(null);
    }, []);

    return {
        restoredDraft: restoredDraft?.text ?? null,
        restoredAt: restoredDraft?.savedAt ?? null,
        clearDraft,
        dismissRestore,
    };
}