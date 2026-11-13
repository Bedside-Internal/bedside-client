"use client";

import Markdown from "react-markdown";
import { safeNotificationHref } from "@/lib/notifications/state";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]";

export function NotificationBody({ body }: { body: string }) {
    return (
        <div className="space-y-3 break-words text-sm leading-relaxed text-slate-600 [&_a]:text-[var(--color-ink)] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
            <Markdown
                allowedElements={["p", "strong", "em", "ul", "ol", "li", "a", "br"]}
                unwrapDisallowed
                skipHtml
                urlTransform={(url) => safeNotificationHref(url) ?? ""}
                components={{ a: ({ href, children }) => safeNotificationHref(href)
                    ? <a href={href} className={FOCUS}>{children}</a> : <>{children}</> }}
            >{body}</Markdown>
        </div>
    );
}

// Previews sit inside a button, so they cannot contain links or block elements.
export function NotificationPreview({ body }: { body: string }) {
    return <Markdown allowedElements={["strong", "em", "br"]} unwrapDisallowed skipHtml>{body}</Markdown>;
}
