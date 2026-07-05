import { UserButton } from "@clerk/nextjs";
import { TrackSwitcher, type Track } from "@/components/dashboard/Trackswitcher";

interface TopBarProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack?: (id: string) => void;
  onAddTrack?: () => void;
}

export function TopBar({ tracks, activeTrackId, onSelectTrack, onAddTrack }: TopBarProps) {
  return (
    <div>
      <TrackSwitcher
        tracks={tracks}
        activeTrackId={activeTrackId}
        onSelectTrack={onSelectTrack}
        onAddTrack={onAddTrack}
      />
      <UserButton />
    </div>
  );
}