"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/Switch";
import { useQuestionImport } from "@/hooks/useQuestionImport";
import type { ColumnMapping, ColumnRole } from "@/types/questionImport";

interface Format {
    id: string;
    slug: string;
    title: string;
}

interface ImportQuestionsFlowProps {
    formats: Format[];
    userTier: "free" | "paid" | "admin";
    onImported?: () => void;
}

const ROLE_OPTIONS: { value: ColumnRole | ""; label: string }[] = [
    { value: "", label: "Not used" },
    { value: "question_text", label: "Question text" },
    { value: "category", label: "Category" },
    { value: "difficulty", label: "Difficulty" },
];
const ALL_ROLES: ColumnRole[] = ["question_text", "category", "difficulty"];
const REQUIRED_ROLES: ColumnRole[] = ["question_text"];
const DISPLAY_ROW_CAP = 20; // full rows still held in state and sent at commit — this only caps what's rendered

function columnRoleFor(mapping: ColumnMapping, columnIndex: number): ColumnRole | null {
    return mapping.assignments.find((a) => a.columnIndex === columnIndex)?.role ?? null;
}

/** Rebuilds a fully consistent ColumnMapping after a manual dropdown edit —
 * recomputing unassignedRequiredRoles here, not just the touched assignment,
 * is what keeps the object the server receives internally consistent (it
 * relies on that field to decide whether question_text is mapped at all). */
function setColumnRole(mapping: ColumnMapping, columnIndex: number, role: ColumnRole | "", headers: string[]): ColumnMapping {
    const assignments = ALL_ROLES.map((r) => {
        const existing = mapping.assignments.find((a) => a.role === r);
        if (r === role) {
            return { role: r, columnIndex, columnHeader: headers[columnIndex] ?? null, confidence: 1, needsReview: false };
        }
        if (existing?.columnIndex === columnIndex) {
            return { role: r, columnIndex: null, columnHeader: null, confidence: 0, needsReview: r === "question_text" };
        }
        return existing ?? { role: r, columnIndex: null, columnHeader: null, confidence: 0, needsReview: r === "question_text" };
    });
    const unassignedRequiredRoles = REQUIRED_ROLES.filter(
        (r) => assignments.find((a) => a.role === r)?.columnIndex == null,
    );
    return { assignments, unassignedRequiredRoles };
}

