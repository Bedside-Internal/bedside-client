export interface DeckCard {
    front: string;
    back: string;
    tags: string | null;
}

export interface DeckPreviewResponse {
    warnings: string[];
    promptCards: DeckCard[];
    knowledgeCards: DeckCard[];
    needsReview: DeckCard[];
}

export interface SynthesisCard {
    id: string;
    cluster: number;
    title: string;
    summaryText: string;
    sourceCardIds: string[];
}

export interface DeckCommitResult {
    prompt: {
        created: { id: string; questionText: string; categoryText: string; difficulty: string | null }[];
        skipped: { rowIndex: number; reason: string }[];
    };
    knowledge: { deckId: string; clusterCount: number; synthesisCards: SynthesisCard[] } | null;
}