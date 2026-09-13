"use client";

type TimeOfDay = "morning" | "afternoon" | "evening";

interface GreetingHeaderProps {
  name: string;
  streakDays: number;
}

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function GreetingHeader({ name, streakDays }: GreetingHeaderProps) {
  return (
    <div className="pt-4">
      <h1 className="font-display text-[44px] leading-[0.95] tracking-tight text-[var(--color-ink)] sm:text-[56px]">
        Good <span suppressHydrationWarning>{getTimeOfDay()}</span>, {name}
      </h1>
      <p className="mt-3 text-slate-400">
        {streakDays > 0 ? (
          <>
            You&apos;ve practiced{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {streakDays} day{streakDays === 1 ? "" : "s"} in a row.
            </span>{" "}
            Keep the streak going, pick up where you left off.
          </>
        ) : (
          <>Ready when you are, pick a format below and start your first session.</>
        )}
      </p>
    </div>
  );
}