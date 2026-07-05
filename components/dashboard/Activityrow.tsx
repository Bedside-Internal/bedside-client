import { StatusIcon } from "@/components/dashboard/Statusicon";

interface ActivityRowProps {
  status: "success" | "warning";
  title: string;
  meta: string;
  score: number;
}

export function ActivityRow({ status, title, meta, score }: ActivityRowProps) {
  return (
    <div>
      <StatusIcon status={status} />
      <div>
        <p>{title}</p>
        <p>{meta}</p>
      </div>
      <span>{score}</span>
    </div>
  );
}