import Image from "next/image";
import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { CircuitIntro } from "@/components/circuit/CircuitIntro";
import { getCircuitPreview } from "@/lib/api/circuit";

export default async function PreviewFullMockIntroPage() {
  const preview = await getCircuitPreview("preview");

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
            { label: "PREview", href: "/onboarding/medical-school/format-preview" },
            { label: "Full Mock" },
          ]}
        />
        <SessionBar />
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 pb-16 pt-6">
        <CircuitIntro
          preview={preview}
          formatSlug="preview"
          basePath="/preview/full"
          copy={{
            eyebrow: "Writing Room",
            titlePrefix: "Your",
            titleAccent: "PREview",
            accentColorVar: "--color-amber",
            unitLabel: "prompts",
            backHref: "/dashboard",
            howItWorks: [
              "30 seconds to read each prompt before recording starts.",
              "One take per prompt, up to 3 minutes — this is a one-way video response, just like the real thing.",
              "Once you submit a response you can't re-record it.",
            ],
          }}
        />
      </main>
    </div>
  );
}