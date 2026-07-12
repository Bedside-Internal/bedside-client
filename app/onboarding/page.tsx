import { currentUser } from "@clerk/nextjs/server";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { SelectableCard } from "@/components/onboarding/SelectableCard";
import { HandshakeIllustration } from "@/components/onboarding/Illustrations/HandshakeIllustration";
import { ChecklistIllustration } from "@/components/onboarding/Illustrations/ChecklistIllustration";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { getFeatures } from "@/lib/features";
import { resolveIcon } from "@/lib/iconRegistry";
import { redirect } from "next/navigation";
import { getOnboardingProgress } from "@/lib/actions";

const validTracks = ["medical-school", "dental-school", /* ... */];

export default async function OnboardingPage() {
  const progress = await getOnboardingProgress();
  if (progress?.track && progress?.format) {
    redirect("/dashboard");
  }
  if (progress?.track && validTracks.includes(progress.track)) {
    redirect(`/onboarding/${progress.track}`);
  }

  const user = await currentUser();
  
  const firstName = user?.firstName ?? "there";
  

  // Already sorted by `order` server-side. Unavailable tracks are included
  // (not filtered out) — they render as visible-but-disabled "coming soon"
  // cards, same as the old hardcoded array.
  const tracks = await getFeatures("track");

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
                key={track.key}
                className={track.available ? "sm:col-span-2" : ""}
              >
                <SelectableCard
                  variant="horizontal"
                  icon={resolveIcon(track.icon)}
                  title={track.title}
                  description={track.subtitle}
                  href={track.available ? track.href ?? undefined : undefined}
                  disabled={!track.available}
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