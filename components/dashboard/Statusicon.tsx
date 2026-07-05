import { Check, AlertTriangle } from "lucide-react";

interface StatusIconProps {
  status: "success" | "warning";
}

export function StatusIcon({ status }: StatusIconProps) {
  const Icon = status === "success" ? Check : AlertTriangle;
  return (
    <div data-status={status}>
      <Icon />
    </div>
  );
}