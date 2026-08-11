"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Switch } from "@/components/ui/Switch";
import { toast } from "sonner";

// Same pattern as page.tsx's getDashboardData — the API may not be same-origin.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Mirrors the backend's notificationSettingsSchema shape:
 * { "daily-practice": boolean, streak: boolean, "weekly-summary": boolean, "new-resources": boolean }
 */
interface NotificationSettingsInput {
  "daily-practice": boolean;
  streak: boolean;
  "weekly-summary": boolean;
  "new-resources": boolean;
}

interface NotificationSetting {
  id: keyof NotificationSettingsInput;
  title: string;
  description: string;
  enabled: boolean;
}

const SETTINGS_META: Omit<NotificationSetting, "enabled">[] = [
  {
    id: "daily-practice",
    title: "Daily practice reminder",
    description: "Remind me to practise each day at my preferred time",
  },
  {
    id: "streak",
    title: "Streak reminders",
    description: "Alert me before I lose my daily streak",
  },
  {
    id: "weekly-summary",
    title: "Weekly progress summary",
    description: "Email me a weekly summary of my practice scores",
  },
  {
    id: "new-resources",
    title: "New resources available",
    description: "Notify me when new guides or videos are added to the library",
  },
];

const DEFAULT_ENABLED: NotificationSettingsInput = {
  "daily-practice": true,
  streak: true,
  "weekly-summary": false,
  "new-resources": false,
};

/** Type guard matching the backend schema: every key present and boolean. */
function isNotificationSettingsInput(value: unknown): value is NotificationSettingsInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["daily-practice"] === "boolean" &&
    typeof v["streak"] === "boolean" &&
    typeof v["weekly-summary"] === "boolean" &&
    typeof v["new-resources"] === "boolean"
  );
}

function buildSettings(enabledMap: NotificationSettingsInput): NotificationSetting[] {
  return SETTINGS_META.map((meta) => ({
    ...meta,
    enabled: enabledMap[meta.id],
  }));
}

function toEnabledMap(settings: NotificationSetting[]): NotificationSettingsInput {
  return {
    "daily-practice": settings.find((s) => s.id === "daily-practice")!.enabled,
    streak: settings.find((s) => s.id === "streak")!.enabled,
    "weekly-summary": settings.find((s) => s.id === "weekly-summary")!.enabled,
    "new-resources": settings.find((s) => s.id === "new-resources")!.enabled,
  };
}

interface NotificationsPanelProps {
  onSave?: (settings: NotificationSettingsInput) => Promise<void> | void;
}

export function NotificationsPanel({ onSave }: NotificationsPanelProps) {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting[]>(
    buildSettings(DEFAULT_ENABLED)
  );
  const [initial, setInitial] = useState<NotificationSetting[]>(
    buildSettings(DEFAULT_ENABLED)
  );
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
        const res = await fetch(`${API_BASE_URL}/api/settings/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to load notifications (${res.status})`);
        }
        const json = await res.json();
        if (cancelled) return;

        if (!isNotificationSettingsInput(json)) {
          throw new Error("Notification settings response did not match expected shape");
        }
        const built = buildSettings(json);
        setSettings(built);
        setInitial(built);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load notifications");
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

  const isDirty = settings.some((s, i) => s.enabled !== initial[i].enabled);

  function toggle(id: NotificationSetting["id"]) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function handleDiscard() {
    setSettings(initial);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = toEnabledMap(settings);
      const res = await fetch(`${API_BASE_URL}/api/settings/notification`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed to save notifications (${res.status})`);
      }
      const json = await res.json().catch(() => payload);
      const built = buildSettings(isNotificationSettingsInput(json) ? json : payload);
      setSettings(built);
      setInitial(built);
      toast.success("Notification settings saved");
      await onSave?.(toEnabledMap(built));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save notifications";
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
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Notifications</h2>
        <p className="mt-1 text-sm text-slate-400">
          Control what the app reminds you about and how.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-coral)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-coral)]">
            {error}
          </p>
        )}

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