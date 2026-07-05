import { CircularProgress } from "@/components/dashboard/Circularprogress";
import { ProgressBar } from "@/components/dashboard/Progressbar";

interface ReadinessBreakdownItem {
    label: string;
    value: number;
}

interface ReadinessSummaryProps {
    overallScore: number;
    breakdown: ReadinessBreakdownItem[];
}

export function ReadinessSummary({ overallScore, breakdown }: ReadinessSummaryProps) {
    return (
        <div>
            <CircularProgress value={overallScore} suffix="/100" />
            <div>
                {breakdown.map((item) => (
                    <ProgressBar key={item.label} label={item.label} value={item.value} />
                ))}
            </div>
        </div>
    );
}