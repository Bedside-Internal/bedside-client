"use client";

import { useState, useEffect } from "react";
import { useMyQuestions } from "@/hooks/useMyQuestions";
import { FileText, Lock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Switch } from "@/components/ui/Switch";
import { clientValidateQuestion } from "@/lib/content-safety";
import { GenerateQuestionFlow } from "@/components/dashboard/GenerateQuestionFlow";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import type { UsageSummary } from "@/lib/api/userQuestions";

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

type ComposerTab = "submit" | "generate";

export function MyQuestionsClient({
    initialQuestions,
    formats,
    userTier,
    usage,
}: {
    initialQuestions: UserSubmittedQuestion[];
    formats: Format[];
    userTier: "free" | "paid" | "admin";
    usage: UsageSummary;
}) {
    const { items, loading, error, submitting, clearError, create, refetch } = useMyQuestions();

    const [questions, setQuestions] = useState<UserSubmittedQuestion[]>(initialQuestions);
    const [useHookData, setUseHookData] = useState(false);
    const [shareWithApplicants, setShareWithApplicants] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [tab, setTab] = useState<ComposerTab>("submit");

    useEffect(() => {
        setUseHookData(true);
        setQuestions(items);
    }, [items]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const questionText = formData.get("questionText") as string;
        const categoryText = formData.get("categoryText") as string;

        const validation = clientValidateQuestion(questionText, categoryText);
        if (!validation.valid) {
            setClientError(validation.reason ?? "Invalid submission");
            return;
        }
        setClientError(null);

        const input: CreateUserQuestionInput = {
            formatId: formData.get("formatId") as string || null,
            categoryText,
            questionText,
            shareWithApplicants,
        };

        try {
            await create(input);
            e.currentTarget.reset();
            setShareWithApplicants(false);
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
            {clientError && (
                <div className="mb-4 flex items-center justify-between rounded-md bg-coral/10 px-4 py-2.5 text-sm text-coral">
                    <span>{clientError}</span>
                    <button onClick={() => setClientError(null)} className="text-coral/60 hover:text-coral">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,540px)_1fr] lg:items-start">
                {/* Left column — usage + composer, sticky on large screens so it stays visible while the right list scrolls */}
                <div className="flex flex-col gap-6">
                    <UsageMeter usage={usage} userTier={userTier} />

                    <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-1 border-b border-[var(--color-sand)]">
                            {([
                                { key: "submit" as const, label: "Submit for Review" },
                                { key: "generate" as const, label: "Generate with AI" },
                            ]).map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setTab(t.key)}
                                    className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-sm font-medium transition-colors ${tab === t.key
                                        ? "border-mint text-[var(--color-ink)]"
                                        : "border-transparent text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70"
                                        }`}
                                >
                                    {t.label}
                                    {t.key === "generate" && userTier === "free" && (
                                        <Lock className="h-3 w-3" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {tab === "submit" && (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label htmlFor="questionText" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
                                        Question text
                                    </label>
                                    <textarea
                                        id="questionText"
                                        name="questionText"
                                        rows={3}
                                        required
                                        minLength={20}
                                        maxLength={2000}
                                        disabled={submitting}
                                        className="w-full resize-none rounded-md border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-slate-400 outline-none focus:border-mint focus:ring-1 focus:ring-mint disabled:bg-sand/40"
                                        placeholder="Describe the scenario or question you'd like to practice..."
                                    />
                                    <p className="mt-1 text-xs text-slate-400">20–2000 characters</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
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
                                            <option value="">Optional</option>
                                            {formats.map((f) => (
                                                <option key={f.title} value={f.iconKey}>
                                                    {f.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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

                                <div className="flex items-center justify-between gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <Switch
                                            checked={shareWithApplicants}
                                            onChange={() => setShareWithApplicants(!shareWithApplicants)}
                                            label="Share with other applicants"
                                            disabled={userTier === "free" || submitting}
                                        />
                                        <span className="text-sm text-[var(--color-ink)]">
                                            Share with other applicants (visible after admin approval)
                                        </span>
                                    </label>
                                    {userTier === "free" && (
                                        <span className="ml-2 rounded-full bg-[var(--color-ink)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-coral brightness-125">
                                            Paid feature
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-md bg-mint px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mint/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Submitting..." : "Submit Question"}
                                </button>
                            </form>
                        )}

                        {tab === "generate" && (
                            userTier === "free" ? (
                                <div className="mt-4 rounded-lg border border-dashed border-[var(--color-sand)] bg-[var(--color-sand)]/30 px-5 py-8 text-center">
                                    <Lock className="mx-auto h-8 w-8 text-slate-300" />
                                    <p className="mt-3 font-medium text-[var(--color-ink)]">
                                        Generate your own AI-powered questions
                                    </p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Upgrade to instantly generate a fully-scored practice question — no admin review needed.
                                    </p>
                                </div>
                            ) : (
                                <GenerateQuestionFlow embedded />
                            )
                        )}
                    </div>
                </div>

                {/* Right column — submissions list, scrolls independently on large screens */}
                <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto">
                    <h2 className="mb-4 font-poppins text-lg font-semibold text-[var(--color-ink)]">Your Questions</h2>
                    {displayQuestions.length === 0 ? (
                        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-sand)] bg-white/60 px-6 py-8 text-center">
                            <FileText className="mx-auto h-8 w-8 text-slate-300" />
                            <p className="mt-3 text-base font-medium text-[var(--color-ink)]">No questions submitted yet</p>
                            <p className="mt-1 text-sm text-slate-400">
                                Submit your first practice question to see it here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayQuestions.map((q) => (
                                <div key={q.id} className="rounded-xl border border-[var(--color-sand)] bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                {q.formatTitle && (
                                                    <span className="font-medium text-[var(--color-ink)]">{q.formatTitle}</span>
                                                )}
                                                <span className="text-sand">·</span>
                                                <span className="font-medium text-[var(--color-ink)]">{q.categoryText}</span>
                                                <StatusBadge status={q.visibility} />
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
        </div>
    );
}