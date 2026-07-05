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
    <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-6">
        <CircularProgress value={overallScore} suffix="/100" />
        <div className="flex-1 space-y-3">
          {breakdown.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
}