import { serverApiFetch } from "@/lib/api/server-fetch";

export interface PerformanceSessionPoint {
    attemptId: string;
    completedAt: string;
    score: number;
}
export interface PerformanceTrendPoint {
    label: string;
    averageScore: number;
    sessionsCount: number;
    midpointT: number;
}
export interface PerformanceTrendData {
    points: PerformanceTrendPoint[];
    sessions: PerformanceSessionPoint[];
    monthlyAverage: number | null;
    sessionsThisMonth: number;
}

export async function getPerformanceTrend(): Promise<PerformanceTrendData> {
    return serverApiFetch<PerformanceTrendData>("/api/performance/trend?bucket=week&sinceDays=90");
}