import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, GraduationCap, School } from "lucide-react";
import { TopBar } from "@/components/dashboard/Topbar";
import { ReferralCard } from "@/components/dashboard/ReferralCard";
import { getOnboardingProgress } from "@/lib/actions";
import { getReferralSummary, getUnlockProgress } from "@/lib/api/referrals";
import { getPricingTiers } from "@/lib/api/marketing";
import { computeTierUnlockStatus } from "@/lib/referrals/tierUnlockStatus";

const tracks = [
    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
    { id: "college-admissions", label: "College Admissions", icon: <School /> },
];

export default async function ReferPage() {
    const progress = await getOnboardingProgress();
    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    const [summary, unlockProgress, pricingTiers] = await Promise.all([
        getReferralSummary(),
        getUnlockProgress(),
        getPricingTiers(),
    ]);

    const tiers = computeTierUnlockStatus(
        pricingTiers.map((t) => ({ id: t.id, title: t.title, requirements: t.requirements })),
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