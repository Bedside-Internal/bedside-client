import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface StationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Total questions/scenarios available in this station's bank. */
  totalQuestions: number;
  /** How many the user has completed. 0 or omitted renders as "Not started". */
  completedQuestions?: number;
  /** Unit noun shown in the count pill and caption. Defaults to "questions". */
  unitLabel?: string;
  /** Direct navigation target. Ignored if onSelect is provided. */
  href?: string;
  /** Presence of this prop puts the card in select-then-continue mode. */
  onSelect?: () => void;
  selected?: boolean;
}

/**
 * Derivative of SelectableCard purpose-built for progress-tracked practice
 * stations (see: MMI station grid). Keeps SelectableCard's icon/select/href
 * interaction patterns, but swaps the arrow-row layout for a vertical card
 * with a question-count pill and a completion progress bar, since that's
 * content SelectableCard has no concept of.
 */
export function StationCard({
  icon: Icon,
  title,
  description,
  totalQuestions,
  completedQuestions = 0,
  unitLabel = "questions",
  href,
  onSelect,
  selected,
}: StationCardProps) {
  const started = completedQuestions > 0;
  const percent =
    totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const inner = (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white/95 p-6 text-left shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.04)] backdrop-blur-sm transition hover:shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_28px_rgba(26,26,26,0.08)] ${
        selected
          ? "border-[var(--color-mint)]"
          : "border-[var(--color-ink)]/8 hover:border-[var(--color-mint)]/40"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
          <Icon className="h-5 w-5 text-[var(--color-ink)]/70" strokeWidth={1.75} />
        </div>
        <span className="whitespace-nowrap rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]/50">
          {totalQuestions} {unitLabel}
        </span>
      </div>

      <p className="mb-1.5 font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mb-6 text-sm leading-snug text-[var(--color-ink)]/55">
        {description}
      </p>

      <div className="mt-auto">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-sand)]">
          {started && (
            <div
              className="h-full rounded-full bg-[var(--color-mint)] transition-all"
              style={{ width: `${percent}%` }}
            />
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--color-ink)]/40">
          {started
            ? `${completedQuestions} of ${totalQuestions} ${unitLabel} · ${percent}%`
            : "Not started"}
        </p>
      </div>
    </div>
  );

  // Select-then-continue mode: clicking only toggles selection.
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="h-full w-full text-left"
      >
        {inner}
      </button>
    );
  }

  // Instant-navigate mode.
  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }

  return inner;
}