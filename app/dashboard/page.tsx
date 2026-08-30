import { Grid2X2, FileText, Video, GraduationCap, School } from "lucide-react";
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
import { ActivityRow } from "@/components/dashboard/Activityrow";
import { StreakCard } from "@/components/dashboard/Streakcard";
import { getOnboardingProgress } from "@/lib/actions";
import { redirect } from "next/navigation";
import { LockedActivityRow } from "@/components/dashboard/LockedActivityRow";
import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import { getReferralSummary, getUnlockProgress } from "@/lib/api/referrals";
import { getPricingTiers } from "@/lib/api/marketing";
import { computeTierUnlockStatus } from "@/lib/referrals/tierUnlockStatus";
import { ReferralCard } from "@/components/dashboard/ReferralCard";
import { FileText } from "lucide-react";

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

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</p>;
}

function EmptyActivityState() {
    return (
        <div className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-white/60 px-5 py-8 text-center">
            <p className="text-sm font-medium text-[var(--color-ink)]">No sessions yet</p>
            <p className="mt-1 text-sm text-slate-400">
                Finish your first practice session to see it show up here.
            </p>
        </div>
    );
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

    // A failed /api/dashboard call says nothing about onboarding status, so
    // it must never be treated as "user isn't onboarded." The one exception
    // we distinguish is the Clerk->Postgres sync-pending 404, which is a
    // transient, expected state right after sign-up — everything else falls
    // through to the nearest error.tsx boundary.
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

    // Supplementary — soft-fail so a referral API hiccup never breaks the
    // whole dashboard the way a failed `data` fetch does above.
    const referralData = await Promise.all([
        getReferralSummary(),
        getUnlockProgress(),
        getPricingTiers(),
    ]).catch(() => null);

    const referralCardProps = referralData
        ? {
            shareUrl: referralData[0].shareUrl,
            activatedCount: referralData[0].activatedCount,
            tiers: computeTierUnlockStatus(
                referralData[2].map((t) => ({ id: t.id, title: t.title, requirements: t.requirements })),
                referralData[1],
            ),
        }
        : null;

    // NOTE: an empty recentActivity list is a normal state for a freshly
    // onboarded user with no attempts yet — it is NOT a signal that
    // onboarding is incomplete. Render an empty state instead of redirecting.

    const firstName = user?.firstName ?? "there";
    const weakestAreaIcon = data.weakestArea
        ? createElement(getIcon(data.weakestArea.iconKey), { className: "h-5 w-5", strokeWidth: 2 })
        : null;

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
                            {data.recentActivity.items.length === 0 && data.recentActivity.lockedCount === 0 ? (
                                <EmptyActivityState />
                            ) : (
                                <div className="divide-y divide-[var(--color-sand)] rounded-2xl border border-[var(--color-sand)] bg-white px-5 shadow-sm">
                                    {data.recentActivity.items.map((activity, i) => (
                                        <ActivityRow key={`${activity.title}-${i}`} {...activity} />
                                    ))}
                                    {data.recentActivity.lockedCount > 0 && (
                                        <LockedActivityRow count={data.recentActivity.lockedCount} />
                                    )}
                                </div>
                            )}
                        </div>
                        <StreakCard
                            streakDays={data.streak.streakDays}
                            message={data.streak.message}
                            days={data.streak.days}
                        />
                        {referralCardProps && <ReferralCard {...referralCardProps} />}
                    </section>
                </div>
            </div>
        </div>
    );
}