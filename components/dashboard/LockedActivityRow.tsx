import Link from "next/link";
import { Lock } from "lucide-react";

interface LockedActivityRowProps {
  count: number;
}

export function LockedActivityRow({ count }: LockedActivityRowProps) {
  return (
    <Link
      href="/#pricing"
      className="group flex items-center gap-3 py-3 transition hover:opacity-80"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
        <Lock className="h-4 w-4 text-slate-400" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--color-ink)]/40">
          {count} earlier {count === 1 ? "session" : "sessions"}
        </p>
        <p className="truncate text-sm text-slate-400">Unlock full session history with Pro</p>
      </div>
      <span className="text-sm font-semibold text-[var(--color-amber)] group-hover:underline">
        Upgrade
      </span>
    </Link>
  );
}