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
            <TrackSwitcher
                tracks={tracks}
                activeTrackId={activeTrackId}
                onSelectTrack={onSelectTrack}
                onAddTrack={onAddTrack}
            />
            <SessionBar />
        </div>
    );
}