import { ApiError, serverApiFetch } from "@/lib/api/server-fetch";

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

const EMPTY_TREND: PerformanceTrendData = {
    points: [],
    sessions: [],
    monthlyAverage: null,
    sessionsThisMonth: 0,
};

export async function getPerformanceTrend(): Promise<PerformanceTrendData> {
    try {
        return await serverApiFetch<PerformanceTrendData>("/api/performance/trend?bucket=week&sinceDays=90");
    } catch (err) {
        return EMPTY_TREND;
    }
}