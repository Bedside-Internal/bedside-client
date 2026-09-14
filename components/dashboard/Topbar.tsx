import { TrackSwitcher, type Track } from "@/components/dashboard/Trackswitcher";
import { SessionBar } from "../onboarding/SessionBar";
import { Logo } from "../ui/Logo";

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
                <Logo />
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