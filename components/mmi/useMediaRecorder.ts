"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import fixWebmDuration from "fix-webm-duration";

export type RecorderStatus =
    | "idle"
    | "requesting"
    | "recording"
    | "recorded"
    | "error";

interface UseMediaRecorderOptions {
    kind: "audio" | "video";
}

interface UseMediaRecorderResult {
    status: RecorderStatus;
    error: string | null;
    mediaBlobUrl: string | null;
    mediaBlob: Blob | null;
    durationSeconds: number;
    /** Live stream to pipe into a <video> preview while recording. Audio-only recordings never set this. */
    liveStream: MediaStream | null;
    start: () => Promise<void>;
    stop: () => void;
    reset: () => void;
}

// Recording only ever needs a blob URL for local playback — the blob itself
// gets handed to the submit call later, nothing is persisted to storage here.
export function useMediaRecorder({ kind }: UseMediaRecorderOptions): UseMediaRecorderResult {
    const [status, setStatus] = useState<RecorderStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [liveStream, setLiveStream] = useState<MediaStream | null>(null);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const urlRef = useRef<string | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const cleanupStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setLiveStream(null);
    }, []);

    const startedAtRef = useRef<number>(0);
    const start = useCallback(async () => {
        setError(null);
        setStatus("requesting");

        // Starting a new take drops whatever was recorded before.
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        }
        setMediaBlobUrl(null);
        setMediaBlob(null);

        try {
            const constraints: MediaStreamConstraints = kind === "video" ? { audio: true, video: true } : { audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            if (kind === "video") setLiveStream(stream);

            const mimeType = pickSupportedMimeType(kind);
            const recorder = new MediaRecorder(
                stream,
                mimeType ? { mimeType } : undefined
            );
            chunksRef.current = [];
            console.log("MediaRecorder using mimeType:", recorder.mimeType, "| requested:", mimeType);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            recorder.onstop = async () => {
                const resolvedType = mimeType ?? (kind === "video" ? "video/webm" : "audio/webm");
                const rawBlob = new Blob(chunksRef.current, { type: resolvedType });

                const elapsedMs = Date.now() - startedAtRef.current;
                
                // Chrome's MediaRecorder omits the duration/cues index from webm
                // output, so <video>.duration stays Infinity forever — patch the
                // real elapsed time into the blob's EBML header directly.
                let finalBlob = rawBlob;
                if (kind === "video" && resolvedType.includes("webm")) {
                    try {
                        finalBlob = await fixWebmDuration(rawBlob, elapsedMs);
                    } catch {
                        finalBlob = rawBlob; // patch failed — fall back to the raw blob rather than losing the recording
                    }
                }

                const url = URL.createObjectURL(finalBlob);
                urlRef.current = url;
                setMediaBlob(finalBlob);
                setMediaBlobUrl(url);
                setStatus("recorded");
                clearTimer();
                cleanupStream();
            };

            recorder.start();
            recorderRef.current = recorder;
            startedAtRef.current = Date.now();
            setDurationSeconds(0);
            setStatus("recording");
            timerRef.current = setInterval(() => {
                setDurationSeconds((d) => d + 1);
            }, 1000);
        } catch (err) {
            setStatus("error");
            setError(
                err instanceof DOMException && err.name === "NotAllowedError"
                    ? `${kind === "video" ? "Camera/mic" : "Mic"} access was blocked — check your browser permissions and try again.`
                    : `Couldn't start recording. Check your device and try again.`
            );
            cleanupStream();
        }
    }, [kind, cleanupStream, clearTimer]);

    const stop = useCallback(() => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            recorderRef.current.stop();
        }
    }, []);

    const reset = useCallback(() => {
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        }
        clearTimer();
        cleanupStream();
        setMediaBlobUrl(null);
        setMediaBlob(null);
        setDurationSeconds(0);
        setError(null);
        setStatus("idle");
    }, [cleanupStream, clearTimer]);

    // Unmount safety net: don't leave the mic/camera light on or leak object URLs
    // if someone navigates away mid-recording.
    useEffect(() => {
        return () => {
            clearTimer();
            streamRef.current?.getTracks().forEach((track) => track.stop());
            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        };
    }, [clearTimer]);

    return {
        status,
        error,
        mediaBlobUrl,
        mediaBlob,
        durationSeconds,
        liveStream,
        start,
        stop,
        reset,
    };
}

export function formatDuration(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function pickSupportedMimeType(kind: "audio" | "video"): string | undefined {
    if (typeof MediaRecorder === "undefined") return undefined;
    const candidates =
        kind === "video"
            ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
            : ["audio/webm;codecs=opus", "audio/webm"];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}