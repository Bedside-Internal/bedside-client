import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StationCard } from "@/components/onboarding/StationCard";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { getMmiStations } from "@/lib/api/stations";
import { resolveIcon } from "@/lib/iconRegistry";
import { RunAnotherCircuitButton } from "@/components/mmi/RunAnotherCircuitButton";
import { RandomStationButton } from "@/components/mmi/RandomStationButton";

export default async function MmiPage() {
    const stations = await getMmiStations();

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 -z-20 bg-[var(--color-sand)]" />
            <Image
                src="/images/mmi.png"
                alt=""
                fill
                priority={false}
                className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-20"
            />
            <div className="flex items-center justify-between px-6 py-5">
                <BreadcrumbNav
                    items={[
                        { label: "Medical School Interview", href: "/onboarding/medical-school" },
                        { label: "MMI" },
                    ]}
                />
                <SessionBar />
            </div>

            <div className="mx-auto max-w-6xl px-6 pb-28 pt-4">
                <OnboardingHeader
                    eyebrow="Multiple Mini Interview"
                    title="Practice your stations"
                    subtitle="8-minute timed scenarios across 6 core station types; pick one to drill or run a full circuit"
                />

                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {stations.map((station) => (
                        <StationCard key={station.title} {...station} icon={resolveIcon(station.icon)} />
                    ))}
                </div>
            </div>

            <div className="mx-auto -mt-16 flex max-w-6xl justify-end px-6 pb-10">
                <div className="flex items-center gap-3">
                    <RandomStationButton stations={stations} />
                    <RunAnotherCircuitButton label="Start a full circuit →" />
                </div>
            </div>
        </div>
    );
}