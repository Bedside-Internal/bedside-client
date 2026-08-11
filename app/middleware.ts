import { NextRequest, NextResponse } from "next/server";

// Covers phones. iPads on modern Safari report as "Macintosh" by default,
// so they intentionally fall through here and get caught by the lg:hidden
// CSS gate in DesktopOnlyGate instead — same reasoning as the lg breakpoint.
const MOBILE_UA = /Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const { pathname } = request.nextUrl;

  if (MOBILE_UA.test(ua) && pathname !== "/desktop-only") {
    const url = request.nextUrl.clone();
    url.pathname = "/desktop-only";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets, images, and the desktop-only page itself
  // (avoid a redirect loop and don't waste a middleware invocation on assets).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|desktop-only).*)"],
};