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
        <div className="flex flex-wrap items-center gap-3">
            {tracks.map((track) => {
                const active = track.id === activeTrackId;
                return (
                    <button
                        key={track.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelectTrack?.(track.id)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active
                                ? "bg-[var(--color-mint)] text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                    >
                        <span className="[&>svg]:h-4 [&>svg]:w-4">{track.icon}</span>
                        <span>{track.label}</span>
                    </button>
                );
            })}
            <button
                type="button"
                onClick={onAddTrack}
                className="flex items-center gap-2 rounded-full border border-dashed border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:border-slate-300 hover:text-slate-500"
            >
                <Plus className="h-4 w-4" />
                <span>Add track</span>
            </button>
        </div>
    );
}