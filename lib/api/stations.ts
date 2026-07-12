import { auth } from "@clerk/nextjs/server";
import type { StationDTO } from "@/types/stations";

export async function getMmiStations(): Promise<StationDTO[]> {
    const { getToken } = await auth();
    const token = await getToken();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/mmi/stations`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", // per-user progress — never cache across users
    });

    if (!res.ok) {
        throw new Error(`Failed to load MMI stations: ${res.status}`);
    }

    return res.json();
}