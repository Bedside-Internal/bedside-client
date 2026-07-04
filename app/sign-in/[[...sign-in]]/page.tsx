// app/sign-in/[[...sign-in]]/page.tsx
// (Clerk's catch-all route convention — adjust the path to match your router setup)

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full bg-black">
      <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden bg-neutral-950 px-10 py-10 lg:flex">
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-40 w-40 rounded-full border border-white/5" />

        <span className="text-sm text-neutral-400">Login</span>

        <div className="relative z-10 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Good to have
            <br />
            you back.
          </h1>
          <p className="max-w-xs text-sm text-neutral-400">
            Your prep doesn&apos;t stop. Neither should you. Pick up right
            where you left off.
          </p>
        </div>

        <p className="relative z-10 text-xs text-neutral-500">
          Over <span className="font-semibold text-emerald-400">4,200 applicants</span>{" "}
          used PrepPath to ace their interviews last cycle.
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('/images/boardroom-sketch.jpg')" }}
        />
        <div className="relative z-10">
          <SignIn
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