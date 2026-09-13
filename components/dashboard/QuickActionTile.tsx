import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionTileProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    href: string;
}

export function QuickActionTile({ icon: Icon, title, subtitle, href }: QuickActionTileProps) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-sand)] bg-white p-5 text-center transition hover:border-[var(--color-mint)] hover:shadow-md"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sand)] transition group-hover:bg-[var(--color-mint)]/10">
                <Icon
                    className="h-5 w-5 text-slate-600 transition group-hover:text-[var(--color-mint)]"
                    strokeWidth={2}
                />
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-[var(--color-ink)]">{title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
            </div>
        </Link>
    );
}