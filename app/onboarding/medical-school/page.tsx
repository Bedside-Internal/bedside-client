import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { FormatSelector } from "@/components/onboarding/FormatIllustrator";
import { NurseIllustration } from "@/components/onboarding/Illustrations/NurseIllustration";

export default function MedicalSchoolFormatPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50">
            <Image
                src="/images/medical_school.jpg"
                alt=""
                fill
                priority={false}
                className="pointer-events-none z-0 object-cover opacity-18"
            />
            <div className="relative z-10 flex justify-end px-6 py-4">
                <UserButton />
            </div>

            <NurseIllustration className="pointer-events-none absolute bottom-6 left-6 z-10 hidden h-auto w-40 lg:block" />

            <main className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col justify-center px-4 py-10">
                <div className="mb-8 min-w-0 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
                        Medical School Interview
                    </p>
                    <h1 className="mb-2 font-serif text-4xl font-bold text-slate-900 sm:text-5xl">
                        Which format are you preparing for?
                    </h1>
                    <p className="text-slate-400">Select one to get started</p>
                </div>

                <FormatSelector />
            </main>
        </div>
    );
}