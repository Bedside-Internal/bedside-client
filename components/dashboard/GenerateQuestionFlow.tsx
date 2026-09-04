"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestionGeneration } from "@/hooks/useQuestionGeneration";
import type { ScoringDimension } from "@/lib/api/userQuestions";

type Step = "topic" | "review";

interface GenerateQuestionFlowProps {
    embedded?: boolean;
}

export function GenerateQuestionFlow({ embedded = false }: GenerateQuestionFlowProps) {
    const router = useRouter();
    const {
        sections,
        sectionsLoading,
        draft,
        generating,
        confirming,
        error,
        generate,
        confirm,
        clearDraft,
        clearError,
    } = useQuestionGeneration();

    const [step, setStep] = useState<Step>("topic");
    const [sectionId, setSectionId] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [topic, setTopic] = useState("");

    // Editable draft fields, seeded from the generated draft once it arrives
    const [scenarioText, setScenarioText] = useState("");
    const [guidanceNote, setGuidanceNote] = useState("");
    const [modelAnswer, setModelAnswer] = useState("");
    const [dimensions, setDimensions] = useState<ScoringDimension[]>([]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            const result = await generate({ sectionId, difficulty, topic });
            setScenarioText(result.draft.scenario_text);
            setGuidanceNote(result.draft.guidance_note);
            setModelAnswer(result.draft.model_answer);
            setDimensions(result.draft.scoring_rubric.dimensions);
            setStep("review");
        } catch {
            // error already surfaced via the hook's `error` state
        }
    };

    const handleConfirm = async () => {
        if (!draft) return;
        clearError();
        try {
            await confirm({
                sectionId: draft.sectionId,
                difficulty: draft.difficulty,
                scenarioText,
                guidanceNote,
                modelAnswer,
                scoringRubric: { dimensions },
            });
            clearDraft();
            setStep("topic");
            setSectionId("");
            setTopic("");
            router.refresh(); // re-runs the server page's data fetch, no full reload
        } catch {
            // error already surfaced via the hook's `error` state
        }
    };

    const handleBack = () => {
        clearDraft();
        clearError();
        setStep("topic");
    };

    const updateDimension = (index: number, field: "label" | "weight", value: string) => {
        setDimensions((prev) =>
            prev.map((d, i) =>
                i === index ? { ...d, [field]: field === "weight" ? Number(value) : value } : d,
            ),
        );
    };

    const removeDimension = (index: number) => {
        setDimensions((prev) => prev.filter((_, i) => i !== index));
    };

    const addDimension = () => {
        setDimensions((prev) => [...prev, { label: "", weight: 1 }]);
    };

    const content = (
        <>
            {error && (
                <div className="mt-3 rounded-lg border border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5 px-3 py-2 text-sm text-[var(--color-coral)]">
                    {error}
                </div>
            )}

            {step === "topic" && (
                <form onSubmit={handleGenerate} className="mt-4 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Section</label>
                        <select
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}
                            disabled={sectionsLoading}
                            required
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        >
                            <option value="">Select a section…</option>
                            {sections.map((s) => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">
                            What do you want to practice?
                        </label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            minLength={20}
                            maxLength={2000}
                            required
                            rows={4}
                            placeholder="Describe the scenario or concept you want a question generated about…"
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        />
                        <span className="text-xs text-[var(--color-ink)]/40">{topic.length}/2000</span>
                    </div>

                    <button
                        type="submit"
                        disabled={generating || !sectionId || topic.trim().length < 20}
                        className="rounded-lg bg-[var(--color-mint)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {generating ? "Generating…" : "Generate"}
                    </button>
                </form>
            )}

            {step === "review" && draft && (
                <div className="mt-4 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Scenario</label>
                        <textarea
                            value={scenarioText}
                            onChange={(e) => setScenarioText(e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Guidance Note</label>
                        <textarea
                            value={guidanceNote}
                            onChange={(e) => setGuidanceNote(e.target.value)}
                            rows={2}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">
                            Model Answer{" "}
                            <span className="text-xs font-normal text-[var(--color-ink)]/40">
                                (used for scoring, not shown when you practice)
                            </span>
                        </label>
                        <textarea
                            value={modelAnswer}
                            onChange={(e) => setModelAnswer(e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Scoring Rubric</label>
                        <div className="mt-2 flex flex-col gap-2">
                            {dimensions.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input
                                        value={d.label}
                                        onChange={(e) => updateDimension(i, "label", e.target.value)}
                                        placeholder="Dimension label"
                                        className="flex-1 rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-sm"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        step={0.5}
                                        value={d.weight}
                                        onChange={(e) => updateDimension(i, "weight", e.target.value)}
                                        className="w-20 rounded-lg border border-[var(--color-sand)] px-2 py-1.5 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDimension(i)}
                                        className="text-xs text-[var(--color-coral)] hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDimension}
                                className="mt-1 rounded-lg border border-dashed border-[var(--color-ink)]/15 py-1.5 text-xs text-[var(--color-mint)] hover:border-[var(--color-mint)]"
                            >
                                + Add dimension
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="rounded-lg border border-[var(--color-sand)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-sand)]"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={confirming || dimensions.length === 0}
                            className="flex-1 rounded-lg bg-[var(--color-mint)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {confirming ? "Saving…" : "Save Private Question"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    if (embedded) {
        return <div className="mt-4">{content}</div>;
    }

    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
            <h2 className="font-poppins text-sm font-bold uppercase tracking-wide text-[var(--color-ink)]/60">
                Generate a Private Question
            </h2>
            {content}
        </div>
    );
}