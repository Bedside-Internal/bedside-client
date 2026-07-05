"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { TrackCard } from "./TrackCard";

interface Track {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  disabled?: boolean;
}

export function TrackSelector({ tracks }: { tracks: Track[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const selectedTrack = tracks.find((t) => t.id === selected);

  function handleContinue() {
    if (!selectedTrack) return;
    router.push(selectedTrack.href);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <div key={track.id} className={track.disabled ? "" : "sm:col-span-2"}>
            <TrackCard
              icon={track.icon}
              title={track.title}
              subtitle={track.subtitle}
              disabled={track.disabled}
              selected={selected === track.id}
              onSelect={track.disabled ? undefined : () => setSelected(track.id)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className={`flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            selected
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}