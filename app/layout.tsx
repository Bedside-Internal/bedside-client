import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import { DevResetOnboardingButton } from "@/components/ui/Devresetonboarding";
import { SomeComponent } from "@/components/ui/Tokenretrieval";

export const metadata: Metadata = {
  title: "PrepAce — Stop guessing how you'd do. Find out.",
  description:
    "Unlimited mock interviews in every med school format: MMI, panel, traditional, CASPer, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans bg-cream text-ink">
        <ClerkProvider afterSignOutUrl="/sign-in">
            <CustomCursor />
            <SomeComponent />
            <DevResetOnboardingButton />
            {children}
          </ClerkProvider>
      </body>
    </html>
  );
}
