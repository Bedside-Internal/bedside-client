import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/dashboard/Progressbar";

export interface FormatMetric {
    label: string;
    value: number;
    tone?: "mint" | "amber" | "coral" | "slate";
}

interface FormatCardProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    score: number;
    metrics: FormatMetric[];
    /** e.g. "38 of 114 questions" */
    progressLabel: string;
    continueHref: string;
}

export function FormatCard({
    icon: Icon,
    title,
    subtitle,
    score,
    metrics,
    progressLabel,
    continueHref,
}: FormatCardProps) {
    return (
        <div>
            <div>
                <Icon />
                <div>
                    <p>{title}</p>
                    <p>{subtitle}</p>
                </div>
                <span>{score}</span>
            </div>

            <div>
                {metrics.map((metric) => (
                    <ProgressBar key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
                ))}
            </div>

            <div>
                <span>{progressLabel}</span>
                <Link href={continueHref}>Continue →</Link>
            </div>
        </div>
    );
}