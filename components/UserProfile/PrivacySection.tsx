"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/Switch";

/**
 * Privacy settings. Currently one switch: whether anonymized session
 * recordings (Microsoft Clarity) are allowed.
 */
export function PrivacyPanel() {
    const { isLoaded, user } = useUser();

    const savedAllow = user?.unsafeMetadata?.analyticsOptOut !== true;
    // null = "no unsaved change", so we always fall back to what Clerk has saved
    const [draft, setDraft] = useState<boolean | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allow = draft ?? savedAllow;
    const isDirty = draft !== null && draft !== savedAllow;

    async function handleSave() {
        if (!user || draft === null) return;
        setSaving(true);
        setError(null);
        try {
            await user.update({
                // spread so we don't wipe any other unsafeMetadata keys
                unsafeMetadata: { ...user.unsafeMetadata, analyticsOptOut: !draft },
            });
            setDraft(null);
            toast.success("Privacy settings saved");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to save privacy settings";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400">Loading…</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-1 py-1">
                <h2 className="text-xl font-bold text-[var(--color-ink)]">Privacy</h2>
                <p className="mt-1 text-sm text-slate-400">
                    Control how your usage is measured to help us improve the app.
                </p>

                {error && (
                    <p className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-coral)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-coral)]">
                        {error}
                    </p>
                )}

                <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between gap-6 px-4 py-4">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-ink)]">
                                Anonymous session recordings
                            </p>
                            <p className="mt-0.5 text-sm text-slate-400">
                                Helps us see where people get stuck, using Microsoft Clarity. Your
                                answers and personal details are masked.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Switch
                                checked={allow}
                                onChange={() => setDraft(!allow)}
                                label="Toggle anonymous session recordings"
                            />
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                    Changes apply the next time you visit.
                </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={() => setDraft(null)}
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