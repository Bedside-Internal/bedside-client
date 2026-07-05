"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetOnboarding } from "@/lib/actions";

export function DevResetOnboardingButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // @ts-expect-error dev-only console helper
    window.resetOnboarding = async () => {
      await resetOnboarding();
      router.push("/onboarding");
      router.refresh();
      console.log("Onboarding reset — navigating to /onboarding");
    };
  }, [router]);

  if (process.env.NODE_ENV === "production") return null;

  function handleReset() {
    startTransition(async () => {
      await resetOnboarding();
      router.push("/onboarding");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={isPending}
      className="fixed bottom-4 right-4 z-[9999] rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-lg hover:bg-red-600 disabled:opacity-50"
    >
      {isPending ? "Resetting..." : "Reset onboarding (dev)"}
    </button>
  );
}