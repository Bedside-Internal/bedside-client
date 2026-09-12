import Image from "next/image";
import { BreadcrumbNav } from "@/components/onboarding/BreadcrumbNav";
import { SessionBar } from "@/components/onboarding/SessionBar";
import { CircuitIntro } from "@/components/circuit/CircuitIntro";
import { getCircuitPreview } from "@/lib/api/circuit";

export default async function CasperFullMockIntroPage() {
    const preview = await getCircuitPreview("casper");

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 -z-20 bg-[var(--color-sand)]" />
            <Image
                src="/images/casper.png"
                alt=""
                fill
                priority={false}
                className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-20"
            />
            <div className="flex items-center justify-between px-6 py-5">
                <BreadcrumbNav
                    items={[
                        { label: "Medical School Interview", href: "/onboarding/medical-school" },
                        { label: "CASPer", href: "/onboarding/medical-school/format-casper" },
                        { label: "Full Mock" },
                    ]}
                />
                <SessionBar />
            </div>

            <main className="mx-auto flex max-w-md flex-col items-center px-4 pb-16 pt-6">
                <CircuitIntro
                    preview={preview}
                    formatSlug="casper"
                    basePath="/casper/full"
                    copy={{
                        eyebrow: "Situational Judgement",
                        titlePrefix: "Your",
                        titleAccent: "CASPer",
                        accentColorVar: "--color-violet",
                        unitLabel: "prompts",
                        backHref: "/dashboard",
                        howItWorks: [
                            "Some scenarios include a short video; therefore, watch it before responding.",
                            "Each scenario's questions share one timer, so answer all of them before it runs out.",
                            "Once the timer ends or you submit, you move on automatically; no going back.",
                        ],
                    }}
                />
            </main>
        </div>
    );
}