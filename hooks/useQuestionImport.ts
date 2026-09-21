"use client";

import { useCallback, useState } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import type {
    CsvPreviewResponse,
    ColumnMapping,
    PdfPreviewResponse,
    ImportCommitResult,
} from "@/types/questionImport";

export function useQuestionImport(formatId: string | null) {
    const apiFetch = useApiFetch();

    const [previewing, setPreviewing] = useState(false);
    const [committing, setCommitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [csvPreview, setCsvPreview] = useState<CsvPreviewResponse["parse"] | null>(null);
    const [mapping, setMapping] = useState<ColumnMapping | null>(null);
    const [pdfPreview, setPdfPreview] = useState<PdfPreviewResponse | null>(null);
    const [result, setResult] = useState<ImportCommitResult | null>(null);

    const previewCsv = useCallback(
        async (file: File) => {
            setPreviewing(true);
            setError(null);
            try {
                const form = new FormData();
                form.append("file", file);
                if (formatId) form.append("formatId", formatId);
                const res = await apiFetch<CsvPreviewResponse>("/api/questions/import/csv/preview", {
                    method: "POST",
                    body: form,
                });
                setCsvPreview(res.parse);
                setMapping(res.mapping);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to read CSV file");
                throw err;
            } finally {
                setPreviewing(false);
            }
        },
        [apiFetch, formatId],
    );

    const previewPdf = useCallback(
        async (file: File) => {
            setPreviewing(true);
            setError(null);
            try {
                const form = new FormData();
                form.append("file", file);
                const res = await apiFetch<PdfPreviewResponse>("/api/questions/import/pdf/preview", {
                    method: "POST",
                    body: form,
                });
                setPdfPreview(res);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to read PDF file");
                throw err;
            } finally {
                setPreviewing(false);
            }
        },
        [apiFetch],
    );

    const commitCsv = useCallback(
        async (rows: string[][], shareWithApplicants: boolean) => {
            if (!mapping) throw new Error("No mapping to commit");
            setCommitting(true);
            setError(null);
            try {
                const res = await apiFetch<ImportCommitResult>("/api/questions/import/csv/commit", {
                    method: "POST",
                    body: JSON.stringify({ formatId, shareWithApplicants, mapping, rows }),
                });
                setResult(res);
                return res;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Import failed");
                throw err;
            } finally {
                setCommitting(false);
            }
        },
        [apiFetch, formatId, mapping],
    );

    const commitPdf = useCallback(
        async (texts: string[], shareWithApplicants: boolean) => {
            setCommitting(true);
            setError(null);
            try {
                const res = await apiFetch<ImportCommitResult>("/api/questions/import/pdf/commit", {
                    method: "POST",
                    body: JSON.stringify({ formatId, shareWithApplicants, texts }),
                });
                setResult(res);
                return res;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Import failed");
                throw err;
            } finally {
                setCommitting(false);
            }
        },
        [apiFetch, formatId],
    );

    const reset = useCallback(() => {
        setCsvPreview(null);
        setMapping(null);
        setPdfPreview(null);
        setResult(null);
        setError(null);
    }, []);

    return {
        previewing,
        committing,
        error,
        clearError: () => setError(null),
        csvPreview,
        mapping,
        setMapping,
        pdfPreview,
        setPdfPreview,
        result,
        previewCsv,
        previewPdf,
        commitCsv,
        commitPdf,
        reset,
    };
}