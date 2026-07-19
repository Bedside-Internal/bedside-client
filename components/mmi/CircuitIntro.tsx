"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mic, Video, CheckCircle2 } from "lucide-react";
import { resolveIcon } from "@/lib/iconRegistry";
import { startCircuit } from "@/lib/api/circuit-actions";
import type { CircuitPreview } from "@/types/circuit";

interface CircuitIntroProps {
  preview: CircuitPreview;
}

export function CircuitIntro({ preview }: CircuitIntroProps) {
  const router = useRouter();
  const [micGranted, setMicGranted] = useState(!preview.requiresMic);
  const [cameraGranted, setCameraGranted] = useState(!preview.requiresCamera);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function requestPermissions() {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: preview.requiresMic,
        video: preview.requiresCamera,
      });
      stream.getTracks().forEach((track) => track.stop()); // just checking access, not keeping the stream open
      setMicGranted(true);
      setCameraGranted(true);
    } catch {
      setPermissionError("Couldn't access your mic/camera — check your browser permissions and try again.");
    }
  }

  const readyToBegin = micGranted && cameraGranted;

  function handleBegin() {
    startTransition(async () => {
      const attempt = await startCircuit();
      router.push(`/mmi/circuit/run?attempt=${attempt.attemptId}&station=0&phase=question`);
    });
  }

  return (
    <div className="w-full rounded-2xl border border-[var(--color-sand)] bg-[var(--color-cream)] p-6 shadow-sm">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
          Your Turn
        </p>
        <h1 className="font-serif text-3xl italic text-[var(--color-ink)]">
          Your <span className="text-[var(--color-mint)]">MMI Circuit</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/50">
          {preview.stations.length} stations · ~{preview.totalEstimatedMinutes} min total
        </p>
      </div>

      <div className="mb-4 divide-y divide-[var(--color-sand)] rounded-xl border border-[var(--color-sand)] bg-white">
        {preview.stations.map((station) => {
          const Icon = resolveIcon(station.iconKey ?? "");
          return (
            <div key={station.sectionSlug} className="flex items-center gap-3 px-4 py-3">
              <Icon className="h-4 w-4 shrink-0 text-[var(--color-ink)]/50" strokeWidth={2} />
              <span className="text-sm font-medium text-[var(--color-ink)]">{station.title}</span>
            </div>
          );
        })}
      </div>

      <div className="mb-4 rounded-xl bg-[var(--color-sand)] px-4 py-3 text-xs leading-relaxed text-[var(--color-ink)]/60">
        <p className="mb-1 font-semibold uppercase tracking-wide text-[var(--color-ink)]/45">How this works</p>
        <p>2 minutes to read each scenario before your response window opens.</p>
        <p>Once a station starts, you can&apos;t go back — just like the real thing.</p>
        <p>Short breaks are built in between stations so you can reset.</p>
      </div>

      {(preview.requiresMic || preview.requiresCamera) && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--color-sand)] bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
            {preview.requiresMic && <Mic className="h-4 w-4" strokeWidth={2} />}
            {preview.requiresCamera && <Video className="h-4 w-4" strokeWidth={2} />}
            <span>Microphone &amp; camera access</span>
          </div>
          {readyToBegin ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-mint)]">
              <CheckCircle2 className="h-4 w-4" /> Enabled
            </span>
          ) : (
            <button
              type="button"
              onClick={requestPermissions}
              className="rounded-lg bg-[var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ink)]/85"
            >
              Enable
            </button>
          )}
        </div>
      )}

      {permissionError && <p className="mb-4 text-center text-xs text-[var(--color-coral)]">{permissionError}</p>}

      <button
        type="button"
        disabled={!readyToBegin || isPending}
        onClick={handleBegin}
        className="w-full rounded-xl bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Starting…" : "Enable mic & camera to continue"}
      </button>

      <div className="mt-4 text-center">
        <a href="/dashboard" className="text-xs text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/60">
          ← Back to dashboard
        </a>
      </div>
    </div>
  );
}