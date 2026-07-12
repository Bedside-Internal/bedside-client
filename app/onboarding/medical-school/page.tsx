import Image from "next/image";
import { FormatSelector } from "@/components/onboarding/FormatSelector";
import { NurseIllustration } from "@/components/onboarding/Illustrations/NurseIllustration";
import { saveTrack } from "@/lib/actions";
import { getFeatures, toTrackId } from "@/lib/features";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SessionBar } from "@/components/onboarding/SessionBar";

export default async function MedicalSchoolFormatPage() {
    const [, formats] = await Promise.all([
        saveTrack("medical-school"),
        getFeatures("format", toTrackId("medical-school")),
    ]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50">
            <Image
                src="/images/medical_school.jpg"
                alt=""
                fill
                priority={false}
                className="pointer-events-none z-0 object-cover opacity-20"
            />
            <div className="relative z-10 flex justify-end px-6 py-4">
                <SessionBar />
            </div>

            <NurseIllustration className="pointer-events-none absolute bottom-6 left-6 z-10 hidden h-auto w-40 lg:block" />

            <main className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col justify-center px-4 py-10">
                <div className="mb-8 min-w-0 text-center">
                    <OnboardingHeader
                        className="mb-8"
                        eyebrow="Medical School Interview"
                        eyebrowClassName="uppercase tracking-wide"
                        title="Which format are you preparing for?"
                        subtitle="Select one to get started"
                    />
                </div>

                <FormatSelector track="medical-school" formats={formats} />
            </main>
        </div>
    );
}