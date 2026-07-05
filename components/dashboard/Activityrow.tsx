import { StatusIcon } from "@/components/dashboard/Statusicon";

interface ActivityRowProps {
  status: "success" | "warning";
  title: string;
  /** e.g. "Q3 · Scored 90/100 · 2h ago" */
  meta: string;
  score: number;
}

export function ActivityRow({ status, title, meta, score }: ActivityRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <StatusIcon status={status} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--color-ink)]">{title}</p>
        <p className="truncate text-sm text-slate-400">{meta}</p>
      </div>
      <span
        className="text-sm font-bold"
        style={{ color: status === "warning" ? "var(--color-amber)" : "var(--color-ink)" }}
      >
        {score}
      </span>
    </div>
  );
}