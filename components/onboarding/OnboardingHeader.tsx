import { cn } from "@/lib/utils";

interface OnboardingHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  eyebrowClassName?: string;
  subtitleClassName?: string;
  className?: string;
}

export function OnboardingHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowClassName,
  subtitleClassName,
  className,
}: OnboardingHeaderProps) {
  return (
    <div className={cn("min-w-0 text-center", className)}>
      <p
        className={cn(
          "mb-2 text-sm font-semibold text-emerald-600",
          eyebrowClassName
        )}
      >
        {eyebrow}
      </p>
      <h1 className="mb-2 font-serif text-4xl font-bold text-slate-900 sm:text-5xl">
        {title}
      </h1>
      <p className={cn("text-slate-400", subtitleClassName)}>{subtitle}</p>
    </div>
  );
}