interface ProgressBarProps {
    label: string;
    value: number;
    max?: number;
    tone?: "mint" | "amber" | "coral" | "slate";
    valueLabel?: string;
  }
  
  const fillColor: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
    mint: "bg-[var(--color-mint)]",
    amber: "bg-[var(--color-amber)]",
    coral: "bg-[var(--color-coral)]",
    slate: "bg-slate-300",
  };
  
  const valueColor: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
    mint: "text-[var(--color-ink)]",
    amber: "text-[var(--color-amber)]",
    coral: "text-[var(--color-coral)]",
    slate: "text-[var(--color-ink)]",
  };
  
  export function ProgressBar({
    label,
    value,
    max = 100,
    tone = "mint",
    valueLabel,
  }: ProgressBarProps) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
  
    return (
      <div className="flex items-center gap-3">
        <span className="w-20 shrink-0 text-sm text-slate-400">{label}</span>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-sand)]"
        >
          <div
            className={`h-full rounded-full transition-[width] ${fillColor[tone]}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`w-8 shrink-0 text-right text-sm font-semibold ${valueColor[tone]}`}>
          {valueLabel ?? value}
        </span>
      </div>
    );
  }