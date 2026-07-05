interface GreetingHeaderProps {
    name: string;
    streakDays: number;
    timeOfDay: "morning" | "afternoon" | "evening";
}

export function GreetingHeader({ name, streakDays, timeOfDay }: GreetingHeaderProps) {
    return (
        <div>
            <h1>
                Good {timeOfDay}, {name} 👋
            </h1>
            <p>
                You've practised <strong>{streakDays} days in a row.</strong> Keep the streak going — pick up where you left
                off.
            </p>
        </div>
    );
}