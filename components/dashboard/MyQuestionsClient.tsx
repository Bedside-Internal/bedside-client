"use client";

import { useState } from "react";
import { useMyQuestions } from "@/hooks/useMyQuestions";
import { FileText, Share2, AlertCircle } from "lucide-react";

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

interface UserSubmittedQuestion {
    id: string;
    formatId: string | null;
    formatTitle: string | null;
    categoryText: string;
    questionText: string;
    visibility: "private" | "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

interface CreateUserQuestionInput {
    formatId: string | null;
    categoryText: string;
    questionText: string;
    shareWithApplicants: boolean;
}

interface Format {
    iconKey: string;
    title: string;
    subtitle: string;
    score: number;
    metrics: Array<{ label: string; value: number; tone?: "mint" | "amber" | "coral" | "slate" }>;
    progressLabel: string;
    continueHref: string;
}

function StatusBadge({ visibility }: { visibility: UserSubmittedQuestion["visibility"] }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${VISIBILITY_STYLES[visibility]}`}>
            {VISIBILITY_LABELS[visibility]}
        </span>
    );
}

export function MyQuestionsClient({
    initialQuestions,
    formats,
    userTier,
}: {
    initialQuestions: UserSubmittedQuestion[];
    formats: Format[];
    userTier: "free" | "paid" | "admin";
}) {
    const { items, loading, error, submitting, clearError, create, refetch } = useMyQuestions();

    // Use initial questions from server, then switch to hook state after mount
    const [questions, setQuestions] = useState<UserSubmittedQuestion[]>(initialQuestions);
    const [useHookData, setUseHookData] = useState(false);

    // Sync hook data after initial render
    useEffect(() => {
        setUseHookData(true);
        setQuestions(items);
    }, [items]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const input: CreateUserQuestionInput = {
            formatId: formData.get("formatId") as string || null,
            categoryText: formData.get("categoryText") as string,
            questionText: formData.get("questionText") as string,
            shareWithApplicants: formData.get("shareWithApplicants") === "true",
        };

        try {
            await create(input);
            e.currentTarget.reset();
        } catch {
            // Error handled by hook
        }
    };

    const displayQuestions = useHookData ? questions : initialQuestions;

    return (
        <div>
            {error && (
                <div className="mb-4 flex items-center justify-between rounded-md bg-coral/10 px-4 py-2.5 text-sm text-coral">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-coral/60 hover:text-coral">×</button>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm"
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
                            disabled={submitting}
                            className="w-full resize-none rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-slate-400 outline-none focus:border-mint focus:ring-1 focus:ring-mint disabled:bg-sand/40"
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
                            disabled={submitting}
                            className="w-full rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-mint focus:ring-1 focus:ring-mint disabled:bg-sand/40"
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
                            disabled={submitting}
                            className="w-full rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-mint focus:ring-1 focus:ring-mint disabled:bg-sand/40"
                            placeholder="e.g., Ethical dilemma, Role play, Communication"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                name="shareWithApplicants"
                                type="checkbox"
                                value="true"
                                disabled={userTier === "free" || submitting}
                                className="h-4 w-4 rounded border-[var(--color-sand)] text-mint focus:ring-mint disabled:bg-sand/40"
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
                        disabled={submitting}
                        className="w-full rounded-md bg-mint px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mint/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            "Submit Question"
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <h2 className="mb-4 font-poppins text-lg font-semibold text-[var(--color-ink)]">Your Submissions</h2>
                {displayQuestions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[var(--color-sand)] bg-white/60 px-6 py-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-300" />
                        <p className="mt-4 text-lg font-medium text-[var(--color-ink)]">No questions submitted yet</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Submit your first practice question above to see it here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayQuestions.map((q) => (
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
                )}
            </div>
        </div>
    );
}