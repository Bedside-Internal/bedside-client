interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    suffix?: string;
}

export function CircularProgress({
    value,
    max = 100,
    size = 96,
    strokeWidth = 8,
    suffix,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(1, Math.max(0, value / max));
    const offset = circumference * (1 - percent);

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span>{value}</span>
                {suffix && <span>{suffix}</span>}
            </div>
        </div>
    );
}