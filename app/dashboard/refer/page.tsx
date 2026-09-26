import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TopBar } from "@/components/dashboard/Topbar";
import { ReferralCard } from "@/components/dashboard/ReferralCard";
import { getOnboardingProgress } from "@/lib/actions";
import { getReferralSummary, getUnlockProgress } from "@/lib/api/referrals";
import { getLandingPageData } from "@/lib/api/marketing";
import { computeTierUnlockStatus } from "@/lib/referrals/tierUnlockStatus";
import { getFeatures, PublicFeature } from "@/lib/features";
import { createElement } from "react";
import { resolveIcon } from "@/lib/iconRegistry";


export default async function ReferPage() {
    const progress = await getOnboardingProgress();
    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    let trackFeatures: PublicFeature[] = [];
    try {
        trackFeatures = await getFeatures("track");
    } catch {

    }

    const tracks = trackFeatures.map((t) => ({
        id: t.key,
        label: t.title,
        icon: createElement(resolveIcon(t.icon)),
    }));

    const [summary, unlockProgress, landing] = await Promise.all([
        getReferralSummary(),
        getUnlockProgress(),
        getLandingPageData(),
    ]);

    const tiers = computeTierUnlockStatus(
        landing.pricingTiers.map((t) => ({ id: t.id, title: t.title, requirements: t.requirements })),
        unlockProgress,
    );

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <TopBar tracks={tracks} activeTrackId={progress.track} />

            <div className="mx-auto max-w-[1600px] px-10 py-8">
                <Link
                    href="/dashboard"
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-[var(--color-ink)]"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to dashboard
                </Link>

                <div className="max-w-xl">
                    <ReferralCard shareUrl={summary.shareUrl} activatedCount={summary.activatedCount} tiers={tiers} />
                </div>
            </div>
        </div>
    );
}