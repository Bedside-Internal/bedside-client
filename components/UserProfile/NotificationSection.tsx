"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "daily-practice",
    title: "Daily practice reminder",
    description: "Remind me to practise each day at my preferred time",
    enabled: true,
  },
  {
    id: "streak",
    title: "Streak reminders",
    description: "Alert me before I lose my daily streak",
    enabled: true,
  },
  {
    id: "weekly-summary",
    title: "Weekly progress summary",
    description: "Email me a weekly summary of my practice scores",
    enabled: false,
  },
  {
    id: "new-resources",
    title: "New resources available",
    description: "Notify me when new guides or videos are added to the library",
    enabled: false,
  },
];

interface NotificationsPanelProps {
  onSave?: (settings: Record<string, boolean>) => Promise<void> | void;
}

export function NotificationsPanel({ onSave }: NotificationsPanelProps) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [initial] = useState(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);

  const isDirty = settings.some((s, i) => s.enabled !== initial[i].enabled);

  function toggle(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function handleDiscard() {
    setSettings(initial);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave?.(Object.fromEntries(settings.map((s) => [s.id, s.enabled])));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Notifications</h2>
        <p className="mt-1 text-sm text-slate-400">
          Control what the app reminds you about and how.
        </p>

        <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between gap-4 px-4 py-4"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {setting.title}
                </p>
                <p className="text-sm text-slate-400">{setting.description}</p>
              </div>
              <Switch
                checked={setting.enabled}
                onChange={() => toggle(setting.id)}
                label={`Toggle ${setting.title}`}
              />
            </div>
          ))}
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