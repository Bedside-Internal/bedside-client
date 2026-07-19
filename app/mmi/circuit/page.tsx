import Image from "next/image";
import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { CircuitIntro } from "@/components/mmi/CircuitIntro";
import { getCircuitPreview } from "@/lib/api/circuit";

export default async function CircuitIntroPage() {
  const preview = await getCircuitPreview();

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
            { label: "MMI", href: "/onboarding/medical-school/format-mmi" },
            { label: "Full Circuit" },
          ]}
        />
        <SessionBar />
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 pb-16 pt-6">
        <CircuitIntro preview={preview} />
      </main>
    </div>
  );
}