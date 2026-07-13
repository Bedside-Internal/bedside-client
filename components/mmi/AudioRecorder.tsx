"use client";

import { useEffect } from "react";
import { Mic, RotateCcw, Square } from "lucide-react";
import { formatDuration, useMediaRecorder } from "./useMediaRecorder";

interface AudioRecorderProps {
    /** Fires whenever the recorded blob changes — wire this to submit later. */
    onRecordingChange?: (blob: Blob | null) => void;
}

export function AudioRecorder({ onRecordingChange }: AudioRecorderProps) {
    const { status, error, mediaBlobUrl, mediaBlob, durationSeconds, start, stop, reset } =
        useMediaRecorder({ kind: "audio" });

    useEffect(() => {
        onRecordingChange?.(mediaBlob);
    }, [mediaBlob, onRecordingChange]);

    const recording = status === "recording";
    const recorded = status === "recorded" && mediaBlobUrl;

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--color-ink)]/10 bg-white px-6 py-10">
            {recorded ? (
                <>
                    <audio controls src={mediaBlobUrl} className="w-full" />
                    <button
                        type="button"
                        onClick={reset}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-mint-hover)] hover:underline"
                    >
                        <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Record again
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={recording ? stop : start}
                        disabled={status === "requesting"}
                        aria-label={recording ? "Stop recording" : "Start recording"}
                        className={[
                            "flex h-16 w-16 items-center justify-center rounded-full transition disabled:opacity-50",
                            recording
                                ? "animate-pulse bg-[var(--color-coral)] text-white"
                                : "bg-[var(--color-mint)]/10 text-[var(--color-mint-hover)] hover:bg-[var(--color-mint)]/20",
                        ].join(" ")}
                    >
                        {recording ? (
                            <Square className="h-6 w-6" strokeWidth={2} fill="currentColor" />
                        ) : (
                            <Mic className="h-7 w-7" strokeWidth={2} />
                        )}
                    </button>
                    <p className="text-sm text-[var(--color-ink)]/60">
                        {recording
                            ? formatDuration(durationSeconds)
                            : status === "requesting"
                            ? "Requesting mic access…"
                            : "Tap to start recording"}
                    </p>
                </>
            )}
            {error && <p className="text-xs text-[var(--color-coral)]">{error}</p>}
        </div>
    );
}