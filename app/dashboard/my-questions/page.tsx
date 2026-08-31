import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GraduationCap, School } from "lucide-react";
import { TopBar } from "@/components/dashboard/Topbar";
import { getMyQuestions } from "@/lib/api/userQuestions";
import { getOnboardingProgress } from "@/lib/actions";
import { getDashboardData } from "@/app/dashboard/page";
import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";
import { MyQuestionsClient } from "@/components/dashboard/MyQuestionsClient";

interface DashboardData {
    track: { id: string; slug: string; label: string };
    formats: Array<{
        iconKey: string;
        title: string;
        subtitle: string;
        score: number;
        metrics: Array<{ label: string; value: number; tone?: "mint" | "amber" | "coral" | "slate" }>;
        progressLabel: string;
        continueHref: string;
    }>;
}

async function getTrackData(): Promise<DashboardData> {
    const progress = await getOnboardingProgress();
    if (!progress?.track) {
        redirect("/onboarding");
    }
    return getDashboardData(progress.track);
}

export default async function MyQuestionsPage() {
    const progress = await getOnboardingProgress();
    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    let user;
    let questions;
    try {
        [user, questions] = await Promise.all([
            currentUser(),
            getMyQuestions(),
        ]);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            redirect("/onboarding");
        }
        throw err;
    }

    const trackData = await getTrackData();
    const userTier = (user?.publicMetadata?.tier as "free" | "paid" | "admin") ?? "free";

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <TopBar
                tracks={[
                    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
                    { id: "college-admissions", label: "College Admissions", icon: <School /> },
                ]}
                activeTrackId={trackData.track.slug}
            />

            <div className="mx-auto max-w-3xl px-6 py-8">
                <div className="mb-8">
                    <h1 className="font-poppins text-2xl font-bold text-[var(--color-ink)]">My Questions</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Submit practice questions for admin review. Approved questions become available to other applicants.
                    </p>
                </div>

                <MyQuestionsClient
                    initialQuestions={questions}
                    formats={trackData.formats}
                    userTier={userTier}
                />
            </div>
        </div>
    );
}