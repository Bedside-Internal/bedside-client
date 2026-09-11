import { serverApiFetch } from "@/lib/api/server-fetch";
import type { FormatOverviewItem } from "@/types/formats";

export async function getMmiStations(): Promise<FormatOverviewItem[]> {
  return serverApiFetch<FormatOverviewItem[]>("/api/mmi/stations");
}