"use client";

import { useState } from "react";

interface ScenarioPanelProps {
    text: string;
    videoUrl?: string | null;
    footerHint?: string;
    children?: React.ReactNode;
    /**
     * Below lg, clamp a long scenario to a few lines with a "Show full scenario"
     * toggle, so it doesn't push the answer box off screen (used while answering).
     */
    collapsible?: boolean;
}

const CLAMP_THRESHOLD_CHARS = 160;

export function ScenarioPanel({ text, videoUrl, footerHint, children, collapsible = false }: ScenarioPanelProps) {
    const [expanded, setExpanded] = useState(false);
    const canCollapse = collapsible && text.length > CLAMP_THRESHOLD_CHARS;

    return (
        <div className="flex flex-1 flex-col justify-between">
            <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-ink)]/45">
                    {videoUrl ? "VIDEO SCENARIO" : "SCENARIO"}
                </span>
                {videoUrl && (
                    <video
                        data-clarity-mask="True"
                        controls
                        src={videoUrl}
                        className="mt-4 w-full rounded-xl bg-black"
                    />
                )}
                <p
                    className={`mt-4 whitespace-pre-line text-xl leading-snug text-[var(--color-ink)] sm:text-2xl ${
                        canCollapse && !expanded ? "line-clamp-4 lg:line-clamp-none" : ""
                    }`}
                >
                    {text}
                </p>
                {canCollapse && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        aria-expanded={expanded}
                        className="mt-2 py-1 text-sm font-semibold text-[var(--color-mint-hover)] lg:hidden"
                    >
                        {expanded ? "Show less" : "Show full scenario"}
                    </button>
                )}
                {children}
            </div>
            {footerHint && (
                <div className="mt-10 flex items-start gap-3 rounded-xl bg-[var(--color-sand)] px-5 py-4 text-sm text-[var(--color-ink)]/60">
                    {footerHint}
                </div>
            )}
        </div>
    );
}