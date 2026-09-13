import Image from "next/image";

import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StationCard } from "@/components/onboarding/StationCard";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { getMmiStations } from "@/lib/api/stations";
import { resolveIcon } from "@/lib/iconRegistry";
import { RunAnotherCircuitButton } from "@/components/circuit/RunAnotherCircuitButton";
import { RandomStationButton } from "@/components/mmi/RandomStationButton";
import { PracticeMyQuestionsButton } from "@/components/mmi/PracticeMyQuestionsButton";
import { getTierStatus } from "@/lib/api/tier";

export default async function MmiPage() {
    const [stations, tierStatus] = await Promise.all([getMmiStations(), getTierStatus()]);

    return (
        <div className="min-h-screen relative">
            {/* ...unchanged... */}
            <div className="mx-auto -mt-16 flex max-w-6xl justify-end px-6 pb-10">
                <div className="flex items-center gap-3">
                    <RandomStationButton stations={stations} />
                    <PracticeMyQuestionsButton
                        formatSlug="mmi"
                        circuitBasePath="/mmi/full"
                        stationBasePath="mmi"
                        canUseOwnQuestions={tierStatus.tier !== "free"}
                    />
                    <RunAnotherCircuitButton formatSlug="mmi" basePath="/mmi/full" label="Start a full circuit →" />
                </div>
            </div>
        </div>
    );
}