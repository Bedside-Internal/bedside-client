interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    /** Small caption under the number, e.g. "/100" */
    suffix?: string;
  }
  
  export function CircularProgress({
    value,
    max = 100,
    size = 112,
    strokeWidth = 10,
    suffix,
  }: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(1, Math.max(0, value / max));
    const offset = circumference * (1 - percent);
    const center = size / 2;
  
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            style={{ stroke: "var(--color-sand)" }}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ stroke: "var(--color-mint)", transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--color-ink)]">{value}</span>
          {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
        </div>
      </div>
    );
  }