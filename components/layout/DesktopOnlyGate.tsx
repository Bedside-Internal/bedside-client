"use client";

import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PHONE_MEDIA_QUERY, isMobileReadyPath } from "@/lib/mobile-routes";
import DesktopOnlyMessage from "@/components/layout/DesktopOnlyMessage";

/**
 * Blocks phones on routes that aren't mobile-ready.
 * Which routes are ready is decided in lib/mobile-routes.ts.
 */
export default function DesktopOnlyGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPhone = useMediaQuery(PHONE_MEDIA_QUERY);
  const pathname = usePathname();

  if (isPhone && !isMobileReadyPath(pathname)) {
    return <DesktopOnlyMessage />;
  }

  return <>{children}</>;
}