import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { ClerkProvider, Show, SignUpButton, UserButton } from '@clerk/nextjs'
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";

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
            {children}
          </ClerkProvider>
      </body>
    </html>
  );
}
