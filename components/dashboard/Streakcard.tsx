export interface StreakDay {
    label: string;
    completed: boolean;
    isToday?: boolean;
  }
  
  interface StreakCardProps {
    streakDays: number;
    message: string;
    days: StreakDay[];
  }
  
  export function StreakCard({ streakDays, message, days }: StreakCardProps) {
    return (
      <div>
        <span>🔥</span>
        <div>
          <p>{streakDays}-day streak</p>
          <p>{message}</p>
        </div>
        <div>
          {days.map((day, i) => (
            <span key={i} data-completed={day.completed} data-today={day.isToday}>
              {day.completed ? "✓" : day.label}
            </span>
          ))}
        </div>
      </div>
    );
  }