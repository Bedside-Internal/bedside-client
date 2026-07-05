import { type LucideIcon } from "lucide-react";

interface FormatCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function FormatCard({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}: FormatCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full flex-col items-start rounded-2xl border-2 bg-white/90 p-5 text-left backdrop-blur-sm transition ${
        selected
          ? "border-emerald-400 shadow-sm"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="mb-4 flex w-full items-start justify-between">
        <Icon className="h-6 w-6 text-slate-700" strokeWidth={1.75} />
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-emerald-400" : "border-slate-300"
          }`}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />}
        </span>
      </div>
      <p className="mb-1 font-semibold text-slate-900">{title}</p>
      <p className="text-sm leading-snug text-slate-400">{description}</p>
    </button>
  );
}