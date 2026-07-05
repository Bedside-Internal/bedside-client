interface GreetingHeaderProps {
    name: string;
    streakDays: number;
    timeOfDay: "morning" | "afternoon" | "evening";
  }
  
  export function GreetingHeader({ name, streakDays, timeOfDay }: GreetingHeaderProps) {
    return (
      <div>
        <h1 className="font-sans text-4xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Good {timeOfDay}, {name}
        </h1>
        <p className="mt-2 text-slate-400">
          You&apos;ve practised <span className="font-semibold text-[var(--color-ink)]">{streakDays} days in a row.</span>{" "}
          Keep the streak going — pick up where you left off.
        </p>
      </div>
    );
  }