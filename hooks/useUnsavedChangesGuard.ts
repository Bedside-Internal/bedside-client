"use client";

import { useEffect } from "react";

/**
 * Warns on tab close / navigation-away while `shouldWarn` is true.
 */
export function useUnsavedChangesGuard(shouldWarn: boolean) {
    useEffect(() => {
        if (!shouldWarn) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [shouldWarn]);
}