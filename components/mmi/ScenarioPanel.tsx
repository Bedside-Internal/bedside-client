interface ScenarioPanelProps {
    text: string;
    footerHint?: string;
}

export function ScenarioPanel({ text, footerHint }: ScenarioPanelProps) {
    return (
        <div className="flex h-full flex-col justify-between">
            <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-ink)]/45">
                    SCENARIO
                </span>
                <p className="mt-4 whitespace-pre-line text-2xl leading-snug text-[var(--color-ink)]">
                    {text}
                </p>
            </div>

            {footerHint && (
                <div className="mt-10 flex items-start gap-3 rounded-xl bg-[var(--color-sand)] px-5 py-4 text-sm text-[var(--color-ink)]/60">
                    {footerHint}
                </div>
            )}
        </div>
    );
}