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
    <div className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5 shadow-hard-sm sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
        <CircularProgress value={overallScore} suffix="/100" size={128} strokeWidth={12} />
        <div className="w-full space-y-3 sm:flex-1">
          {breakdown.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
}