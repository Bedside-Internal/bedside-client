import { Grid2X2, FileText, Video, GraduationCap, School, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { User } from "@clerk/nextjs/server";
import { createElement } from "react";
import { currentUser } from "@clerk/nextjs/server";

import { TopBar } from "@/components/dashboard/Topbar";
import { GreetingHeader } from "@/components/dashboard/Greetingheader";
import { CountdownCard } from "@/components/dashboard/Countdowncard";
import { FormatCard } from "@/components/dashboard/Formatcard";
import { WeakestAreaCard } from "@/components/dashboard/Weakestareacard";
import { QuickActionRow } from "@/components/dashboard/Quickactionrow";
import { ReadinessSummary } from "@/components/dashboard/Readinesssummary";
import { ActivityStreakCard } from "@/components/dashboard/ActivityStreakCard";
import { getOnboardingProgress } from "@/lib/actions";
import { redirect } from "next/navigation";
import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import { getReferralSummary } from "@/lib/api/referrals";

const tracks = [
    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
    { id: "college-admissions", label: "College Admissions", icon: <School /> },
];

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
    recentActivity: {
        items: Array<{ status: "success" | "warning"; title: string; meta: string; score: number }>;
        lockedCount: number;
    };
    streak: {
        streakDays: number;
        message: string;
        days: Array<{ label: string; completed: boolean; isToday?: boolean }>;
    };
}

async function getDashboardData(trackSlug: string): Promise<DashboardApiResponse> {
    return serverApiFetch<DashboardApiResponse>(`/api/dashboard?track=${encodeURIComponent(trackSlug)}`);
}

export { getDashboardData };

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</p>;
}

function AccountSyncingState() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-cream)] px-6 text-center">
            <p className="text-lg font-semibold text-[var(--color-ink)]">Setting up your account</p>
            <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
                This usually takes just a few seconds. Refresh in a moment to pick up where you left off.
            </p>
        </div>
    );
}

export default async function Dashboard() {
    const progress = await getOnboardingProgress();

    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    let user: User | null;
    let data: DashboardApiResponse;
    try {
        [user, data] = await Promise.all([currentUser(), getDashboardData(progress.track)]);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            return <AccountSyncingState />;
        }
        throw err;
    }

    // Soft-fail: referral summary is just powering a teaser row now, never worth
    // breaking the dashboard over.
    const referralSummary = await getReferralSummary().catch(() => null);
    const referralSubtitle =
        referralSummary && referralSummary.activatedCount > 0
            ? `${referralSummary.activatedCount} friend${referralSummary.activatedCount === 1 ? "" : "s"} joined — unlock more access`
            : "Unlock Pro access through referrals";

    const firstName = user?.firstName ?? "there";
    const weakestAreaIcon = data.weakestArea
        ? createElement(getIcon(data.weakestArea.iconKey), { className: "h-5 w-5", strokeWidth: 2 })
        : null;

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <TopBar tracks={tracks} activeTrackId={data.track.slug} />

            <div className="mx-auto max-w-[1600px] px-10">
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
                                <FormatCard
                                    key={format.title}
                                    title={format.title}
                                    subtitle={format.subtitle}
                                    score={format.score}
                                    metrics={format.metrics}
                                    progressLabel={format.progressLabel}
                                    continueHref={format.continueHref}
                                    icon={createElement(getIcon(format.iconKey), {
                                        className: "h-5 w-5 text-slate-500",
                                        strokeWidth: 2,
                                    })}
                                />
                            ))}
                        </div>
                    </section>

                    <section aria-label="Recommended next" className="space-y-8">
                        {data.weakestArea && weakestAreaIcon && (
                            <div>
                                <SectionLabel>Recommended next</SectionLabel>
                                <WeakestAreaCard
                                    eyebrow={data.weakestArea.eyebrow}
                                    icon={weakestAreaIcon}
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
                                <QuickActionRow
                                    icon={FileText}
                                    title="My Questions"
                                    subtitle="Submit practice questions for review"
                                    href="/dashboard/my-questions"
                                />
                                <QuickActionRow
                                    icon={Users}
                                    title="Invite friends"
                                    subtitle={referralSubtitle}
                                    href="/dashboard/refer"
                                />
                            </div>
                        </div>
                    </section>

                    <section aria-label="Overall readiness" className="space-y-6">
                        <div>
                            <SectionLabel>Overall readiness</SectionLabel>
                            <ReadinessSummary overallScore={data.readiness.overallScore} breakdown={data.readiness.breakdown} />
                        </div>
                        <ActivityStreakCard
                            activityItems={data.recentActivity.items}
                            lockedCount={data.recentActivity.lockedCount}
                            streakDays={data.streak.streakDays}
                            streakMessage={data.streak.message}
                            streakDaysList={data.streak.days}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}