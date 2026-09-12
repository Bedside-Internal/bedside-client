import { serverApiFetch } from "@/lib/api/server-fetch";
import { getStationQuestions, getQuestion, submitResponse } from "@/lib/api/mmi";
import type { FormatOverviewItem } from "@/types/formats";

export { getStationQuestions, getQuestion, submitResponse };

export async function getCasperCompetencies(): Promise<FormatOverviewItem[]> {
    return serverApiFetch<FormatOverviewItem[]>("/api/casper/competencies");
}