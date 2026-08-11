export default function DesktopOnlyGate({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        {/* Real app — only rendered visible at lg and up */}
        <div className="hidden lg:block">{children}</div>
  
        {/* Blocking message — only visible below lg */}
        <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center lg:hidden">
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
            >
              <rect x="2" y="4" width="20" height="13" rx="1.5" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
          </div>
          <h1 className="mb-3 font-display text-[32px] leading-tight tracking-tighter text-ink">
            Best on desktop
          </h1>
          <p className="max-w-[320px] text-[15px] leading-relaxed text-neutral-500">
            We&apos;re still tuning the mobile experience. Open this on a laptop or
            desktop for now; full support is on the way!
          </p>
        </div>
      </>
    );
  }