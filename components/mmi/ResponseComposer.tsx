"use client";

import { useState } from "react";
import {
    ArrowRight,
    ChevronDown,
    Lock,
    Mic,
    PenLine,
    Video,
} from "lucide-react";

export type ComposerMode = "written" | "audio" | "video";

interface ModeConfig {
    id: ComposerMode;
    label: string;
    icon: typeof PenLine;
    enabled: boolean;
}

const MODES: ModeConfig[] = [
    { id: "written", label: "Write", icon: PenLine, enabled: true },
    { id: "audio", label: "Audio", icon: Mic, enabled: false },
    { id: "video", label: "Video", icon: Video, enabled: false },
];

const DISABLED_TITLE =
    "Coming soon — recording needs storage we're still setting up";

interface ResponseComposerProps {
    guidanceNote?: string;
    minWords?: number;
    submitting?: boolean;
    onSubmit: (text: string) => void;
}

export function ResponseComposer({
    guidanceNote,
    minWords = 30,
    submitting = false,
    onSubmit,
}: ResponseComposerProps) {
    const [mode, setMode] = useState<ComposerMode>("written");
    const [text, setText] = useState("");
    const [hintsOpen, setHintsOpen] = useState(false);

    const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    const canSubmit = mode === "written" && wordCount >= minWords && !submitting;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                {MODES.map(({ id, label, icon: Icon, enabled }) => {
                    const active = mode === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            disabled={!enabled}
                            title={enabled ? undefined : DISABLED_TITLE}
                            onClick={() => enabled && setMode(id)}
                            className={[
                                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
                                active
                                    ? "bg-[var(--color-mint)] text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)]"
                                    : enabled
                                    ? "bg-white text-[var(--color-ink)] hover:bg-[var(--color-sand)]"
                                    : "cursor-not-allowed bg-[var(--color-sand)] text-[var(--color-ink)]/35",
                            ].join(" ")}
                        >
                            <Icon className="h-4 w-4" strokeWidth={2.25} />
                            {label}
                            {!enabled && <Lock className="h-3 w-3" strokeWidth={2.5} />}
                        </button>
                    );
                })}
            </div>

            {mode === "written" && (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start typing your response here..."
                        rows={12}
                        className="w-full resize-none rounded-xl border border-[var(--color-ink)]/10 bg-white p-4 text-[15px] leading-relaxed text-[var(--color-ink)] outline-none focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20"
                    />
                    <div className="flex items-center justify-between text-xs text-[var(--color-ink)]/45">
                        <span>{wordCount} words</span>
                        {wordCount < minWords && (
                            <span>Aim for at least {minWords} words</span>
                        )}
                    </div>
                </div>
            )}

            {guidanceNote && (
                <div className="rounded-xl border border-[var(--color-ink)]/10 bg-white">
                    <button
                        type="button"
                        onClick={() => setHintsOpen((v) => !v)}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--color-mint-hover)]"
                    >
                        Hints
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                hintsOpen ? "rotate-180" : ""
                            }`}
                            strokeWidth={2.5}
                        />
                    </button>
                    {hintsOpen && (
                        <p className="border-t border-[var(--color-ink)]/10 px-4 py-3 text-sm leading-relaxed text-[var(--color-ink)]/70">
                            {guidanceNote}
                        </p>
                    )}
                </div>
            )}

            <button
                type="button"
                disabled={!canSubmit}
                onClick={() => canSubmit && onSubmit(text)}
                className="flex items-center justify-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                {submitting ? "Submitting…" : "Submit & get AI feedback"}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
        </div>
    );
}