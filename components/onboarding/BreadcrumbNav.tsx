import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Top-left path indicator, e.g. "Medical School Interview > MMI".
 * Prior segments are muted and link back; the current segment is
 * rendered in the mint accent and is never a link.
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-sm font-semibold">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-[var(--color-ink)]/25"
                  strokeWidth={2.5}
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--color-ink)]/45 transition hover:text-[var(--color-ink)]/70"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "text-[var(--color-mint)]"
                      : "text-[var(--color-ink)]/45"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}