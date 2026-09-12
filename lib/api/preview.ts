import type { CompetencyDTO } from "@/types/formats";
import { serverApiFetch } from "./server-fetch";

export async function getPreviewCompetencies(): Promise<CompetencyDTO[]> {
    return serverApiFetch<CompetencyDTO[]>("/api/preview/competencies");
}