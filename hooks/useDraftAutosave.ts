// lib/hooks/useDraftAutosave.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api/use-api-fetch";

const DRAFT_PREFIX = "bedside:draft:";
const DEBOUNCE_MS = 400;
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

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

export function useDraftAutosave(attemptId: string, questionId: string, text: string) {
    const key = draftKey(attemptId, questionId);
    const path = draftPath(attemptId, questionId);
    const { getToken } = useAuth();
    const apiFetch = useApiFetch(); // used for the non-urgent calls (mount GET, clear)

    const [restored, setRestored] = useState<string | null>(null);
    const [restoredAt, setRestoredAt] = useState<number | null>(null);
    const hasCheckedRestore = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSyncedTextRef = useRef<string>("");
    const textRef = useRef(text);
    textRef.current = text; // so the visibilitychange handler always reads the latest value

    // Restore: localStorage first, server fallback only if local is empty
    useEffect(() => {
        if (hasCheckedRestore.current) return;
        hasCheckedRestore.current = true;

        let foundLocal = false;
        try {
            const raw = window.localStorage.getItem(key);
            if (raw) {
                const parsed: DraftEnvelope = JSON.parse(raw);
                if (parsed?.text?.trim()) {
                    setRestored(parsed.text);
                    setRestoredAt(parsed.savedAt);
                    foundLocal = true;
                }
            }
        } catch {
            // corrupt entry — ignore
        }

        if (foundLocal) return;

        apiFetch<{ text: string; updatedAt: string } | null>(path)
            .then((data) => {
                if (data?.text?.trim()) {
                    setRestored(data.text);
                    setRestoredAt(new Date(data.updatedAt).getTime());
                }
            })
            .catch(() => {
                // no server draft, or request failed
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

    // Server sync to where this fires only on tab-hide/pagehide. Uses fetch+keepalive
    const syncToServer = useCallback(() => {
        const currentText = textRef.current;
        if (currentText.trim().length === 0) return;
        if (currentText === lastSyncedTextRef.current) return;

        getToken()
            .then((token) => {
                if (!token) return;
                return fetch(`${BASE_URL}${path}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text: currentText }),
                    keepalive: true, // lets the request survive the page unloading
                });
            })
            .then(() => {
                lastSyncedTextRef.current = currentText;
            })
            .catch(() => {
                // best-effort — localStorage already has the latest text regardless
            });
    }, [getToken, path]);

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
        });
    }, [key, path, apiFetch]);

    const dismissRestore = useCallback(() => {
        setRestored(null);
        setRestoredAt(null);
    }, []);

    return { restoredDraft: restored, restoredAt, clearDraft, dismissRestore };
}