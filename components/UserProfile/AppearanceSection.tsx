"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/Switch";

type Theme = "light" | "dark" | "system";

const THEMES: { id: Theme; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

function ThemePreview({ theme }: { theme: Theme }) {
  if (theme === "system") {
    return (
      <div className="flex h-24 w-full">
        <div className="flex flex-1 flex-col justify-center gap-1.5 bg-slate-50 px-3">
          <div className="h-1.5 w-3/4 rounded bg-slate-200" />
          <div className="h-1.5 w-1/2 rounded bg-slate-200" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5 bg-[#0a0a0a] px-3">
          <div className="h-1.5 w-3/4 rounded bg-slate-600" />
          <div className="h-1.5 w-1/2 rounded bg-slate-600" />
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";
  return (
    <div
      className={`flex h-24 w-full flex-col justify-center gap-1.5 px-3 ${
        isDark ? "bg-[#0a0a0a]" : "bg-slate-50"
      }`}
    >
      <div className={`h-1.5 w-3/4 rounded ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
      <div className={`h-1.5 w-1/2 rounded ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
      <div className={`mt-1 h-4 w-2/3 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
    </div>
  );
}

interface AppearancePanelProps {
  onSave?: (data: {
    theme: Theme;
    compactMode: boolean;
    reduceAnimations: boolean;
  }) => Promise<void> | void;
}

export function AppearancePanel({ onSave }: AppearancePanelProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [compactMode, setCompactMode] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [initial] = useState({ theme, compactMode, reduceAnimations });
  const [saving, setSaving] = useState(false);

  const isDirty =
    theme !== initial.theme ||
    compactMode !== initial.compactMode ||
    reduceAnimations !== initial.reduceAnimations;

  function handleDiscard() {
    setTheme(initial.theme);
    setCompactMode(initial.compactMode);
    setReduceAnimations(initial.reduceAnimations);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave?.({ theme, compactMode, reduceAnimations });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Appearance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Adjust how the app looks and feels.
        </p>

        <div className="mt-6 border-t border-slate-100">
          <div className="border-b border-slate-100 py-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">Theme</p>
            <p className="mt-1 text-sm text-slate-400">
              Choose how the interface appears to you.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {THEMES.map((t) => {
                const selected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`overflow-hidden rounded-xl border-2 text-left transition ${
                      selected
                        ? "border-[var(--color-mint)]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <ThemePreview theme={t.id} />
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        {t.label}
                      </span>
                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-mint)]">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">Layout density</p>
            <p className="mt-1 text-sm text-slate-400">
              Control how compact the interface feels.
            </p>
            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    Compact mode
                  </p>
                  <p className="text-sm text-slate-400">
                    Reduce padding and spacing throughout the app
                  </p>
                </div>
                <Switch
                  checked={compactMode}
                  onChange={() => setCompactMode((v) => !v)}
                  label="Toggle compact mode"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    Reduce animations
                  </p>
                  <p className="text-sm text-slate-400">
                    Minimise motion for transitions and feedback
                  </p>
                </div>
                <Switch
                  checked={reduceAnimations}
                  onChange={() => setReduceAnimations((v) => !v)}
                  label="Toggle reduce animations"
                />
              </div>
            </div>
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