import { cookies } from "next/headers";
import { Grid2X2, FileText, Video, GraduationCap, School } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

import { TopBar } from "@/components/dashboard/Topbar";
import { GreetingHeader } from "@/components/dashboard/Greetingheader";
import { CountdownCard } from "@/components/dashboard/Countdowncard";
import { FormatCard } from "@/components/dashboard/Formatcard";
import { WeakestAreaCard } from "@/components/dashboard/Weakestareacard";
import { QuickActionRow } from "@/components/dashboard/Quickactionrow";
import { ReadinessSummary } from "@/components/dashboard/Readinesssummary";
import { ActivityRow } from "@/components/dashboard/Activityrow";
import { StreakCard } from "@/components/dashboard/Streakcard";
import { getOnboardingProgress } from "@/lib/actions";
import { redirect } from "next/navigation";

// TODO: Track switcher is static for now — the API only returns the *active* track, not the full list. Will need to swap this for a real endpoint once one exists.
const tracks = [
    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
    { id: "college-admissions", label: "College Admissions", icon: <School /> },
];

// Maps the API's iconKey strings to actual Lucide components.
const iconMap: Record<string, LucideIcon> = {
    grid: Grid2X2,
    "file-text": FileText,
    video: Video,
    mmi: Grid2X2,
    casper: FileText,
    preview: Video,
};

function getIcon(key: string): LucideIcon {
    return iconMap[key] ?? Grid2X2;
}

interface DashboardApiResponse {
    track: { id: string; slug: string; label: string };
    countdown: { daysRemaining: number; prepTimeUsedPercent: number };
    formats: Array<{
        iconKey: string;
        title: string;
        subtitle: string;
        score: number;
        metrics: Array<{ label: string; value: number; tone?: "mint" | "amber" | "coral" | "slate" }>;
        progressLabel: string;
        continueHref: string;
    }>;
    weakestArea: {
        eyebrow: string;
        iconKey: string;
        title: string;
        description: string;
        ctaLabel: string;
    } | null;
    quickActions: Array<{ iconKey: string; title: string; subtitle: string; href: string }>;
    readiness: { overallScore: number; breakdown: Array<{ label: string; value: number }> };
    recentActivity: Array<{ status: "success" | "warning"; title: string; meta: string; score: number }>;
    streak: {
        streakDays: number;
        message: string;
        days: Array<{ label: string; completed: boolean; isToday?: boolean }>;
    };
}

async function getDashboardData(): Promise<DashboardApiResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const cookieStore = await cookies();

    const res = await fetch(`${baseUrl}/api/dashboard`, {
        cache: "no-store",
        headers: {
            cookie: cookieStore.toString(),
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch dashboard data: ${res.status}`);
    }

    return res.json();
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</p>;
}

export default async function Dashboard() {
    const progress = await getOnboardingProgress();

    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    const [user, data] = await Promise.all([currentUser(), getDashboardData()]);
    const firstName = user?.firstName ?? "there";

    const WeakestIcon = data.weakestArea ? getIcon(data.weakestArea.iconKey) : null;

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <TopBar tracks={tracks} activeTrackId={data.track.slug} />

            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-[var(--color-sand)] pb-8 sm:flex-row">
                    <GreetingHeader name={firstName} streakDays={data.streak.streakDays} timeOfDay="morning" />
                    <CountdownCard
                        daysRemaining={data.countdown.daysRemaining}
                        prepTimeUsedPercent={data.countdown.prepTimeUsedPercent}
                    />
                </div>

                <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-3">
                    <section aria-label="Your formats">
                        <SectionLabel>Your formats</SectionLabel>
                        <div className="space-y-6">
                            {data.formats.map((format) => (
                                <FormatCard key={format.title} {...format} icon={getIcon(format.iconKey)} />
                            ))}
                        </div>
                    </section>

                    <section aria-label="Recommended next" className="space-y-8">
                        {data.weakestArea && WeakestIcon && (
                            <div>
                                <SectionLabel>Recommended next</SectionLabel>
                                <WeakestAreaCard
                                    eyebrow={data.weakestArea.eyebrow}
                                    icon={<WeakestIcon />}
                                    title={data.weakestArea.title}
                                    description={data.weakestArea.description}
                                    ctaLabel={data.weakestArea.ctaLabel}
                                />
                            </div>
                        )}
                        <div>
                            <SectionLabel>Quick actions</SectionLabel>
                            <div className="space-y-3">
                                {data.quickActions.map((action) => (
                                    <QuickActionRow key={action.title} {...action} icon={getIcon(action.iconKey)} />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section aria-label="Overall readiness" className="space-y-8">
                        <div>
                            <SectionLabel>Overall readiness</SectionLabel>
                            <ReadinessSummary overallScore={data.readiness.overallScore} breakdown={data.readiness.breakdown} />
                        </div>
                        <div>
                            <SectionLabel>Recent activity</SectionLabel>
                            <div className="divide-y divide-[var(--color-sand)] rounded-2xl border border-[var(--color-sand)] bg-white px-5 shadow-sm">
                                {data.recentActivity.map((activity, i) => (
                                    <ActivityRow key={`${activity.title}-${i}`} {...activity} />
                                ))}
                            </div>
                        </div>
                        <StreakCard
                            streakDays={data.streak.streakDays}
                            message={data.streak.message}
                            days={data.streak.days}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}