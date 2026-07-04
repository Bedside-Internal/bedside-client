import { SignUp } from "@clerk/nextjs";
import { poppins } from "@/lib/fonts";
import clsx from "clsx";
import { Check } from "lucide-react";

function OnboardingSteps() {
  const steps = [
    { label: "Create your account", status: "done" },
    { label: "Tell us about your interview", status: "current" },
    { label: "Start your first practice session", status: "upcoming" },
  ] as const;

  return (
    <ul className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3">
          <span
            className={clsx(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              step.status === "done" && "bg-emerald-500 text-neutral-950",
              step.status !== "done" &&
                "border border-neutral-700 text-neutral-500"
            )}
          >
            {step.status === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
          </span>
          <span
            className={clsx(
              "text-sm",
              step.status === "done" ? "text-white" : "text-neutral-500"
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full bg-black">
      <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden bg-neutral-950 px-10 py-10 lg:flex">
        <svg
          className="pointer-events-none absolute -bottom-48 -right-32 h-[500px] w-[500px]"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="250" cy="250" r="230" stroke="white" strokeOpacity="0.06" />
          <circle cx="250" cy="250" r="160" stroke="white" strokeOpacity="0.05" />
          <circle cx="250" cy="250" r="95" fill="green" fillOpacity="0.04" />
        </svg>

        <span className="text-sm text-neutral-400">Login</span>

        <div className="relative z-10 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Getting Started</p>
          <h1 className={clsx(poppins.className, "text-4xl font-bold leading-tight text-white")}>
            &quot;Tell us about yourself.&quot;
          </h1>
          <p className="max-w-xs text-sm text-neutral-400">
            Classic opener. Our job is to make sure you&apos;re ready when it counts.
          </p>
        </div>

        <div className="relative z-10">
          <OnboardingSteps />
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/background_login.png')" }}
        />
        <div className="relative z-10">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent p-0",
                headerTitle: "text-3xl font-bold text-neutral-900",
                headerSubtitle: "text-neutral-500",
                socialButtonsBlockButton:
                  "border border-neutral-200 rounded-xl py-3 hover:bg-neutral-50",
                dividerLine: "bg-neutral-200",
                dividerText: "text-neutral-400",
                formFieldLabel: "text-neutral-800 font-medium",
                formFieldInput:
                  "rounded-xl border-neutral-200 py-3 focus:border-emerald-500 focus:ring-emerald-500",
                footerActionLink: "text-emerald-600 hover:text-emerald-700",
                formButtonPrimary:
                  "bg-emerald-500 hover:bg-emerald-600 rounded-xl py-3 text-sm normal-case shadow-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}