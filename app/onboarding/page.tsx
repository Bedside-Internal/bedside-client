import { currentUser } from "@clerk/nextjs/server";
import { Stethoscope, GraduationCap, Users, ClipboardList } from "lucide-react";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { TrackCard } from "@/components/onboarding/TrackCard";
import { HandshakeIllustration } from "@/components/onboarding/Illustrations/HandshakeIllustration";
import { ChecklistIllustration } from "@/components/onboarding/Illustrations/ChecklistIllustration";

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
    //subtitle: "Ivy League · honors programs · scholarships",
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
          <p className="mb-2 text-sm font-semibold text-emerald-600">
            Welcome {firstName}
          </p>
          <h1 className="mb-2 font-serif text-4xl font-bold text-slate-900 sm:text-5xl">
            What are you preparing for?
          </h1>
          <p className="mb-10 text-slate-400">
            One workspace. All your interview prep.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={track.disabled ? "" : "sm:col-span-2"}
              >
                <TrackCard {...track} />
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-300">
            Switch tracks anytime from the sidebar
          </p>
        </div>
      </main>
    </div>
  );
}