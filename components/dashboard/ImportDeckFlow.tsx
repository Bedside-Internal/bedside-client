"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/Switch";
import { useDeckImport } from "@/hooks/useDeckImport";
import type { DeckCard } from "@/types/deckImport";

type Bucket = "prompt" | "knowledge" | "skip" | null;

interface EditableCard extends DeckCard {
    bucket: Bucket;
}

interface Format {
    id: string;
    slug: string;
    title: string;
}

interface ImportDeckFlowProps {
    formats: Format[];
    userTier: "free" | "paid" | "admin";
    onImported?: () => void;
}

export function ImportDeckFlow({ formats, userTier, onImported }: ImportDeckFlowProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formatId, setFormatId] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [cards, setCards] = useState<EditableCard[]>([]);
    const [shareWithApplicants, setShareWithApplicants] = useState(false);

    const { previewing, committing, error, clearError, result, previewDeck, commitDeck, reset } = useDeckImport(formatId || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        clearError();
        setFileName(file.name);
        try {
            const preview = await previewDeck(file);
            const all: EditableCard[] = [
                ...preview.promptCards.map((c) => ({ ...c, bucket: "prompt" as Bucket })),
                ...preview.knowledgeCards.map((c) => ({ ...c, bucket: "knowledge" as Bucket })),
                ...preview.needsReview.map((c) => ({ ...c, bucket: null as Bucket })),
            ];
            setCards(all);
        } catch {
            // error surfaced via hook
        }
    };

    const handleStartOver = () => {
        reset();
        setCards([]);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const setBucket = (index: number, bucket: Bucket) => {
        setCards((prev) => prev.map((c, i) => (i === index ? { ...c, bucket } : c)));
    };

    const updateField = (index: number, field: "front" | "back", value: string) => {
        setCards((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
    };

    const unresolvedCount = cards.filter((c) => c.bucket === null).length;
    const promptCount = cards.filter((c) => c.bucket === "prompt").length;
    const knowledgeCount = cards.filter((c) => c.bucket === "knowledge").length;
    const canImport = !previewing && !committing && cards.length > 0 && unresolvedCount === 0 && promptCount + knowledgeCount > 0;

    const handleImport = async () => {
        clearError();
        try {
            const promptCards = cards.filter((c) => c.bucket === "prompt").map(({ front, back, tags }) => ({ front, back, tags }));
            const knowledgeCards = cards.filter((c) => c.bucket === "knowledge").map(({ front, back, tags }) => ({ front, back, tags }));
            await commitDeck(promptCards, knowledgeCards, fileName ?? "deck-import", shareWithApplicants);
            onImported?.();
            router.refresh();
        } catch {
            // error surfaced via hook
        }
    };

    return (
        <div className="mt-4 flex flex-col gap-4">
            {error && (
                <div className="rounded-lg border border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5 px-3 py-2 text-sm text-[var(--color-coral)]">
                    {error}
                </div>
            )}

            {result ? (
                <div className="rounded-lg border border-[var(--color-sand)] bg-white p-4">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                        Imported {result.prompt.created.length} practice question{result.prompt.created.length === 1 ? "" : "s"}
                        {result.knowledge && ` and generated ${result.knowledge.synthesisCards.length} knowledge summary card${result.knowledge.synthesisCards.length === 1 ? "" : "s"}`}
                    </p>

                    {result.knowledge && result.knowledge.synthesisCards.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                            {result.knowledge.synthesisCards.map((s) => (
                                <div key={s.id} className="rounded-md border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/5 p-3">
                                    <p className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                                    <p className="mt-1 text-xs text-[var(--color-ink)]/70">{s.summaryText}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {result.prompt.skipped.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-coral)]">
                                {result.prompt.skipped.length} skipped
                            </p>
                            <ul className="mt-1.5 space-y-1 text-xs text-[var(--color-ink)]/60">
                                {result.prompt.skipped.map((s, i) => (
                                    <li key={i}>Row {s.rowIndex + 1}: {s.reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleStartOver}
                        className="mt-4 rounded-lg border border-[var(--color-sand)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-sand)]"
                    >
                        Import another deck
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Format</label>
                        <select
                            value={formatId}
                            onChange={(e) => setFormatId(e.target.value)}
                            disabled={previewing || committing || cards.length > 0}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm disabled:bg-sand/40"
                        >
                            <option value="">Optional</option>
                            {formats.map((f) => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Upload a Quizlet, Anki, or Knowt export</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.tsv,.txt,text/csv,text/plain"
                            onChange={handleFileChange}
                            disabled={previewing || committing}
                            className="mt-1 w-full rounded-lg border border-dashed border-[var(--color-sand)] px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-mint)]/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-mint-hover)] disabled:opacity-50"
                        />
                        {previewing && <p className="mt-1.5 text-xs text-slate-400">Reading deck…</p>}
                    </div>

                    {cards.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {unresolvedCount > 0 && (
                                <div className="rounded-lg border border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5 px-3 py-2 text-xs text-[var(--color-coral)]">
                                    {unresolvedCount} card{unresolvedCount === 1 ? "" : "s"} need{unresolvedCount === 1 ? "s" : ""} a bucket before you can import.
                                </div>
                            )}

                            <p className="text-xs text-slate-400">
                                {promptCount} practice prompt{promptCount === 1 ? "" : "s"} · {knowledgeCount} knowledge card{knowledgeCount === 1 ? "" : "s"} · {cards.filter((c) => c.bucket === "skip").length} skipped
                            </p>

                            <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
                                {cards.map((card, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-2 rounded-lg border p-3 ${card.bucket === null
                                            ? "border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5"
                                            : "border-[var(--color-sand)] bg-white"
                                            }`}
                                    >
                                        <div className="flex-1 flex flex-col gap-1.5">
                                            <textarea
                                                value={card.front}
                                                onChange={(e) => updateField(i, "front", e.target.value)}
                                                rows={1}
                                                className="w-full resize-none rounded-md border border-[var(--color-sand)] px-2 py-1 text-sm font-medium"
                                            />
                                            <textarea
                                                value={card.back}
                                                onChange={(e) => updateField(i, "back", e.target.value)}
                                                rows={1}
                                                className="w-full resize-none rounded-md border border-[var(--color-sand)] px-2 py-1 text-xs text-[var(--color-ink)]/70"
                                            />
                                        </div>
                                        <select
                                            value={card.bucket ?? ""}
                                            onChange={(e) => setBucket(i, (e.target.value || null) as Bucket)}
                                            className="w-40 shrink-0 rounded-md border border-[var(--color-sand)] px-2 py-1.5 text-xs"
                                        >
                                            <option value="">Choose…</option>
                                            <option value="prompt">Practice prompt</option>
                                            <option value="knowledge">Knowledge card</option>
                                            <option value="skip">Skip</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Switch
                                        checked={shareWithApplicants}
                                        onChange={() => setShareWithApplicants(!shareWithApplicants)}
                                        label="Share with other applicants"
                                        disabled={userTier === "free" || committing}
                                    />
                                    <span className="text-sm text-[var(--color-ink)]">Share practice prompts with other applicants</span>
                                </label>
                                {userTier === "free" && (
                                    <span className="ml-2 rounded-full bg-[var(--color-ink)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-coral brightness-125">
                                        Paid feature
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleImport}
                                disabled={!canImport}
                                className="rounded-lg bg-[var(--color-mint)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {committing ? "Importing…" : `Import ${promptCount + knowledgeCount} card${promptCount + knowledgeCount === 1 ? "" : "s"}`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}