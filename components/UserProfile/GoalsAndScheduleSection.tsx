"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

const DAYS = [
  { id: "sun", label: "S" },
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
] as const;

const THRESHOLD_FORMATS = [
  { id: "mmi", label: "MMI" },
  { id: "casper", label: "CASPer" },
  { id: "preview", label: "PREview" },
] as const;

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// Same pattern as page.tsx's getDashboardData — the API may not be same-origin.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** Mirrors the backend's goalsScheduleSchema shape. */
interface GoalsScheduleInput {
  weeklyGoal: number;
  practiceDays: {
    sun: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
  };
  reminderTime: string;
  thresholds: {
    mmi: number;
    casper: number;
    preview: number;
  };
}

const DEFAULT_DATA: GoalsScheduleInput = {
  weeklyGoal: 4,
  practiceDays: {
    sun: false,
    mon: true,
    tue: true,
    wed: false,
    thu: true,
    fri: false,
    sat: true,
  },
  reminderTime: "18:00",
  thresholds: { mmi: 80, casper: 75, preview: 70 },
};

function isValidScore(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 100;
}

/** Manual check matching the backend's goalsScheduleSchema constraints. */
function isGoalsScheduleInput(value: unknown): value is GoalsScheduleInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  if (
    typeof v.weeklyGoal !== "number" ||
    !Number.isInteger(v.weeklyGoal) ||
    v.weeklyGoal < 1 ||
    v.weeklyGoal > 14
  ) {
    return false;
  }

  if (typeof v.reminderTime !== "string" || !TIME_REGEX.test(v.reminderTime)) {
    return false;
  }

  const days = v.practiceDays as Record<string, unknown> | undefined;
  if (
    !days ||
    DAYS.some((d) => typeof days[d.id] !== "boolean")
  ) {
    return false;
  }

  const thresholds = v.thresholds as Record<string, unknown> | undefined;
  if (
    !thresholds ||
    THRESHOLD_FORMATS.some((f) => !isValidScore(thresholds[f.id]))
  ) {
    return false;
  }

  return true;
}

interface GoalsSchedulePanelProps {
  onSave?: (data: GoalsScheduleInput) => Promise<void> | void;
}

export function GoalsSchedulePanel({ onSave }: GoalsSchedulePanelProps) {
  const { getToken } = useAuth();
  const [data, setData] = useState<GoalsScheduleInput>(DEFAULT_DATA);
  const [initial, setInitial] = useState<GoalsScheduleInput>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/settings/goals-schedule`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to load goals & schedule (${res.status})`);
        }
        const json = await res.json();
        if (cancelled) return;

        if (!isGoalsScheduleInput(json)) {
          throw new Error("Goals & schedule response did not match expected shape");
        }
        setData(json);
        setInitial(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load goals & schedule"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty =
    data.weeklyGoal !== initial.weeklyGoal ||
    data.reminderTime !== initial.reminderTime ||
    DAYS.some((d) => data.practiceDays[d.id] !== initial.practiceDays[d.id]) ||
    THRESHOLD_FORMATS.some((f) => data.thresholds[f.id] !== initial.thresholds[f.id]);

  const selectedDayCount = DAYS.filter((d) => data.practiceDays[d.id]).length;

  function toggleDay(id: (typeof DAYS)[number]["id"]) {
    setData((prev) => ({
      ...prev,
      practiceDays: { ...prev.practiceDays, [id]: !prev.practiceDays[id] },
    }));
  }

  function setThreshold(id: (typeof THRESHOLD_FORMATS)[number]["id"], value: number) {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    setData((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [id]: clamped },
    }));
  }

  function handleDiscard() {
    setData(initial);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/settings/goals-schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Failed to save goals & schedule (${res.status})`);
      }
      const json = await res.json().catch(() => data);
      const merged = isGoalsScheduleInput(json) ? json : data;
      setData(merged);
      setInitial(merged);
      toast.success("Goals & schedule saved");
      await onSave?.(merged);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save goals & schedule";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Goals & Schedule</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set your practice goals and let us know when to remind you.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-coral)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-coral)]">
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-slate-100">
          {/* Weekly goal */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Weekly goal</p>
              <p className="mt-1 text-sm text-slate-400">
                How many sessions do you want to complete each week?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      weeklyGoal: Math.max(1, prev.weeklyGoal - 1),
                    }))
                  }
                  className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:text-[var(--color-ink)]"
                  aria-label="Decrease weekly goal"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[var(--color-ink)]">
                  {data.weeklyGoal}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      weeklyGoal: Math.min(14, prev.weeklyGoal + 1),
                    }))
                  }
                  className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:text-[var(--color-ink)]"
                  aria-label="Increase weekly goal"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-slate-400">
                {data.weeklyGoal === 1 ? "session" : "sessions"} / week
              </span>
            </div>
          </div>

          {/* Practice days */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Practice days</p>
              <p className="mt-1 text-sm text-slate-400">
                Which days are you usually available?
              </p>
            </div>
            <div>
              <div className="flex gap-2">
                {DAYS.map((day) => {
                  const selected = data.practiceDays[day.id];
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      aria-pressed={selected}
                      aria-label={day.id}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
                        selected
                          ? "bg-[var(--color-mint)] text-white"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {selectedDayCount} {selectedDayCount === 1 ? "day" : "days"} selected
              </p>
            </div>
          </div>

          {/* Score thresholds */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">
                Score thresholds
              </p>
              <p className="mt-1 text-sm text-slate-400">
                The score you're aiming for in each format.
              </p>
            </div>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {THRESHOLD_FORMATS.map((format) => (
                <div
                  key={format.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {format.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={data.thresholds[format.id]}
                      onChange={(e) => setThreshold(format.id, Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-mint)]"
                    />
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder time */}
          <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Reminder time</p>
              <p className="mt-1 text-sm text-slate-400">
                When should we send your daily practice reminder?
              </p>
            </div>
            <input
              type="time"
              value={data.reminderTime}
              onChange={(e) =>
                setData((prev) => ({ ...prev, reminderTime: e.target.value }))
              }
              className="w-full max-w-[160px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-mint)]"
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isDirty || saving}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Discard changes
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="rounded-lg bg-[var(--color-mint)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-mint-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}