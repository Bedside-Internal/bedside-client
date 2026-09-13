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
    <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard-sm">
      <div className="flex items-center gap-6">
        <CircularProgress value={overallScore} suffix="/100" size={128} strokeWidth={12} />
        <div className="flex-1 space-y-3">
          {breakdown.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
}