export function ImportQuestionsFlow({ formats, userTier, onImported }: ImportQuestionsFlowProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formatId, setFormatId] = useState("");
    const [fileKind, setFileKind] = useState<"csv" | "pdf" | null>(null);
    const [shareWithApplicants, setShareWithApplicants] = useState(false);

    // PDF-specific per-block approval/edit state, keyed by index within each list.
    const [confidentApproved, setConfidentApproved] = useState<Record<number, boolean>>({});
    const [confidentTexts, setConfidentTexts] = useState<Record<number, string>>({});
    const [needsReviewApproved, setNeedsReviewApproved] = useState<Record<number, boolean>>({});
    const [needsReviewTexts, setNeedsReviewTexts] = useState<Record<number, string>>({});

    const {
        previewing,
        committing,
        error,
        clearError,
        csvPreview,
        mapping,
        setMapping,
        pdfPreview,
        result,
        previewCsv,
        previewPdf,
        commitCsv,
        commitPdf,
        reset,
    } = useQuestionImport(formatId || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        clearError();
        setConfidentApproved({});
        setConfidentTexts({});
        setNeedsReviewApproved({});
        setNeedsReviewTexts({});

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        try {
            if (isPdf) {
                setFileKind("pdf");
                await previewPdf(file);
            } else {
                setFileKind("csv");
                await previewCsv(file);
            }
        } catch {
            // error already surfaced via the hook's `error` state
        }
    };

    const handleStartOver = () => {
        reset();
        setFileKind(null);
        setConfidentApproved({});
        setConfidentTexts({});
        setNeedsReviewApproved({});
        setNeedsReviewTexts({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const isQuestionTextMapped = mapping?.assignments.some((a) => a.role === "question_text" && a.columnIndex != null) ?? false;

    const approvedPdfCount =
        (pdfPreview?.confident.filter((_, i) => confidentApproved[i] ?? true).length ?? 0) +
        (pdfPreview?.needsReview.filter((_, i) => needsReviewApproved[i] ?? false).length ?? 0);

    const canImport =
        !previewing &&
        !committing &&
        ((fileKind === "csv" && !!csvPreview && !!mapping && isQuestionTextMapped) ||
            (fileKind === "pdf" && !!pdfPreview && approvedPdfCount > 0));

    const handleImport = async () => {
        clearError();
        try {
            if (fileKind === "csv" && csvPreview) {
                await commitCsv(csvPreview.rows, shareWithApplicants);
            } else if (fileKind === "pdf" && pdfPreview) {
                const texts = [
                    ...pdfPreview.confident
                        .map((b, i) => (confidentApproved[i] ?? true ? (confidentTexts[i] ?? b.text) : null))
                        .filter((t): t is string => t !== null),
                    ...pdfPreview.needsReview
                        .map((b, i) => (needsReviewApproved[i] ?? false ? (needsReviewTexts[i] ?? b.text) : null))
                        .filter((t): t is string => t !== null),
                ];
                await commitPdf(texts, shareWithApplicants);
            }
            onImported?.();
            router.refresh();
        } catch {
            // error already surfaced via the hook's `error` state
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
                        Imported {result.created.length} question{result.created.length === 1 ? "" : "s"}
                    </p>
                    {result.skipped.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-coral)]">
                                {result.skipped.length} row{result.skipped.length === 1 ? "" : "s"} skipped
                            </p>
                            <ul className="mt-1.5 space-y-1 text-xs text-[var(--color-ink)]/60">
                                {result.skipped.map((s, i) => (
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
                        Import another file
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Format</label>
                        <select
                            value={formatId}
                            onChange={(e) => setFormatId(e.target.value)}
                            disabled={previewing || committing || !!csvPreview || !!pdfPreview}
                            className="mt-1 w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-sm disabled:bg-sand/40"
                        >
                            <option value="">Optional</option>
                            {formats.map((f) => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--color-ink)]">Upload a CSV or PDF</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.pdf,text/csv,application/pdf"
                            onChange={handleFileChange}
                            disabled={previewing || committing}
                            className="mt-1 w-full rounded-lg border border-dashed border-[var(--color-sand)] px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-mint)]/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-mint-hover)] disabled:opacity-50"
                        />
                        {previewing && <p className="mt-1.5 text-xs text-slate-400">Reading file…</p>}
                    </div>

                    {fileKind === "csv" && csvPreview && mapping && (
                        <div className="flex flex-col gap-2">
                            {csvPreview.warnings.length > 0 && (
                                <div className="rounded-lg border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 px-3 py-2 text-xs text-[var(--color-amber)]">
                                    {csvPreview.warnings.map((w, i) => <p key={i}>{w}</p>)}
                                </div>
                            )}
                            {!isQuestionTextMapped && (
                                <div className="rounded-lg border border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5 px-3 py-2 text-xs text-[var(--color-coral)]">
                                    Pick which column has the question text before importing.
                                </div>
                            )}
                            <div className="overflow-x-auto rounded-lg border border-[var(--color-sand)]">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-sand)] bg-[var(--color-sand)]/30">
                                            {csvPreview.headers.map((header, colIndex) => {
                                                const role = columnRoleFor(mapping, colIndex);
                                                const assignment = role ? mapping.assignments.find((a) => a.role === role) : null;
                                                return (
                                                    <th key={colIndex} className="min-w-[180px] px-3 py-2 align-top font-normal">
                                                        <div className="mb-1 truncate text-xs font-semibold text-[var(--color-ink)]/50">{header}</div>
                                                        <select
                                                            value={role ?? ""}
                                                            onChange={(e) =>
                                                                setMapping(setColumnRole(mapping, colIndex, e.target.value as ColumnRole | "", csvPreview.headers))
                                                            }
                                                            className="w-full rounded-md border border-[var(--color-sand)] bg-white px-2 py-1 text-xs"
                                                        >
                                                            {ROLE_OPTIONS.map((o) => (
                                                                <option key={o.value} value={o.value}>{o.label}</option>
                                                            ))}
                                                        </select>
                                                        {assignment && assignment.columnIndex != null && (
                                                            <span
                                                                className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${assignment.needsReview
                                                                    ? "bg-[var(--color-amber)]/20 text-[var(--color-amber)]"
                                                                    : "bg-[var(--color-mint)]/20 text-[var(--color-mint-hover)]"
                                                                    }`}
                                                            >
                                                                {Math.round(assignment.confidence * 100)}% confident
                                                            </span>
                                                        )}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvPreview.rows.slice(0, DISPLAY_ROW_CAP).map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b border-[var(--color-sand)]/60 last:border-0">
                                                {row.map((cell, colIndex) => (
                                                    <td key={colIndex} className="max-w-[220px] truncate px-3 py-2 text-[var(--color-ink)]/80">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {csvPreview.rows.length > DISPLAY_ROW_CAP && (
                                    <div className="border-t border-[var(--color-sand)] px-3 py-2 text-xs text-slate-400">
                                        +{csvPreview.rows.length - DISPLAY_ROW_CAP} more row{csvPreview.rows.length - DISPLAY_ROW_CAP === 1 ? "" : "s"} will be imported
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {fileKind === "pdf" && pdfPreview && (
                        <div className="flex flex-col gap-4">
                            {pdfPreview.warnings.length > 0 && (
                                <div className="rounded-lg border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 px-3 py-2 text-xs text-[var(--color-amber)]">
                                    {pdfPreview.warnings.map((w, i) => <p key={i}>{w}</p>)}
                                </div>
                            )}

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
                                    Ready to import ({pdfPreview.confident.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {pdfPreview.confident.map((block, i) => (
                                        <div key={`c-${i}`} className="flex items-start gap-2 rounded-lg border border-[var(--color-sand)] bg-white p-3">
                                            <input
                                                type="checkbox"
                                                checked={confidentApproved[i] ?? true}
                                                onChange={(e) => setConfidentApproved((prev) => ({ ...prev, [i]: e.target.checked }))}
                                                className="mt-1.5"
                                            />
                                            <textarea
                                                value={confidentTexts[i] ?? block.text}
                                                onChange={(e) => setConfidentTexts((prev) => ({ ...prev, [i]: e.target.value }))}
                                                rows={2}
                                                className="flex-1 resize-none rounded-md border border-[var(--color-sand)] px-2 py-1.5 text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {pdfPreview.needsReview.length > 0 && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">
                                        Needs your review ({pdfPreview.needsReview.length}) — unchecked by default
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {pdfPreview.needsReview.map((block, i) => (
                                            <div key={`r-${i}`} className="flex items-start gap-2 rounded-lg border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={needsReviewApproved[i] ?? false}
                                                    onChange={(e) => setNeedsReviewApproved((prev) => ({ ...prev, [i]: e.target.checked }))}
                                                    className="mt-1.5"
                                                />
                                                <textarea
                                                    value={needsReviewTexts[i] ?? block.text}
                                                    onChange={(e) => setNeedsReviewTexts((prev) => ({ ...prev, [i]: e.target.value }))}
                                                    rows={2}
                                                    className="flex-1 resize-none rounded-md border border-[var(--color-sand)] px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(csvPreview || pdfPreview) && (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Switch
                                        checked={shareWithApplicants}
                                        onChange={() => setShareWithApplicants(!shareWithApplicants)}
                                        label="Share with other applicants"
                                        disabled={userTier === "free" || committing}
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
                                type="button"
                                onClick={handleImport}
                                disabled={!canImport}
                                className="rounded-lg bg-[var(--color-mint)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {committing
                                    ? "Importing…"
                                    : fileKind === "csv"
                                        ? `Import ${csvPreview?.rowCount ?? 0} question${csvPreview?.rowCount === 1 ? "" : "s"}`
                                        : `Import ${approvedPdfCount} question${approvedPdfCount === 1 ? "" : "s"}`}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}