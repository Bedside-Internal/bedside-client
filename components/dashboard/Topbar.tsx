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
        // Phones: logo + account on the first row, track switcher scrolls on its own row.
        // md and up: a single row, as before.
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:flex-nowrap md:gap-x-6 md:px-6 md:py-4">
            <Logo />
            <div className="hidden h-5 w-px bg-slate-200 md:block" />
            <SessionBar className="ml-auto md:order-last" />
            <div className="no-scrollbar order-last basis-full overflow-x-auto md:order-none md:basis-auto md:flex-1 md:overflow-visible">
                <TrackSwitcher
                    tracks={tracks}
                    activeTrackId={activeTrackId}
                    onSelectTrack={onSelectTrack}
                    onAddTrack={onAddTrack}
                />
            </div>
        </div>
    );
}