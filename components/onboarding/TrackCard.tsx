import { ArrowRight } from "lucide-react";
import { ElementType } from "react";

interface TrackCardProps {
    icon: ElementType;
    title: string;
    subtitle: string;
    href?: string;
    disabled?: boolean;
    selected?: boolean;
}

export function TrackCard({
    icon: Icon,
    title,
    subtitle,
    href,
    disabled,
    selected,
}: TrackCardProps) {
    const content = (
        <div
            className={`
          flex items-center justify-between rounded-2xl border-2 px-6 py-5
          transition
          ${disabled
                    ? "border-dashed border-slate-200 opacity-50 cursor-not-allowed"
                    : selected
                        ? "border-emerald-400 bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                }
        `}
        >
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${disabled ? "bg-slate-100" : "bg-emerald-50"
                        }`}
                >
                    <Icon
                        className={`h-5 w-5 ${disabled ? "text-slate-400" : "text-emerald-600"
                            }`}
                    />
                </div>
                <div>
                    <p className={`font-semibold ${disabled ? "text-slate-400" : "text-slate-900"}`}>
                        {title}
                    </p>
                    <p className="text-sm text-slate-400">{subtitle}</p>
                </div>
            </div>
            {!disabled && <ArrowRight className="h-5 w-5 text-slate-400" />}
        </div>
    );

    if (disabled || !href) return content;

    return <a href={href}>{content}</a>;
}