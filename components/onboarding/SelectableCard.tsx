import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface SelectableCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "horizontal" | "vertical";
  /**
   * Icon treatment, independent of layout:
   * - "plain": bare icon, no background (matches the original FormatCard look)
   * - "boxed": icon inside a colored rounded square (matches the original TrackCard look)
   * Defaults to whatever the variant traditionally used, but either can be forced regardless of variant.
   */
  iconStyle?: "plain" | "boxed";
  disabled?: boolean;
  selected?: boolean;
  /** Direct navigation target. Ignored if onSelect is provided — an external Continue button governs instead. */
  href?: string;
  /** Presence of this prop puts the card in "select, then Continue navigates" mode. */
  onSelect?: () => void;
}

export function SelectableCard({
  icon: Icon,
  title,
  description,
  variant = "horizontal",
  iconStyle,
  disabled,
  selected,
  href,
  onSelect,
}: SelectableCardProps) {
  const resolvedIconStyle = iconStyle ?? (variant === "vertical" ? "plain" : "boxed");

  const activeIcon =
    resolvedIconStyle === "boxed" ? (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
        <Icon className="h-5 w-5 text-emerald-600" strokeWidth={2} />
      </div>
    ) : (
      <Icon className="h-6 w-6 text-slate-700" strokeWidth={1.75} />
    );

  const disabledIcon =
    resolvedIconStyle === "boxed" ? (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon className="h-5 w-5 text-slate-300" strokeWidth={2} />
      </div>
    ) : (
      <Icon className="h-6 w-6 text-slate-300" strokeWidth={1.75} />
    );

  if (disabled) {
    return variant === "vertical" ? (
      <div className="flex h-full flex-col items-start rounded-2xl border-2 border-dashed border-slate-200 p-5 opacity-60">
        <div className="mb-4">{disabledIcon}</div>
        <p className="mb-1 font-semibold text-slate-400">{title}</p>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    ) : (
      <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-5 opacity-60">
        {disabledIcon}
        <div className="text-left">
          <p className="font-semibold text-slate-400">{title}</p>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    );
  }

  const inner =
    variant === "vertical" ? (
      <div
        className={`flex w-full flex-col items-start rounded-2xl border-2 bg-white/90 p-5 text-left backdrop-blur-sm transition ${
          selected ? "border-emerald-400 shadow-sm" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="mb-4 flex w-full items-start justify-between">
          {activeIcon}
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
      </div>
    ) : (
      <div
        className={`flex items-center justify-between rounded-2xl border-2 bg-white px-6 py-5 shadow-sm transition hover:shadow-md ${
          selected
            ? "border-emerald-400 hover:border-emerald-400"
            : "border-slate-200 hover:border-emerald-300"
        }`}
      >
        <div className="flex items-center gap-4">
          {activeIcon}
          <div className="text-left">
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
      </div>
    );

  // Select-then-continue mode: clicking only toggles selection, no navigation here.
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={variant === "vertical" ? "h-full w-full text-left" : "w-full text-left"}
      >
        {inner}
      </button>
    );
  }

  // Instant-navigate mode: no Continue button governing this card, so it links directly.
  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
}