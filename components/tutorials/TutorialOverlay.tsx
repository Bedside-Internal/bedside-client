"use client";

import { Component, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Joyride, EVENTS, type EventData, type TooltipRenderProps } from "react-joyride";
import { X } from "lucide-react";
import { isTutorialTargetVisible, useTutorial, type TutorialRun } from "@/hooks/useTutorial";
import { mmiTutorial } from "@/lib/tutorials/mmi";
import type { TutorialOutcome } from "@/lib/tutorials/types";

const button = "rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint";

interface TutorialActions {
    finish: () => void;
    dismiss: () => void;
    timed: boolean;
}

function TutorialTooltip({ tooltipProps, closeProps, backProps, primaryProps, skipProps, index, size, step, isLastStep }: TooltipRenderProps) {
    const actions = step.data as TutorialActions;
    return (
        <section {...tooltipProps} aria-label={String(step.title)} data-bedside-tutorial
            className="relative w-[360px] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-sand bg-cream p-6 text-ink shadow-xl">
            <button {...closeProps} onClick={actions.dismiss} type="button" className={`${button} absolute right-2 top-2 text-ink/60`}>
                <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink/60">BEDSIDE · {index + 1} OF {size}</p>
            <h2 className="pr-3 text-lg font-semibold">{step.title}</h2>
            <div className="mt-3 text-sm leading-relaxed text-ink/80">{step.content}</div>
            {actions.timed && <p className="mt-3 text-xs text-ink/60">Practice timer paused while this tour is open.</p>}
            <div className="mt-5 flex items-center justify-between gap-2">
                <button {...skipProps} onClick={actions.dismiss} type="button" className={`${button} -ml-3 text-ink/70 hover:bg-sand`}>Skip tour</button>
                <div className="flex gap-1">
                    {index > 0 && <button {...backProps} type="button" className={`${button} hover:bg-sand`}>Back</button>}
                    <button {...primaryProps} onClick={isLastStep ? actions.finish : primaryProps.onClick} type="button" className={`${button} bg-mint text-ink hover:bg-mint-hover`}>{isLastStep ? "Finish" : "Next"}</button>
                </div>
            </div>
        </section>
    );
}

class TutorialBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch() { this.props.onError(); }
    render() { return this.state.failed ? null : this.props.children; }
}

interface OverlayProps {
    run: TutorialRun;
    onEnd: (run: TutorialRun, outcome: TutorialOutcome) => void;
    onPresented: (run: TutorialRun) => void;
}

function ActiveTutorial({ run, onEnd, onPresented }: OverlayProps) {
    const ended = useRef(false);
    const visible = useRef(false);
    const currentTarget = useRef(run.targets[0]);
    const deadline = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const frame = useRef<number | undefined>(undefined);
    const finish = useCallback((outcome: TutorialOutcome) => {
        if (ended.current) return;
        ended.current = true;
        clearTimeout(deadline.current);
        if (frame.current !== undefined) cancelAnimationFrame(frame.current);
        onEnd(run, outcome === "completed" && (!visible.current || !run.targets.every(isTutorialTargetVisible)) ? "interrupted" : outcome);
    }, [onEnd, run]);

    const steps = useMemo(() => run.definition.steps.map((step, index) => ({
        ...step,
        target: run.targets[index],
        data: {
            finish: () => finish("completed"), dismiss: () => finish("dismissed"),
            timed: run.definition.stage === "reading" || run.definition.steps.some((item) => item.target === '[data-tour="response-timer"]'),
        } satisfies TutorialActions,
    })), [run, finish]);

    useEffect(() => {
        ended.current = false;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        // A stalled library initialization must never hold a practice timer.
        deadline.current = setTimeout(() => finish("interrupted"), 3000);
        const escape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            event.stopPropagation();
            finish("dismissed");
        };
        document.addEventListener("keydown", escape, true);
        return () => {
            ended.current = true;
            clearTimeout(deadline.current);
            if (frame.current !== undefined) cancelAnimationFrame(frame.current);
            document.removeEventListener("keydown", escape, true);
            // Restore the original trigger even after visiting several tooltips.
            queueMicrotask(() => {
                if (previousFocus && isTutorialTargetVisible(previousFocus)) previousFocus.focus({ preventScroll: true });
            });
        };
    }, [finish]);

    const onEvent = (event: EventData) => {
        if (ended.current) return;
        if (event.type === EVENTS.ERROR || event.type === EVENTS.TARGET_NOT_FOUND) {
            finish("interrupted");
        } else if (event.type === EVENTS.STEP_BEFORE) {
            currentTarget.current = run.targets[event.index];
            clearTimeout(deadline.current);
            deadline.current = setTimeout(() => finish("interrupted"), 3000);
        } else if (event.type === EVENTS.TOOLTIP) {
            const checkPresentation = () => {
                if (ended.current) return;
                const tooltip = document.querySelector<HTMLElement>("[data-bedside-tutorial]");
                if (!isTutorialTargetVisible(currentTarget.current)) {
                    finish("interrupted");
                    return;
                }
                // Joyride may emit TOOLTIP before Floating UI has positioned it.
                if (!tooltip || !isTutorialTargetVisible(tooltip)) {
                    frame.current = requestAnimationFrame(checkPresentation);
                    return;
                }
                clearTimeout(deadline.current);
                visible.current = true;
                onPresented(run);
            };
            frame.current = requestAnimationFrame(checkPresentation);
        } else if (event.type === EVENTS.TOUR_END) {
            // Only our explicit Finish/Skip/Close/Escape controls persist outcomes.
            finish("interrupted");
        }
    };

    return (
        <Joyride run continuous scrollToFirstStep steps={steps} onEvent={onEvent}
            tooltipComponent={TutorialTooltip}
            styles={{ floater: { transition: "none" } }}
            locale={{ back: "Back", next: "Next", last: "Finish", skip: "Skip tour", close: "Close tutorial" }}
            options={{
                skipBeacon: true, blockTargetInteraction: true, closeButtonAction: "skip",
                dismissKeyAction: false, overlayClickAction: false, scrollDuration: 0,
                targetWaitTimeout: 0, spotlightRadius: 16, zIndex: 10000,
                backgroundColor: "var(--color-cream)", arrowColor: "var(--color-cream)",
                primaryColor: "var(--color-mint)", textColor: "var(--color-ink)",
            }}
        />
    );
}

export function TutorialOverlay(props: OverlayProps) {
    return <TutorialBoundary onError={() => props.onEnd(props.run, "interrupted")}><ActiveTutorial {...props} /></TutorialBoundary>;
}

/** Small client island keeps the overview page server-rendered. */
export function MmiOverviewTutorial() {
    const definition = useMemo(() => mmiTutorial("overview"), []);
    const tutorial = useTutorial(definition, true, "overview");
    return (
        <div className="mt-4 flex justify-center">
            <button type="button" onClick={tutorial.replay} disabled={!tutorial.canReplay || Boolean(tutorial.run)}
                className={`${button} text-ink/60 hover:bg-white disabled:opacity-40`}>Take the tour</button>
            {tutorial.run && <TutorialOverlay key={tutorial.run.id} run={tutorial.run} onEnd={tutorial.end} onPresented={tutorial.presented} />}
        </div>
    );
}
