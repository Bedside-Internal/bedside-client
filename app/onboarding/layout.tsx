import { redirect } from "next/navigation";
import { getOnboardingProgress } from "@/lib/actions";

const validTracks = ["medical-school", "dental-school", /* ... */];

export default async function OnboardingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const progress = await getOnboardingProgress();
  
    if (progress?.track && progress?.format) {
      redirect("/dashboard");
    }

    if (progress?.track && validTracks.includes(progress.track)) {
        redirect(`/onboarding/${progress.track}`);
    }
  
    return <>{children}</>;
  }