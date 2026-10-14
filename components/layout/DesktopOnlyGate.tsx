"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isMobileReadyPath } from "@/lib/mobile-routes";
import DesktopOnlyMessage from "@/components/layout/DesktopOnlyMessage";

function useIsGenuinelyMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse) and (max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/**
 * Blocks phone-sized, touch-first viewports on routes that aren't mobile-ready.
 * Which routes are ready is decided in lib/mobile-routes.ts.
 */
export default function DesktopOnlyGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsGenuinelyMobile();
  const pathname = usePathname();

  if (isMobile && !isMobileReadyPath(pathname)) {
    return <DesktopOnlyMessage />;
  }

  return <>{children}</>;
}