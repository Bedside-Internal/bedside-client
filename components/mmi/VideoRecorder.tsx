"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Video as VideoIcon } from "lucide-react";
import { formatDuration, useMediaRecorder } from "./useMediaRecorder";

interface VideoRecorderProps {
    onRecordingChange?: (blob: Blob | null) => void;
}

export function VideoRecorder({ onRecordingChange }: VideoRecorderProps) {
    const { status, error, mediaBlobUrl, mediaBlob, durationSeconds, liveStream, start, stop, reset } =
        useMediaRecorder({ kind: "video" });
    const liveRef = useRef<HTMLVideoElement | null>(null);
    const playbackRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (liveRef.current) liveRef.current.srcObject = liveStream;
    }, [liveStream]);

    useEffect(() => {
        onRecordingChange?.(mediaBlob);
    }, [mediaBlob, onRecordingChange]);

    // MediaRecorder's webm output frequently has no duration in its metadata —
    // Chrome reports duration: Infinity and paints nothing but a black frame.
    // Seeking once past the end and back forces a real duration + first frame.
    useEffect(() => {
        const videoEl = playbackRef.current;
        if (!videoEl || !mediaBlobUrl) return;

        const fixDuration = () => {
            if (!Number.isFinite(videoEl.duration) || videoEl.duration === 0) {
                videoEl.currentTime = 1e101;
                const handleSeeked = () => {
                    videoEl.currentTime = 0;
                    videoEl.removeEventListener("seeked", handleSeeked);
                };
                videoEl.addEventListener("seeked", handleSeeked);
            }
        };

        if (videoEl.readyState >= 1) {
            // HAVE_METADATA or higher already — the event already fired, run now.
            fixDuration();
        } else {
            videoEl.addEventListener("loadedmetadata", fixDuration, { once: true });
        }

        return () => videoEl.removeEventListener("loadedmetadata", fixDuration);
    }, [mediaBlobUrl]);

    const recording = status === "recording";
    const recorded = status === "recorded" && mediaBlobUrl;

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--color-ink)]">
                {recorded ? (
                    <video
                        key="playback"
                        ref={playbackRef}
                        controls
                        playsInline
                        src={mediaBlobUrl}
                        className="h-full w-full object-cover"
                    />
                ) : recording ? (
                    <>
                        <video key="live" ref={liveRef} autoPlay muted playsInline className="h-full w-full object-cover" />
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