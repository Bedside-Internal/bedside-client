"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { progressUpdateForOutcome } from "@/lib/tutorials/outcomes";
import { readTutorialProgress, tutorialStorageKey, updateTutorialProgress } from "@/lib/tutorials/storage";
import type { TutorialDefinition, TutorialOutcome } from "@/lib/tutorials/types";

export interface TutorialRun {
    id: number;
    scope: string;
    storageKey: string;
    automatic: boolean;
    definition: TutorialDefinition;
    targets: HTMLElement[];
}

export function isTutorialTargetVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return element.isConnected && rect.width > 0 && rect.height > 0 &&
        (!element.checkVisibility || element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) &&
        style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
}

function resolveTargets(definition: TutorialDefinition): HTMLElement[] | null {
    if (!window.matchMedia("(min-width: 64rem)").matches) return null;
    const targets = definition.steps.map((step) =>
        Array.from(document.querySelectorAll<HTMLElement>(step.target)).find(isTutorialTargetVisible),
    );
    return targets.length > 0 && targets.every((element) => element !== undefined)
        ? targets as HTMLElement[] : null;
}

export function useTutorial(definition: TutorialDefinition, enabled: boolean, instance: string) {
    const { isLoaded, userId } = useAuth();
    const pathname = usePathname();
    const scope = `${userId}:${pathname}:${instance}:${definition.stage}`;
    const [candidate, setCandidate] = useState<TutorialRun | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const attempted = useRef(new Set<string>());
    const sequence = useRef(0);
    const run = enabled && isSupported && isLoaded && userId && candidate?.scope === scope ? candidate : null;

    useEffect(() => {
        const media = window.matchMedia("(min-width: 64rem)");
        const updateSupport = () => setIsSupported(media.matches);
        updateSupport();
        media.addEventListener("change", updateSupport);
        return () => media.removeEventListener("change", updateSupport);
    }, []);

    const launch = useCallback((automatic: boolean) => {
        if (!enabled || !isSupported || !isLoaded || !userId) return;
        const storageKey = tutorialStorageKey(userId, definition.format);
        const progress = readTutorialProgress(storageKey);
        if (automatic && (attempted.current.has(scope) || progress.dismissed || progress.stages[definition.stage])) return;
        const targets = resolveTargets(definition);
        if (!targets) return;
        attempted.current.add(scope);
        setCandidate({ id: ++sequence.current, scope, storageKey, automatic, definition, targets });
    }, [enabled, isSupported, isLoaded, userId, definition, scope]);

    const end = useCallback((current: TutorialRun, outcome: TutorialOutcome) => {
        const update = progressUpdateForOutcome(current.automatic, outcome);
        if (update) updateTutorialProgress(current.storageKey, current.definition.stage, update);
        setCandidate((value) => value?.id === current.id ? null : value);
    }, []);

    useEffect(() => {
        if (!candidate) return;
        if (!enabled || !isSupported || !isLoaded || !userId || candidate.scope !== scope) {
            let cancelled = false;
            queueMicrotask(() => {
                if (!cancelled) end(candidate, "interrupted");
            });
            return () => { cancelled = true; };
        }
    }, [candidate, enabled, isSupported, isLoaded, userId, scope, end]);

    useEffect(() => {
        // After commit: targets and Clerk identity must exist before any DOM work.
        const frame = requestAnimationFrame(() => launch(true));
        const onResize = () => launch(true);
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
        };
    }, [launch]);

    const presented = useCallback((current: TutorialRun) => {
        updateTutorialProgress(current.storageKey, current.definition.stage, "presented");
    }, []);

    useEffect(() => {
        if (!run) return;
        const validate = () => {
            if (!window.matchMedia("(min-width: 64rem)").matches || !run.targets.every(isTutorialTargetVisible)) {
                end(run, "interrupted");
            }
        };
        const interval = window.setInterval(validate, 200);
        window.addEventListener("resize", validate);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener("resize", validate);
        };
    }, [run, end]);

    return {
        run,
        replay: () => launch(false),
        end,
        presented,
        canReplay: enabled && isSupported && isLoaded && Boolean(userId),
        isSupported,
    };
}
