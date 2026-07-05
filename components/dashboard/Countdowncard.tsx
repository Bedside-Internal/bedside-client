interface CountdownCardProps {
    daysRemaining: number;
    prepTimeUsedPercent: number;
}

export function CountdownCard({ daysRemaining, prepTimeUsedPercent }: CountdownCardProps) {
    return (
        <div>
            <span>{daysRemaining}</span>
            <p>days until interview</p>
            <div role="progressbar" aria-valuenow={prepTimeUsedPercent} aria-valuemin={0} aria-valuemax={100}>
                <div style={{ width: `${prepTimeUsedPercent}%` }} />
            </div>
            <p>{prepTimeUsedPercent}% of prep time used</p>
        </div>
    );
}