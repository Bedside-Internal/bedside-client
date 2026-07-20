"use client";

import { useRouter } from "next/navigation";
import type { StationDTO } from "@/types/stations";

interface RandomStationButtonProps {
  stations: StationDTO[];
}

export function RandomStationButton({ stations }: RandomStationButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (stations.length === 0) return;
    const pick = stations[Math.floor(Math.random() * stations.length)];
    router.push(pick.href);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={stations.length === 0}
      className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      Practice a random station
    </button>
  );
}