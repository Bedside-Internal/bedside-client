export interface CircuitStationPreview {
    sectionSlug: string;
    title: string;
    iconKey: string | null;
    order: number;
  }
  
  export interface CircuitPreview {
    stations: CircuitStationPreview[];
    totalEstimatedMinutes: number;
    requiresMic: boolean;
    requiresCamera: boolean;
  }
  
  export interface CircuitStationState {
    sectionSlug: string;
    title: string;
    iconKey: string | null;
    order: number;
    questionId: string;
    completed: boolean;
  }
  
  export interface CircuitAttemptState {
    attemptId: string;
    stations: CircuitStationState[];
    completedAt: string | null;
  }
  
  export interface CircuitStationResult {
    sectionSlug: string;
    title: string;
    iconKey: string | null;
    score: number | null;
    needsFocus: boolean;
  }
  
  export interface CircuitResults {
    attemptId: string;
    overallScore: number;
    stationsCompleted: number;
    stationsTotal: number;
    totalMinutes: number;
    percentile: number | null;
    standoutStationLabel: string | null;
    stations: CircuitStationResult[];
  }