"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Crown, Shield } from "lucide-react";

interface TierStatus {
  tier: "free" | "paid" | "admin";
  attemptsUsed: number;
  limit: number | null;
  remaining: number | null;
  isCapped: boolean;
}

export function TierBadge() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<TierStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = await getToken();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStatus(data);
      } catch {
        // fail silently — badge just doesn't render rather than breaking the page
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  if (!status) return null;

  if (status.tier === "admin") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-violet)]/10 px-3 py-1 text-xs font-bold text-[var(--color-violet)]">
        <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
        Admin
      </span>
    );
  }

  if (status.tier === "paid") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-amber)]/10 px-3 py-1 text-xs font-bold text-[var(--color-amber)]">
        <Crown className="h-3.5 w-3.5" strokeWidth={2.5} />
        Pro
      </span>
    );
  }

  // free tier
  if (status.isCapped) {
    return (
      <span className="rounded-full bg-[var(--color-coral)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-coral)]">
        Out of free attempts — upgrade coming soon
      </span>
    );
  }

  const limit = status.limit ?? 5;
  const pct = Math.min(100, Math.round((status.attemptsUsed / limit) * 100));

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[var(--color-mint)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-400">
        {status.attemptsUsed}/{limit} free
      </span>
    </div>
  );
}