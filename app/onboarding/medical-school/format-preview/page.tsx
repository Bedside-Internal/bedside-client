import Image from "next/image";

import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StationCard } from "@/components/onboarding/StationCard";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { getPreviewCompetencies } from "@/lib/api/preview";
import { resolveIcon } from "@/lib/iconRegistry";
import { RandomStationButton } from "@/components/mmi/RandomStationButton";
import Link from "next/link";

export default async function PreviewPage() {
    const competencies = await getPreviewCompetencies();

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
                        { label: "PREview" },
                    ]}
                />
                <SessionBar />
            </div>

            <div className="mx-auto max-w-6xl px-6 pb-28 pt-4">
                <OnboardingHeader
                    eyebrow="PREview - Professional Readiness Evaluation"
                    title="Practice your responses"
                    subtitle="Read a scenario and select from a scale"
                />

                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {competencies.map((c) => (
                        <StationCard
                            key={c.title}
                            icon={resolveIcon(c.icon)}
                            title={c.title}
                            description={c.description}
                            totalQuestions={c.totalScenarios}
                            completedQuestions={c.completedScenarios}
                            unitLabel="scenarios"
                            href={c.href}
                        />
                    ))}
                </div>
            </div>

            <div className="mx-auto -mt-16 flex max-w-6xl justify-end px-6 pb-10">
                <div className="flex items-center gap-3">
                    <RandomStationButton stations={competencies} />
                    <Link
                        href="/preview/full"
                        className="flex items-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)]"
                    >
                        Start a full mock test →
                    </Link>
                </div>
            </div>
        </div>
    );
}