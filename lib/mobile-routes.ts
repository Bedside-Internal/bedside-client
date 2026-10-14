/**
 * Routes that have been designed for phone-sized screens.
 *
 * Anything NOT listed here stays behind the desktop-only gate on narrow,
 * touch-first viewports (see components/layout/DesktopOnlyGate.tsx). That keeps
 * new or unreviewed routes safe by default: add a prefix here only after the
 * route has been checked on a real device.
 *
 * Still desktop-only: the practice runners (/mmi, /casper, /preview, including
 * their /full circuit and results pages).
 */
const MOBILE_READY_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/onboarding", // track, format and station select screens
  "/dashboard", // dashboard, /my-questions and /refer
  "/desktop-only",
  "/r", // referral redirect handler
] as const;

export function isMobileReadyPath(pathname: string): boolean {
  if (pathname === "/") return true; // landing page
  return MOBILE_READY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
