import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface TrackCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  disabled?: boolean;
  selected?: boolean;
  href?: string;
  onSelect?: () => void;
}

export function TrackCard({
  icon: Icon,
  title,
  subtitle,
  disabled,
  selected,
  href,
  onSelect,
}: TrackCardProps) {
  if (disabled) {
    return (
      <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-5 text-center opacity-60">
        <div>
          <p className="font-semibold text-slate-400">{title}</p>
          <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
      </div>
    );
  }

  const cardInner = (
    <div
      className={`flex items-center justify-between rounded-2xl border-2 bg-white px-6 py-5 shadow-sm transition hover:shadow-md ${
        selected
          ? "border-emerald-400 hover:border-emerald-400"
          : "border-slate-200 hover:border-emerald-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-600" strokeWidth={2} />
        </div>
        <div className="text-left">
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
    </div>
  );

  // Select-then-continue mode: clicking only toggles selection, no navigation here.
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className="w-full text-left">
        {cardInner}
      </button>
    );
  }

  // Instant-navigate mode: no Continue button governing this card, so it links directly.
  if (href) {
    return <Link href={href}>{cardInner}</Link>;
  }

  return cardInner;
}