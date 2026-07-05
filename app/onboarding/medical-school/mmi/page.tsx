import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import {
    ArrowRight,
    CheckCircle2,
    MessageSquare,
    GitFork,
    Users,
    Share2,
    User,
} from "lucide-react";

import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StationCard } from "@/components/onboarding/StationCard";

const STATIONS = [
    {
        icon: CheckCircle2,
        title: "Ethical Reasoning",
        description:
            "Navigate moral dilemmas in clinical and social contexts with structured frameworks",
        totalQuestions: 24,
        completedQuestions: 8,
        href: "/mmi/ethical-reasoning",
    },
    {
        icon: MessageSquare,
        title: "Communication",
        description:
            "Demonstrate empathy, active listening, and clear articulation under pressure",
        totalQuestions: 18,
        completedQuestions: 0,
        href: "/mmi/communication",
    },
    {
        icon: GitFork,
        title: "Critical Thinking",
        description:
            "Analyse complex scenarios, weigh evidence, and reason to well-structured conclusions",
        totalQuestions: 20,
        completedQuestions: 5,
        href: "/mmi/critical-thinking",
    },
    {
        icon: Users,
        title: "Role Play",
        description:
            "Act as a physician or peer in live scenarios — de-escalate, counsel, and connect",
        totalQuestions: 16,
        completedQuestions: 0,
        href: "/mmi/role-play",
    },
    {
        icon: Share2,
        title: "Collaboration",
        description:
            "Work with a confederate or team to solve a shared problem under observation",
        totalQuestions: 14,
        completedQuestions: 12,
        href: "/mmi/collaboration",
    },
    {
        icon: User,
        title: "Personal & Reflective",
        description:
            "Speak to your motivations, background, and growth with authentic self-awareness",
        totalQuestions: 22,
        completedQuestions: 3,
        href: "/mmi/personal-reflective",
    },
];

export default function MmiPage() {
    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 -z-20 bg-[var(--color-sand)]" />
            <Image
                src="/images/mmi.png"
                alt=""
                fill
                priority={false}
                className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-20"
            />
            <div className="flex items-center justify-between px-6 py-5">
                <BreadcrumbNav
                    items={[
                        { label: "Medical School Interview", href: "/onboarding/medical-school" },
                        { label: "MMI" },
                    ]}
                />
                <UserButton />
            </div>

            <div className="mx-auto max-w-6xl px-6 pb-28 pt-4">
                <OnboardingHeader
                    eyebrow="Multiple Mini Interview"
                    title="Practice your stations"
                    subtitle="8-minute timed scenarios across 6 core station types; pick one to drill or run a full circuit"
                />

                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {STATIONS.map((station) => (
                        <StationCard key={station.title} {...station} />
                    ))}
                </div>
            </div>

            <div className="mx-auto -mt-16 flex max-w-6xl justify-end px-6 pb-10">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(26,26,26,0.08)] transition hover:bg-[var(--color-sand)]"
                    >
                        Practice a specific station
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1 rounded-xl bg-[var(--color-mint)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_20px_rgba(59,186,156,0.35)] transition hover:bg-[var(--color-mint-hover)]"
                    >
                        Start a full circuit
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}