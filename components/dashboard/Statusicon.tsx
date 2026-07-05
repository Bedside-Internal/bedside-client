import { Check, AlertTriangle } from "lucide-react";

interface StatusIconProps {
  status: "success" | "warning";
}

const tint: Record<StatusIconProps["status"], string> = {
  success: "color-mix(in srgb, var(--color-mint) 15%, white)",
  warning: "color-mix(in srgb, var(--color-amber) 18%, white)",
};

const iconColor: Record<StatusIconProps["status"], string> = {
  success: "var(--color-mint)",
  warning: "var(--color-amber)",
};

export function StatusIcon({ status }: StatusIconProps) {
  const Icon = status === "success" ? Check : AlertTriangle;
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: tint[status] }}
    >
      <Icon className="h-4 w-4" style={{ color: iconColor[status] }} strokeWidth={2.5} />
    </div>
  );
}