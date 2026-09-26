export type ColumnRole = "question_text" | "category" | "difficulty";

export interface ColumnRoleAssignment {
    role: ColumnRole;
    columnIndex: number | null;
    columnHeader: string | null;
    confidence: number;
    needsReview: boolean;
}

export interface ColumnMapping {
    assignments: ColumnRoleAssignment[];
    unassignedRequiredRoles: ColumnRole[];
}

export interface CsvParsePreview {
    delimiter: string;
    delimiterConfidence: number;
    hasHeader: boolean;
    headerConfidence: number;
    headers: string[];
    rows: string[][]; // full rows, not a capped sample
    rowCount: number;
    warnings: string[];
}

export interface CsvPreviewResponse {
    parse: CsvParsePreview;
    mapping: ColumnMapping;
}

export interface SegmentedBlock {
    text: string;
    confidence: number;
    page: number;
    needsReview: boolean;
}

export interface PdfPreviewResponse {
    pageCount: number;
    warnings: string[];
    confident: SegmentedBlock[];
    needsReview: SegmentedBlock[];
}

export interface ImportedQuestion {
    id: string;
    questionText: string;
    categoryText: string;
    difficulty: "easy" | "medium" | "hard" | null;
}

export interface SkippedImportRow {
    rowIndex: number;
    reason: string;
}

export interface ImportCommitResult {
    created: ImportedQuestion[];
    skipped: SkippedImportRow[];
}