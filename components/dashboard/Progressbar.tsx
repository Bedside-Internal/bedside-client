interface ProgressBarProps {
    label: string;
    value: number;
    max?: number;
    tone?: "mint" | "amber" | "coral" | "slate";
    valueLabel?: string;
}

export function ProgressBar({
    label,
    value,
    max = 100,
    tone = "mint",
    valueLabel,
}: ProgressBarProps) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div>
            <span>{label}</span>
            <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
                <div style={{ width: `${percent}%` }} data-tone={tone} />
            </div>
            <span>{valueLabel ?? value}</span>
        </div>
    );
}