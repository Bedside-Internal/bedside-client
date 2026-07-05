import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface QuickActionRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
}

export function QuickActionRow({ icon: Icon, title, subtitle, href }: QuickActionRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-[var(--color-sand)] bg-white px-5 py-4 shadow-sm transition hover:border-[var(--color-mint)] hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
        <Icon className="h-5 w-5 text-slate-600" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[var(--color-ink)]">{title}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}