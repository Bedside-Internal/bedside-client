/**
 * What phones get to see, and what they can do there.
 *
 * Phone = touch-first and 768px wide or less. This one query is shared by the
 * route gate and by anything that restricts features on phones, so they can't
 * drift apart.
 */
export const PHONE_MEDIA_QUERY = "(pointer: coarse) and (max-width: 768px)";

/**
 * Audio/video answers on phones. Off until recording has been tested on real
 * iOS and Android devices (MediaRecorder format support, the file the server
 * receives, interruptions such as a call or a screen lock). While off, phones
 * only get the written composer. Flip this to true once that testing is done.
 */
export const MOBILE_RECORDING_ENABLED = false;

/**
 * Routes designed for phone-sized screens.
 *
 * Anything NOT listed here stays behind the desktop-only gate on phones (see
 * components/layout/DesktopOnlyGate.tsx). That keeps new or unreviewed routes
 * safe by default: add a prefix only after checking it on a real device.
 */
const MOBILE_READY_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/onboarding", // track, format and station select screens
  "/dashboard", // dashboard, /my-questions and /refer
  "/mmi", // single-station practice (full circuits are excluded below)
  "/preview", // single-station practice (full mock tests are excluded below)
  "/desktop-only",
  "/r", // referral redirect handler
] as const;

/** Carved out of the prefixes above, and checked first. */
const DESKTOP_ONLY_PREFIXES = [
  "/mmi/full", // timed multi-station circuit
  "/preview/full",
  "/casper", // video-response format
] as const;

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isMobileReadyPath(pathname: string): boolean {
  if (pathname === "/") return true; // landing page
  if (DESKTOP_ONLY_PREFIXES.some((prefix) => matches(pathname, prefix))) return false;
  return MOBILE_READY_PREFIXES.some((prefix) => matches(pathname, prefix));
}
