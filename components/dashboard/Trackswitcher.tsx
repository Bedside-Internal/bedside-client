"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export interface Track {
  id: string;
  label: string;
  /** Pass an already-rendered icon element (e.g. <GraduationCap />), not the component itself — this crosses a server/client boundary. */
  icon: ReactNode;
}

interface TrackSwitcherProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack?: (id: string) => void;
  onAddTrack?: () => void;
}

export function TrackSwitcher({ tracks, activeTrackId, onSelectTrack, onAddTrack }: TrackSwitcherProps) {
  return (
    <div>
      {tracks.map((track) => {
        const active = track.id === activeTrackId;
        return (
          <button key={track.id} type="button" aria-pressed={active} onClick={() => onSelectTrack?.(track.id)}>
            {track.icon}
            <span>{track.label}</span>
          </button>
        );
      })}
      <button type="button" onClick={onAddTrack}>
        <Plus />
        <span>Add track</span>
      </button>
    </div>
  );
}