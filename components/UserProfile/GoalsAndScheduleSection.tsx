"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const DAYS = [
  { id: "sun", label: "S" },
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
] as const;

const INITIAL_DAYS: Record<string, boolean> = {
  sun: false,
  mon: true,
  tue: true,
  wed: false,
  thu: true,
  fri: false,
  sat: true,
};

const THRESHOLD_FORMATS = [
  { id: "mmi", label: "MMI" },
  { id: "casper", label: "CASPer" },
  { id: "preview", label: "PREview" },
] as const;

const INITIAL_THRESHOLDS: Record<string, number> = {
  mmi: 80,
  casper: 75,
  preview: 70,
};

interface GoalsSchedulePanelProps {
  onSave?: (data: {
    weeklyGoal: number;
    practiceDays: Record<string, boolean>;
    reminderTime: string;
    thresholds: Record<string, number>;
  }) => Promise<void> | void;
}

export function GoalsSchedulePanel({ onSave }: GoalsSchedulePanelProps) {
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [practiceDays, setPracticeDays] = useState(INITIAL_DAYS);
  const [reminderTime, setReminderTime] = useState("18:00");
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [initial] = useState({
    weeklyGoal: 4,
    practiceDays: INITIAL_DAYS,
    reminderTime: "18:00",
    thresholds: INITIAL_THRESHOLDS,
  });
  const [saving, setSaving] = useState(false);

  const isDirty =
    weeklyGoal !== initial.weeklyGoal ||
    reminderTime !== initial.reminderTime ||
    DAYS.some((d) => practiceDays[d.id] !== initial.practiceDays[d.id]) ||
    THRESHOLD_FORMATS.some((f) => thresholds[f.id] !== initial.thresholds[f.id]);

  const selectedDayCount = DAYS.filter((d) => practiceDays[d.id]).length;

  function toggleDay(id: string) {
    setPracticeDays((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setThreshold(id: string, value: number) {
    const clamped = Math.min(100, Math.max(0, value));
    setThresholds((prev) => ({ ...prev, [id]: clamped }));
  }

  function handleDiscard() {
    setWeeklyGoal(initial.weeklyGoal);
    setPracticeDays(initial.practiceDays);
    setReminderTime(initial.reminderTime);
    setThresholds(initial.thresholds);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave?.({ weeklyGoal, practiceDays, reminderTime, thresholds });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Goals & Schedule</h2>
        <p className="mt-1 text-sm text-slate-400">
          Set your practice goals and let us know when to remind you.
        </p>

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
                  onClick={() => setWeeklyGoal((v) => Math.max(1, v - 1))}
                  className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:text-[var(--color-ink)]"
                  aria-label="Decrease weekly goal"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[var(--color-ink)]">
                  {weeklyGoal}
                </span>
                <button
                  type="button"
                  onClick={() => setWeeklyGoal((v) => Math.min(14, v + 1))}
                  className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:text-[var(--color-ink)]"
                  aria-label="Increase weekly goal"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-slate-400">
                {weeklyGoal === 1 ? "session" : "sessions"} / week
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
                  const selected = practiceDays[day.id];
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
                      value={thresholds[format.id]}
                      onChange={(e) =>
                        setThreshold(format.id, Number(e.target.value))
                      }
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
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
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