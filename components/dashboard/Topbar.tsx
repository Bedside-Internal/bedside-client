import Link from "next/link";
import { TrackSwitcher, type Track } from "@/components/dashboard/Trackswitcher";
import { SessionBar } from "../onboarding/SessionBar";

interface TopBarProps {
    tracks: Track[];
    activeTrackId: string;
    onSelectTrack?: (id: string) => void;
    onAddTrack?: () => void;
}

export function TopBar({ tracks, activeTrackId, onSelectTrack, onAddTrack }: TopBarProps) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-6">
                <a href="/" className="flex items-center gap-2 text-ink no-underline">
                    <img src={"/bedside_logo.svg"} alt="Bedside" className="h-10 w-auto" />
                    <span className="font-display text-[22px] tracking-tight">
                        Bedside
                    </span>
                </a>
                <div className="h-5 w-px bg-slate-200" />
                <TrackSwitcher
                    tracks={tracks}
                    activeTrackId={activeTrackId}
                    onSelectTrack={onSelectTrack}
                    onAddTrack={onAddTrack}
                />
            </div>
            <SessionBar />
        </div>
    );
}