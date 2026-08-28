"use client";

import { useState } from "react";
import { Check, Copy, Users } from "lucide-react";
import { toast } from "sonner";
import type { TierUnlockStatus } from "@/lib/referrals/tierUnlockStatus";

interface ReferralCardProps {
    shareUrl: string;
    activatedCount: number;
    tiers: TierUnlockStatus[];
}

export function ReferralCard({ shareUrl, activatedCount, tiers }: ReferralCardProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy — copy it manually instead");
        }
    }

    return (
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)]">
                    <Users className="h-5 w-5 text-[var(--color-mint)]" strokeWidth={2} />
                </div>
                <div>
                    <p className="font-semibold text-[var(--color-ink)]">Invite friends, unlock access</p>
                    <p className="text-sm text-slate-400">
                        {activatedCount === 0
                            ? "Share your link — access is earned through referrals and testimonials, not payment."
                            : `${activatedCount} friend${activatedCount === 1 ? "" : "s"} joined so far.`}
                    </p>
                </div>
            </div>

            <div className="mb-6 flex items-center gap-2 rounded-xl border border-[var(--color-sand)] bg-[var(--color-sand)]/40 p-2 pl-4">
                <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-ink)]/70">{shareUrl}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-mint)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--color-mint-hover)]"
                >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy link"}
                </button>
            </div>

            <div className="space-y-3">
                {tiers.map((tier) => (
                    <TierRow key={tier.id} tier={tier} />
                ))}
            </div>
        </div>
    );
}

function TierRow({ tier }: { tier: TierUnlockStatus }) {
    const requirementLabels: string[] = [];
    if (tier.referralsRequired > 0) {
        requirementLabels.push(`${Math.min(tier.referralsHave, tier.referralsRequired)}/${tier.referralsRequired} referrals`);
    }
    if (tier.ownTestimonialRequired) requirementLabels.push("your testimonial");
    if (tier.referredTestimonialRequired) requirementLabels.push("a friend's testimonial");

    return (
        <div
            className={`flex items-center justify-between rounded-xl border px-4 py-3 ${tier.unlocked
                    ? "border-[var(--color-mint)]/30 bg-[var(--color-mint)]/5"
                    : "border-[var(--color-sand)] bg-white"
                }`}
        >
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{tier.title}</p>
                <p className="text-xs text-slate-400">{requirementLabels.join(" · ")}</p>
            </div>
            {tier.unlocked ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-mint)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--color-mint)]">
                    <Check className="h-3 w-3" /> Unlocked
                </span>
            ) : (
                <span className="shrink-0 text-xs font-medium text-slate-400">In progress</span>
            )}
        </div>
    );
}