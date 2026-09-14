"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const DRAFT_PREFIX = "bedside:draft:";
const DEBOUNCE_MS = 400;

interface DraftEnvelope {
    text: string;
    savedAt: number;
}

function draftKey(attemptId: string, questionId: string) {
    return `${DRAFT_PREFIX}${attemptId}:${questionId}`;
}

/**
 * Persists a single text draft to localStorage, debounced, and only
 * when there's actually content
 *
 * Returns the restored draft (if any) once on mount, plus a `clear()`
 * to call after a successful submit.
 */
export function useDraftAutosave(attemptId: string, questionId: string, text: string) {
    const key = draftKey(attemptId, questionId);
    const [restored, setRestored] = useState<string | null>(null);
    const [restoredAt, setRestoredAt] = useState<number | null>(null);
    const hasCheckedRestore = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (hasCheckedRestore.current) return;
        hasCheckedRestore.current = true;
        try {
            const raw = window.localStorage.getItem(key);
            if (!raw) return;
            const parsed: DraftEnvelope = JSON.parse(raw);
            if (parsed?.text?.trim()) {
                setRestored(parsed.text);
                setRestoredAt(parsed.savedAt);
            }
        } catch {
            // Corrupt entry
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            try {
                if (text.trim().length === 0) {
                    window.localStorage.removeItem(key);
                    return;
                }
                const envelope: DraftEnvelope = { text, savedAt: Date.now() };
                window.localStorage.setItem(key, JSON.stringify(envelope));
            } catch {
                // Storage full / disabled (private mode etc.) — fail silently,
                // this is a nice-to-have, not a hard requirement
            }
        }, DEBOUNCE_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [key, text]);

    // Flush immediately (bypass debounce) (for pagehide/visibilitychange)
    const flush = useCallback(() => {
        try {
            if (text.trim().length === 0) return;
            window.localStorage.setItem(key, JSON.stringify({ text, savedAt: Date.now() }));
        } catch {
            // ignore
        }
    }, [key, text]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "hidden") flush();
        };
        window.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("pagehide", flush);
        return () => {
            window.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("pagehide", flush);
        };
    }, [flush]);

    const clearDraft = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
    }, [key]);

    const dismissRestore = useCallback(() => {
        setRestored(null);
        setRestoredAt(null);
    }, []);

    return { restoredDraft: restored, restoredAt, clearDraft, dismissRestore };
}