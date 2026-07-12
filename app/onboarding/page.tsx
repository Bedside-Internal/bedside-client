import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stethoscope, GraduationCap, Users, ClipboardList } from "lucide-react";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { SelectableCard } from "@/components/onboarding/SelectableCard";
import { HandshakeIllustration } from "@/components/onboarding/Illustrations/HandshakeIllustration";
import { ChecklistIllustration } from "@/components/onboarding/Illustrations/ChecklistIllustration";
import { getOnboardingProgress } from "@/lib/actions";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

const tracks = [
  {
    id: "medical-school",
    icon: Stethoscope,
    title: "Medical School Interview",
    subtitle: "MD/DO · Traditional, MMI, CASPer, PREview",
    href: "/onboarding/medical-school",
  },
  {
    id: "college",
    icon: GraduationCap,
    title: "College / University Interview",
    subtitle: "Coming soon",
    disabled: true,
  },
  {
    id: "residency",
    icon: Users,
    title: "Residency Interview",
    subtitle: "Coming soon",
    disabled: true,
  },
  {
    id: "job",
    icon: ClipboardList,
    title: "Job Interview",
    subtitle: "Coming soon",
    disabled: true,
  },
];

export default async function OnboardingPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <SessionBar />

      <main className="relative flex min-h-[calc(100vh-48px)] items-center justify-center overflow-hidden px-4">
        <HandshakeIllustration className="pointer-events-none absolute bottom-24 left-6 hidden h-auto w-56 lg:block" />
        <ChecklistIllustration className="pointer-events-none absolute bottom-24 right-6 hidden h-auto w-56 lg:block" />

        <div className="w-full min-w-0 max-w-xl py-16 text-center">
          <OnboardingHeader
            eyebrow={`Welcome ${firstName}`}
            title="What are you preparing for?"
            subtitle="One workspace. All your interview prep."
            subtitleClassName="mb-10"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={track.disabled ? "" : "sm:col-span-2"}
              >
                <SelectableCard
                  variant="horizontal"
                  icon={track.icon}
                  title={track.title}
                  description={track.subtitle}
                  href={track.href}
                  disabled={track.disabled}
                />
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-300">
            Switch tracks anytime in your dashboard
          </p>
        </div>
      </main>
    </div>
  );
}