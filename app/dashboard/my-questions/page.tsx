import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileText, Share2, Loader2, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/dashboard/Topbar";
import { getMyQuestions, createUserQuestion, UserQuestionsApiError } from "@/lib/api/userQuestions";
import { getOnboardingProgress } from "@/lib/actions";
import { getDashboardData } from "@/app/dashboard/page";
import { serverApiFetch, ApiError } from "@/lib/api/server-fetch";

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

const VISIBILITY_STYLES: Record<UserSubmittedQuestion["visibility"], string> = {
    private: "text-sand bg-sand/20",
    pending: "text-amber bg-amber/20",
    approved: "text-mint bg-mint/20",
    rejected: "text-coral bg-coral/20",
};

const VISIBILITY_LABELS: Record<UserSubmittedQuestion["visibility"], string> = {
    private: "Private",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
};

function StatusBadge({ visibility }: { visibility: UserSubmittedQuestion["visibility"] }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${VISIBILITY_STYLES[visibility]}`}>
            {VISIBILITY_LABELS[visibility]}
        </span>
    );
}

function QuestionForm({
    formats,
    userTier,
}: {
    formats: DashboardData["formats"];
    userTier: "free" | "paid" | "admin";
}) {
    return (
        <form
            className="space-y-4 rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm"
            action="/api/questions/mine"
            method="POST"
        >
            <div className="flex items-center justify-between">
                <h2 className="font-poppins text-lg font-semibold text-[var(--color-ink)]">
                    Share a practice question
                </h2>
                <span className="text-[11px] font-medium uppercase tracking-wide text-mint">
                    Paid feature: share with others
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="questionText" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                        Question text
                    </label>
                    <textarea
                        id="questionText"
                        name="questionText"
                        rows={4}
                        required
                        minLength={20}
                        maxLength={2000}
                        className="w-full resize-none rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-slate-400 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                        placeholder="Describe the scenario or question you'd like to practice..."
                    />
                    <p className="mt-1 text-xs text-slate-400">20–2000 characters</p>
                </div>

                <div>
                    <label htmlFor="formatId" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                        Format
                    </label>
                    <select
                        id="formatId"
                        name="formatId"
                        className="w-full rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                    >
                        <option value="">Select a format (optional)</option>
                        {formats.map((f) => (
                            <option key={f.title} value={f.iconKey}>
                                {f.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="categoryText" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                        Category
                    </label>
                    <input
                        id="categoryText"
                        name="categoryText"
                        type="text"
                        required
                        maxLength={120}
                        className="w-full rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                        placeholder="e.g., Ethical dilemma, Role play, Communication"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            name="shareWithApplicants"
                            type="checkbox"
                            value="true"
                            disabled={userTier === "free"}
                            className="h-4 w-4 rounded border-[var(--color-sand)] text-mint focus:ring-mint"
                        />
                        <span className="text-sm text-[var(--color-ink)]">
                            Share with other applicants (visible after admin approval)
                        </span>
                    </label>
                    {userTier === "free" && (
                        <span className="ml-2 text-[11px] font-medium uppercase tracking-wide text-coral">
                            PAID FEATURE
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-mint px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mint/90"
                >
                    Submit Question
                </button>
            </div>
        </form>
    );
}

function QuestionsList({ questions }: { questions: UserSubmittedQuestion[] }) {
    if (questions.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-white/60 px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-lg font-medium text-[var(--color-ink)]">No questions submitted yet</p>
                <p className="mt-1 text-sm text-slate-400">
                    Submit your first practice question above to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {questions.map((q) => (
                <div
                    key={q.id}
                    className="rounded-xl border border-[var(--color-sand)] bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {q.formatTitle && (
                                    <span className="font-medium text-[var(--color-ink)]">{q.formatTitle}</span>
                                )}
                                <span className="text-sand">·</span>
                                <span className="font-medium text-[var(--color-ink)]">{q.categoryText}</span>
                                <StatusBadge visibility={q.visibility} />
                            </div>
                            <p className="mt-2 text-[var(--color-ink)]">{q.questionText}</p>
                            <p className="mt-2 text-xs text-slate-400">
                                Submitted {new Date(q.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
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
                    { id: "med-school", label: "Medical School" },
                    { id: "college-admissions", label: "College Admissions" },
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

                <QuestionForm formats={trackData.formats} userTier={userTier} />
                <div className="mt-8">
                    <h2 className="mb-4 font-poppins text-lg font-semibold text-[var(--color-ink)]">Your Submissions</h2>
                    <QuestionsList questions={questions} />
                </div>
            </div>
        </div>
    );
}