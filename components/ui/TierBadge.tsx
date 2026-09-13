"use client";

import { useEffect, useState } from "react";
import { useApiFetch } from "@/lib/api/use-api-fetch";
import { Crown, Shield } from "lucide-react";

interface KindStatus { used: number; limit: number | null; remaining: number | null; isCapped: boolean; }
interface TierStatus { tier: "free" | "paid" | "admin"; attemptsUsed: number; singleStation: KindStatus; fullCircuit: KindStatus; }

export function TierBadge() {
  const apiFetch = useApiFetch();
  const [status, setStatus] = useState<TierStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<TierStatus>("/api/me").then((d) => { if (!cancelled) setStatus(d); }).catch(() => { });
    return () => { cancelled = true; };
  }, [apiFetch]);

  if (!status) return null;

  if (status.tier === "admin") {
    return <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-violet)]/10 px-3 py-1 text-xs font-bold text-[var(--color-violet)]"><Shield className="h-3.5 w-3.5" strokeWidth={2.5} />Admin</span>;
  }
  if (status.tier === "paid") {
    return <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-amber)]/10 px-3 py-1 text-xs font-bold text-[var(--color-amber)]"><Crown className="h-3.5 w-3.5" strokeWidth={2.5} />Pro</span>;
  }
  if (status.singleStation.isCapped && status.fullCircuit.isCapped) {
    return <span className="rounded-full bg-[var(--color-coral)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-coral)]">Out of free attempts!</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <TierMeter label="samples" status={status.singleStation} />
      <TierMeter label="mocks" status={status.fullCircuit} />
    </div>
  );
}

function TierMeter({ label, status }: { label: string; status: KindStatus }) {
  const limit = status.limit ?? 1;
  const pct = Math.min(100, Math.round((status.used / limit) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full transition-all ${status.isCapped ? "bg-[var(--color-coral)]" : "bg-[var(--color-mint)]"}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-400">{status.used}/{status.limit} {label}</span>
    </div>
  );
}