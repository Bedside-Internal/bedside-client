import { auth } from "@clerk/nextjs/server";
import type { CompetencyDTO } from "@/types/preview";

export async function getPreviewCompetencies(): Promise<CompetencyDTO[]> {
    const { getToken } = await auth();
    const token = await getToken();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/preview/competencies`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", // per-user progress — never cache across users
    });

    if (!res.ok) {
        throw new Error(`Failed to load PREview competencies: ${res.status}`);
    }

    return res.json();
}