import Image from "next/image";
import Link from "next/link";

import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StationCard } from "@/components/onboarding/StationCard";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { getCasperCompetencies } from "@/lib/api/casper";
import { resolveIcon } from "@/lib/iconRegistry";
import { RandomStationButton } from "@/components/mmi/RandomStationButton";
import { PracticeMyQuestionsButton } from "@/components/mmi/PracticeMyQuestionsButton";
import { getTierStatus } from "@/lib/api/tier";
import { getOnboardingProgress } from "@/lib/actions";
import { getMyPrivateQuestions } from "@/lib/api/userQuestions";
import { FormatOverviewTutorial } from "@/components/tutorials/TutorialOverlay";

export default async function CasperPage() {
    const [competencies, tierStatus, progress] = await Promise.all([
        getCasperCompetencies(),
        getTierStatus(),
        getOnboardingProgress(),
    ]);

    const dashboardReady = Boolean(progress?.track && progress?.format);
    const canUseOwnQuestions = tierStatus.tier !== "free";

    const casperSectionSlugs = new Set(competencies.map((c) => c.href.split("/").filter(Boolean).pop()));
    const privateQuestions = canUseOwnQuestions ? await getMyPrivateQuestions() : [];
    const hasOwnCasperQuestions = privateQuestions.some((q) => casperSectionSlugs.has(q.sectionSlug));

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 -z-20 bg-[var(--color-sand)]" />
            <Image src="/images/casper.jpg" alt="" fill priority={false} className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-20" />
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
                <BreadcrumbNav
                    items={[
                        ...(dashboardReady ? [{ label: "Dashboard", href: "/dashboard" }] : []),
                        { label: "Medical School Interview", href: "/onboarding/medical-school" },
                        { label: "CASPer" },
                    ]}
                />
                <SessionBar />
            </div>
            <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pb-28">
                <OnboardingHeader eyebrow="CASPer - Situational Judgement" title="Practice by competency" subtitle="Each section: watch a short scenario, then answer questions in five minutes" />
                <FormatOverviewTutorial format="casper" />
                <div data-tour="casper-competency-grid" className="mt-10 grid grid-cols-1 sm:mt-14 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {competencies.map((c) => (
                        <StationCard key={c.title} icon={resolveIcon(c.icon)} title={c.title} description={c.description} totalQuestions={c.totalQuestions} completedQuestions={c.completedQuestions} unitLabel="sections" href={c.href} />
                    ))}
                </div>
            </div>
            <div className="mx-auto flex max-w-6xl justify-end px-4 pb-10 sm:-mt-16 sm:px-6">
                <div data-tour="casper-practice-options" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <RandomStationButton stations={competencies} />
                    <PracticeMyQuestionsButton
                        formatSlug="casper"
                        formatLabel="CASPer"
                        circuitBasePath="/casper/full"
                        stationBasePath="casper"
                        canUseOwnQuestions={canUseOwnQuestions}
                        hasOwnQuestions={hasOwnCasperQuestions}
                    />
                    <Link href="/casper/full" className="flex w-full items-center justify-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-3 sm:w-auto sm:py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)]">
                        Start a full mock test →
                    </Link>
                </div>
            </div>
        </div>
    );
}
