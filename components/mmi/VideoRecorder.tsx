"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Video as VideoIcon } from "lucide-react";
import { formatDuration, useMediaRecorder } from "./useMediaRecorder";

interface VideoRecorderProps {
    /** Fires whenever the recorded blob changes — wire this to submit later. */
    onRecordingChange?: (blob: Blob | null) => void;
}

export function VideoRecorder({ onRecordingChange }: VideoRecorderProps) {
    const { status, error, mediaBlobUrl, mediaBlob, durationSeconds, liveStream, start, stop, reset } =
        useMediaRecorder({ kind: "video" });
    const liveRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (liveRef.current) liveRef.current.srcObject = liveStream;
    }, [liveStream]);

    useEffect(() => {
        onRecordingChange?.(mediaBlob);
    }, [mediaBlob, onRecordingChange]);

    const recording = status === "recording";
    const recorded = status === "recorded" && mediaBlobUrl;

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--color-ink)]">
                {recorded ? (
                    <video controls src={mediaBlobUrl} className="h-full w-full object-cover" />
                ) : recording ? (
                    <>
                        <video ref={liveRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[var(--color-coral)] px-2.5 py-1 text-xs font-bold text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            REC {formatDuration(durationSeconds)}
                        </span>
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/50">
                        <VideoIcon className="h-8 w-8" strokeWidth={1.5} />
                        <span className="text-sm">
                            {status === "requesting" ? "Requesting camera access…" : "Camera preview"}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-3">
                {recorded ? (
                    <button
                        type="button"
                        onClick={reset}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-mint-hover)] hover:underline"
                    >
                        <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Record again
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={recording ? stop : start}
                        disabled={status === "requesting"}
                        className={[
                            "rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50",
                            recording
                                ? "bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90"
                                : "bg-[var(--color-mint)] hover:bg-[var(--color-mint-hover)]",
                        ].join(" ")}
                    >
                        {recording ? "Stop recording" : "Start recording"}
                    </button>
                )}
            </div>
            {error && <p className="text-center text-xs text-[var(--color-coral)]">{error}</p>}
        </div>
    );
}