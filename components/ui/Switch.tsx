"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
      className="relative h-6 w-10 shrink-0 rounded-full bg-slate-200 outline-none transition-colors data-[state=checked]:bg-[var(--color-mint)] focus-visible:ring-2 focus-visible:ring-[var(--color-mint)] focus-visible:ring-offset-2"
    >
      <SwitchPrimitive.Thumb className="block h-4.5 w-4.5 translate-x-1 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  );
}