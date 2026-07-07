"use client";

import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/Switch";

interface InterviewFormat {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const INITIAL_FORMATS: InterviewFormat[] = [
  { id: "mmi", title: "MMI", description: "Multiple Mini Interview", enabled: true },
  { id: "casper", title: "CASPer", description: "Situational Judgment Test", enabled: true },
  { id: "preview", title: "PREview", description: "Professional Readiness Evaluation", enabled: false },
];

function daysAway(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return diff;
}

/** A single labeled row, mirroring Clerk's own <UserProfile /> row layout. */
function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-100 py-6 first:pt-0 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-6">
      <div>
        <p className="text-sm font-medium text-[var(--color-ink)]">{label}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

interface InterviewSetupPanelProps {
  onSave?: (data: {
    interviewDate: string;
    formats: Record<string, boolean>;
    school: string;
  }) => Promise<void> | void;
}

export function InterviewSetupPanel({ onSave }: InterviewSetupPanelProps) {
  const [interviewDate, setInterviewDate] = useState("2025-09-15");
  const [formats, setFormats] = useState(INITIAL_FORMATS);
  const [school, setSchool] = useState("");
  const [initial] = useState({ interviewDate, formats: INITIAL_FORMATS, school: "" });
  const [saving, setSaving] = useState(false);

  const remaining = useMemo(() => daysAway(interviewDate), [interviewDate]);

  const isDirty =
    interviewDate !== initial.interviewDate ||
    school !== initial.school ||
    formats.some((f, i) => f.enabled !== initial.formats[i].enabled);

  function toggleFormat(id: string) {
    setFormats((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  }

  function handleDiscard() {
    setInterviewDate(initial.interviewDate);
    setFormats(initial.formats);
    setSchool(initial.school);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave?.({
        interviewDate,
        formats: Object.fromEntries(formats.map((f) => [f.id, f.enabled])),
        school,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-cream)]">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Interview Setup</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tell us about your upcoming interview so we can personalise your prep.
        </p>

        <div className="mt-6 border-t border-slate-100">
          <Row
            label="Interview date"
            description="We'll use this to calculate your countdown."
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-mint)]"
              />
              {remaining !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-mint)_12%,transparent)] px-3 py-1 text-sm font-medium text-[var(--color-mint-hover)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]" />
                  {remaining < 0
                    ? `${Math.abs(remaining)} days ago`
                    : remaining === 0
                      ? "Today"
                      : `${remaining} days away`}
                </span>
              )}
            </div>
          </Row>

          <Row
            label="Interview formats"
            description="Which formats does your interview include?"
          >
            <div className="divide-y divide-slate-100">
              {formats.map((format) => (
                <div
                  key={format.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      {format.title}
                    </p>
                    <p className="text-sm text-slate-400">{format.description}</p>
                  </div>
                  <Switch
                    checked={format.enabled}
                    onChange={() => toggleFormat(format.id)}
                    label={`Toggle ${format.title}`}
                  />
                </div>
              ))}
            </div>
          </Row>

          <Row
            label="School or program"
            description="Optional — helps tailor content to your school's format."
          >
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. University of Toronto, McMaster University…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-slate-300 outline-none focus:border-[var(--color-mint)] sm:max-w-sm"
            />
          </Row>
        </div>
      </div>

      {/* Save bar */}
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