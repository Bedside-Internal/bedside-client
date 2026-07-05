"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Users, Grid2x2, Monitor, Video } from "lucide-react";
import { FormatCard } from "./FormatCard";

const formats = [
  {
    id: "traditional",
    icon: Users,
    title: "Traditional",
    description: "Panel & one-on-one interviews with faculty or an admissions committee",
  },
  {
    id: "mmi",
    icon: Grid2x2,
    title: "MMI",
    description: "Multiple Mini Interviews — timed ethical and situational stations in a circuit",
  },
  {
    id: "casper",
    icon: Monitor,
    title: "CASPer",
    description: "Situational Judgment Test — written and video responses completed online",
  },
  {
    id: "preview",
    icon: Video,
    title: "PREview",
    description: "Professional Readiness Evaluation — video-based assessment by Acuity Insights",
  },
];

export function FormatSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  function handleContinue() {
    if (!selected) return;
    router.push(`/onboarding/medical-school/${selected}`);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {formats.map((format) => (
          <FormatCard
            key={format.id}
            icon={format.icon}
            title={format.title}
            description={format.description}
            selected={selected === format.id}
            onSelect={() => setSelected(format.id)}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className={`flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            selected
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}