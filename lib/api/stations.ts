import { serverApiFetch } from "@/lib/api/server-fetch";
import type { StationDTO } from "@/types/stations";

export async function getMmiStations(): Promise<StationDTO[]> {
  return serverApiFetch<StationDTO[]>("/api/mmi/stations");
}