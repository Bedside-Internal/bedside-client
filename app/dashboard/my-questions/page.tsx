import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChevronLeft, GraduationCap, School } from "lucide-react";
import { TopBar } from "@/components/dashboard/Topbar";
import { getMyQuestions, getUsageSummary, getMyPrivateQuestions, getQuestionFormats } from "@/lib/api/userQuestions";
import { getOnboardingProgress } from "@/lib/actions";
import { getDashboardData } from "@/app/dashboard/page";
import { ApiError } from "@/lib/api/server-fetch";
import { MyQuestionsClient } from "@/components/dashboard/MyQuestionsClient";
import NextLink from "next/link";

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

interface MyQuestionsPageProps {
    searchParams: Promise<{ format?: string }>;
}

async function getTrackData(): Promise<DashboardData> {
    const progress = await getOnboardingProgress();
    if (!progress?.track) {
        redirect("/onboarding");
    }
    return getDashboardData(progress.track);
}

export default async function MyQuestionsPage({ searchParams }: MyQuestionsPageProps) {
    const progress = await getOnboardingProgress();
    if (!progress?.track || !progress?.format) {
        redirect("/onboarding");
    }

    let user;
    let questions;
    let usage;
    let privateQuestions;
    let formatOptions;
    try {
        [user, questions, usage, privateQuestions, formatOptions] = await Promise.all([
            currentUser(),
            getMyQuestions(),
            getUsageSummary(),
            getMyPrivateQuestions(),
            getQuestionFormats(),
        ]);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            redirect("/onboarding");
        }
        throw err;
    }

    const trackData = await getTrackData();
    const userTier = (user?.publicMetadata?.tier as "free" | "paid" | "admin") ?? "free";

    const { format: requestedFormat } = await searchParams;
    const initialFormatSlug =
        requestedFormat && formatOptions.some((f) => f.slug === requestedFormat)
            ? requestedFormat
            : (formatOptions[0]?.slug ?? "mmi");

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <TopBar
                tracks={[
                    { id: "med-school", label: "Medical School", icon: <GraduationCap /> },
                    { id: "college-admissions", label: "College Admissions", icon: <School /> },
                ]}
                activeTrackId={trackData.track.slug}
            />

            <div className="max-w-7xl px-8 py-8">
                <NextLink
                    href="/dashboard"
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-[var(--color-ink)]"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to dashboard
                </NextLink>

                <div className="mb-6">
                    <h1 className="font-poppins text-xl font-bold text-[var(--color-ink)]">My Questions</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Submit practice questions for admin review. Approved questions become available to other applicants.
                    </p>
                </div>

                <MyQuestionsClient
                    initialQuestions={questions}
                    formats={formatOptions}
                    initialFormatSlug={initialFormatSlug}
                    userTier={userTier}
                    usage={usage}
                    privateQuestions={privateQuestions}
                />
            </div>
        </div>
    );
}