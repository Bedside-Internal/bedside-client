interface ScenarioPanelProps {
    text: string;
    videoUrl?: string | null;
    footerHint?: string;
    children?: React.ReactNode;
}

export function ScenarioPanel({ text, videoUrl, footerHint, children }: ScenarioPanelProps) {
    return (
        <div className="flex flex-1 flex-col justify-between">
            <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-ink)]/45">
                    {videoUrl ? "VIDEO SCENARIO" : "SCENARIO"}
                </span>
                {videoUrl && (
                    <video
                        controls
                        src={videoUrl}
                        className="mt-4 w-full rounded-xl bg-black"
                    />
                )}
                <p className="mt-4 whitespace-pre-line text-2xl leading-snug text-[var(--color-ink)]">
                    {text}
                </p>
                {children}
            </div>
            {footerHint && (
                <div className="mt-10 flex items-start gap-3 rounded-xl bg-[var(--color-sand)] px-5 py-4 text-sm text-[var(--color-ink)]/60">
                    {footerHint}
                </div>
            )}
        </div>
    );
}