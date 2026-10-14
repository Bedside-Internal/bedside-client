import Link from "next/link";

/**
 * Shown on phones for routes that aren't mobile-ready yet (currently the
 * practice runners). Shared by DesktopOnlyGate and the /desktop-only page.
 */
export default function DesktopOnlyMessage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-[2.5px] border-ink bg-mint">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="2" y="4" width="20" height="13" rx="1.5" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      </div>
      <h1 className="mb-3 font-display text-[32px] leading-tight tracking-tighter text-ink">
        Best on desktop
      </h1>
      <p className="mb-8 max-w-[320px] text-[15px] leading-relaxed text-neutral-500">
        CASPer needs a bigger screen for now. You can still practice MMI and
        PREview (single stations or full circuits), manage your questions, and
        check your dashboard from your phone.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md border-[2.5px] border-ink bg-mint px-6 py-3 text-sm font-bold text-ink shadow-hard-sm transition-[box-shadow,transform] duration-[120ms] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
