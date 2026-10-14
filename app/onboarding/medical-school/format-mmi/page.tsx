import Image from "next/image";
import { MmiOverviewTutorial } from "@/components/tutorials/TutorialOverlay";

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
import { getOnboardingProgress } from "@/lib/actions";
import { getMyPrivateQuestions } from "@/lib/api/userQuestions";

export default async function MmiPage() {
    const [stations, tierStatus, progress] = await Promise.all([
        getMmiStations(),
        getTierStatus(),
        getOnboardingProgress(),
    ]);

    const dashboardReady = Boolean(progress?.track && progress?.format);
    const canUseOwnQuestions = tierStatus.tier !== "free";

    const mmiSectionSlugs = new Set(stations.map((s) => s.href.split("/").filter(Boolean).pop()));
    const privateQuestions = canUseOwnQuestions ? await getMyPrivateQuestions() : [];
    const hasOwnMmiQuestions = privateQuestions.some((q) => mmiSectionSlugs.has(q.sectionSlug));

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
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
                <BreadcrumbNav
                    items={[
                        ...(dashboardReady ? [{ label: "Dashboard", href: "/dashboard" }] : []),
                        { label: "Medical School Interview", href: "/onboarding/medical-school" },
                        { label: "MMI" },
                    ]}
                />
                <SessionBar />
            </div>

            <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pb-28">
                <OnboardingHeader
                    eyebrow="Multiple Mini Interview"
                    title="Practice your stations"
                    subtitle="8-minute timed scenarios across 6 core station types; pick one to drill or run a full circuit"
                />

                <MmiOverviewTutorial />

                <div data-tour="mmi-station-grid" className="mt-10 grid grid-cols-1 sm:mt-14 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {stations.map((station) => (
                        <StationCard key={station.title} {...station} icon={resolveIcon(station.icon)} />
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-6xl justify-end px-4 pb-10 sm:-mt-16 sm:px-6">
                <div data-tour="mmi-practice-options" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <RandomStationButton stations={stations} />
                    <PracticeMyQuestionsButton
                        formatSlug="mmi"
                        formatLabel="MMI"
                        circuitBasePath="/mmi/full"
                        stationBasePath="mmi"
                        canUseOwnQuestions={canUseOwnQuestions}
                        hasOwnQuestions={hasOwnMmiQuestions}
                    />
                    <RunAnotherCircuitButton formatSlug="mmi" basePath="/mmi/full" label="Start a full circuit →" />
                </div>
            </div>
        </div>
    );
}