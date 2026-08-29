import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import { DevResetOnboardingButton } from "@/components/ui/Devresetonboarding";
import { SomeComponent } from "@/components/ui/Tokenretrieval";
import DesktopOnlyGate from "@/components/layout/DesktopOnlyGate";
import { ReferralAttribution } from "@/components/referrals/ReferralAttribution";

export const metadata: Metadata = {
  title: "BedSide — Stop guessing how you'd do. Find out.",
  description: "Unlimited mock interviews in every med school format: MMI, panel, traditional, CASPer, and more.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
          <ReferralAttribution />
          <CustomCursor />
          <SomeComponent />
          <DevResetOnboardingButton />
          <DesktopOnlyGate>{children}</DesktopOnlyGate>
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  );
}