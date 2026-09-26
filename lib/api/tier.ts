import "server-only";
import { serverApiFetch } from "@/lib/api/server-fetch";

export interface TierStatus {
    tier: "free" | "paid" | "admin";
}

export async function getTierStatus(): Promise<TierStatus> {
    return serverApiFetch<TierStatus>("/api/me");
}