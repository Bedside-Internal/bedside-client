"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Mic, PenLine, Video } from "lucide-react";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";
import { ComposePayload } from "@/types/mmi";

export type ComposerMode = "written" | "audio" | "video";

interface ModeConfig {
    id: ComposerMode;
    label: string;
    icon: typeof PenLine;
}

const MODES: ModeConfig[] = [
    { id: "written", label: "Write", icon: PenLine },
    { id: "audio", label: "Audio", icon: Mic },
    { id: "video", label: "Video", icon: Video },
];

interface ResponseComposerProps {
    guidanceNote?: string;
    minWords?: number;
    submitting?: boolean;
    onSubmit: (payload: ComposePayload) => void;
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
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

    const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    const canSubmit =
        mode === "written"
            ? wordCount >= minWords
            : mode === "audio"
                ? audioBlob !== null
                : videoBlob !== null;

    function handleSubmitClick() {
        if (mode === "written") {
            onSubmit({ mode: "written", text });
        } else if (mode === "audio" && audioBlob) {
            onSubmit({ mode: "audio", blob: audioBlob });
        } else if (mode === "video" && videoBlob) {
            onSubmit({ mode: "video", blob: videoBlob });
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                {MODES.map(({ id, label, icon: Icon }) => {
                    const active = mode === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setMode(id)}
                            className={[
                                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
                                active
                                    ? "bg-[var(--color-mint)] text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)]"
                                    : "bg-white text-[var(--color-ink)] hover:bg-[var(--color-sand)]",
                            ].join(" ")}
                        >
                            <Icon className="h-4 w-4" strokeWidth={2.25} />
                            {label}
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

            {mode === "audio" && <AudioRecorder onRecordingChange={setAudioBlob} />}
            {mode === "video" && <VideoRecorder onRecordingChange={setVideoBlob} />}

            {guidanceNote && (
                <div className="rounded-xl border border-[var(--color-ink)]/10 bg-white">
                    <button
                        type="button"
                        onClick={() => setHintsOpen((v) => !v)}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--color-mint-hover)]"
                    >
                        Hints
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${hintsOpen ? "rotate-180" : ""
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
                title={
                    !canSubmit
                        ? mode === "written"
                            ? `Write at least ${minWords} words to submit`
                            : "Record a response before submitting"
                        : undefined
                }
                onClick={handleSubmitClick}
                className="flex items-center justify-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                {submitting ? "Submitting…" : "Submit & get AI feedback"}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
        </div>
    );
}