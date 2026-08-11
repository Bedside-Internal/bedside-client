"use client";

import { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { toast } from "sonner";
import { useApiFetch } from "@/lib/api/use-api-fetch";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type FormatId = "mmi" | "casper" | "preview";

/** Mirrors the backend's interviewSetupSchema shape. */
interface InterviewSetupInput {
  interviewDate: string;
  formats: Record<FormatId, boolean>;
  school: string;
}

interface InterviewFormat {
  id: FormatId;
  title: string;
  description: string;
  enabled: boolean;
}

const FORMATS_META: Omit<InterviewFormat, "enabled">[] = [
  { id: "mmi", title: "MMI", description: "Multiple Mini Interview" },
  { id: "casper", title: "CASPer", description: "Situational Judgment Test" },
  { id: "preview", title: "PREview", description: "Professional Readiness Evaluation" },
];

const DEFAULT_DATA: InterviewSetupInput = {
  interviewDate: "2025-09-15",
  formats: { mmi: true, casper: true, preview: false },
  school: "",
};

const SCHOOL_MAX_LENGTH = 255;

/** Manual check matching the backend's interviewSetupSchema constraints. */
function isInterviewSetupInput(value: unknown): value is InterviewSetupInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  if (typeof v.interviewDate !== "string" || !DATE_REGEX.test(v.interviewDate)) {
    return false;
  }

  if (typeof v.school !== "string" || v.school.length > SCHOOL_MAX_LENGTH) {
    return false;
  }

  const formats = v.formats as Record<string, unknown> | undefined;
  if (
    !formats ||
    FORMATS_META.some((f) => typeof formats[f.id] !== "boolean")
  ) {
    return false;
  }

  return true;
}

function buildFormats(formats: InterviewSetupInput["formats"]): InterviewFormat[] {
  return FORMATS_META.map((meta) => ({ ...meta, enabled: formats[meta.id] }));
}

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
  onSave?: (data: InterviewSetupInput) => Promise<void> | void;
}

export function InterviewSetupPanel({ onSave }: InterviewSetupPanelProps) {
  const apiFetch = useApiFetch();
  const [data, setData] = useState<InterviewSetupInput>(DEFAULT_DATA);
  const [initial, setInitial] = useState<InterviewSetupInput>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const json = await apiFetch<unknown>("/api/settings/interview");
        if (cancelled) return;

        if (!isInterviewSetupInput(json)) {
          throw new Error("Interview setup response did not match expected shape");
        }
        setData(json);
        setInitial(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load interview setup"
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
  }, [apiFetch]);

  const formats = useMemo(() => buildFormats(data.formats), [data.formats]);
  const remaining = useMemo(() => daysAway(data.interviewDate), [data.interviewDate]);

  const isDirty =
    data.interviewDate !== initial.interviewDate ||
    data.school !== initial.school ||
    FORMATS_META.some((f) => data.formats[f.id] !== initial.formats[f.id]);

  function toggleFormat(id: FormatId) {
    setData((prev) => ({
      ...prev,
      formats: { ...prev.formats, [id]: !prev.formats[id] },
    }));
  }

  function handleDiscard() {
    setData(initial);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const json = await apiFetch<unknown>("/api/settings/interview", {
        method: "PUT",
        body: JSON.stringify(data),
      }).catch(() => data);
      const merged = isInterviewSetupInput(json) ? json : data;
      setData(merged);
      setInitial(merged);
      toast.success("Interview setup saved");
      await onSave?.(merged);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save interview setup";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-cream)]">
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-cream)]">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Interview Setup</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tell us about your upcoming interview so we can personalise your prep.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-coral)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-coral)]">
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-slate-100">
          <Row
            label="Interview date"
            description="We'll use this to calculate your countdown."
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={data.interviewDate}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, interviewDate: e.target.value }))
                }
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
              value={data.school}
              maxLength={SCHOOL_MAX_LENGTH}
              onChange={(e) => setData((prev) => ({ ...prev, school: e.target.value }))}
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