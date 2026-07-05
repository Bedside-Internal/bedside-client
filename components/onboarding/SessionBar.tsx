import { UserButton } from "@clerk/nextjs";


export function SessionBar({ label = "" }: { label?: string }) { // TODO: logo-placement
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <UserButton />
    </div>
  );
}