"use client";

import { useAuth } from "@clerk/nextjs";
import { Bell, CheckCheck, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { NotificationBody, NotificationPreview } from "./NotificationBody";
import { useNotificationsApi } from "@/lib/api/notifications";
import { newestFirst, notificationAge, safeNotificationHref, updateNotifications, type NotificationAction } from "@/lib/notifications/state";
import type { Notification, NotificationsResponse } from "@/types/notifications";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]";

function NotificationMessage({ notification, onClose, error, trigger }: { notification: Notification; onClose: () => void; error: string | null; trigger: RefObject<HTMLButtonElement | null> }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const bodyId = useId();
    useEffect(() => {
        const element = dialog.current;
        const triggerElement = trigger.current;
        element?.showModal();
        return () => {
            element?.close();
            // The bell is inert until the modal closes.
            if (triggerElement?.isConnected) triggerElement.focus();
        };
    }, [trigger]);
    const href = safeNotificationHref(notification.content.cta?.href);
    return createPortal(
        <dialog ref={dialog} data-clarity-mask="True" aria-labelledby={titleId} aria-describedby={bodyId}
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onKeyDown={(event) => {
                if (event.key !== "Tab") return;
                const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
                const first = focusable[0], last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }}
            onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
            className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-sand)] bg-white p-0 text-[var(--color-ink)] shadow-xl backdrop:bg-black/35">
            <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 id={titleId} className="break-words text-xl font-semibold">{notification.content.title}</h2>
                        <time dateTime={notification.createdAt} className="mt-1 block text-xs text-slate-400">{notificationAge(notification.createdAt)}</time>
                    </div>
                    <button type="button" autoFocus onClick={onClose} aria-label="Close notification" className={`shrink-0 rounded-lg p-2 text-slate-500 hover:bg-[var(--color-sand)] ${FOCUS}`}><X aria-hidden="true" className="h-5 w-5" /></button>
                </div>
                <div id={bodyId}><NotificationBody body={notification.content.body} /></div>
                {error && <p role="alert" className="mt-4 text-sm text-[var(--color-coral)]">{error}</p>}
                {href && <a href={href} className={`mt-6 inline-flex rounded-lg bg-[var(--color-mint)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-mint-hover)] ${FOCUS}`}>{notification.content.cta!.label}</a>}
            </div>
        </dialog>, document.body,
    );
}

// Reset private notifications when the Clerk account changes.
export function NotificationBell() {
    const { userId } = useAuth();
    return userId ? <NotificationInbox key={userId} /> : null;
}

function NotificationInbox() {
    const api = useNotificationsApi();
    const [data, setData] = useState<NotificationsResponse>({ notifications: [], unreadCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const busy = useRef(false);
    const root = useRef<HTMLDivElement>(null);
    const bell = useRef<HTMLButtonElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const panelId = useId();
    const titleId = useId();

    useEffect(() => {
        const controller = new AbortController();
        api.list(controller.signal).then((result) => {
            if (!controller.signal.aborted) { setData(newestFirst(result)); setLoading(false); }
        }).catch(() => {
            if (!controller.signal.aborted) { setError("Couldn't load notifications. Refresh the page to try again."); setLoading(false); }
        });
        return () => controller.abort();
    }, [api]);

    useEffect(() => {
        if (!open) return;
        heading.current?.focus();
        const outside = (event: PointerEvent) => {
            if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") { event.preventDefault(); setOpen(false); bell.current?.focus(); }
        };
        document.addEventListener("pointerdown", outside);
        document.addEventListener("keydown", escape);
        return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
    }, [open]);

    async function mutate(action: NotificationAction) {
        if (busy.current) return;
        busy.current = true;
        const previous = data;
        setPending(true);
        setError(null);
        setData(updateNotifications(previous, action));
        try {
            if (action.type === "read-all") await api.readAll();
            else if (action.type === "read") await api.read(action.id);
            else await api.dismiss(action.id);
        } catch {
            setData(previous);
            setError("Couldn't save that change. Your notifications have been restored.");
        } finally { busy.current = false; setPending(false); }
    }

    function showMessage(item: Notification) {
        if (busy.current) return;
        setError(null);
        setSelectedId(item.id);
        setOpen(false);
        if (!item.read) void mutate({ type: "read", id: item.id });
    }
    const selected = data.notifications.find((item) => item.id === selectedId);

    return (
        <div ref={root} className="relative" data-clarity-mask="True">
            <button ref={bell} type="button" aria-label={`Notifications${data.unreadCount ? `, ${data.unreadCount} unread` : ""}`}
                aria-expanded={open} aria-controls={open ? panelId : undefined}
                onClick={() => setOpen((value) => !value)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-[var(--color-sand)] ${FOCUS}`}>
                <Bell aria-hidden="true" className="h-5 w-5" />
                {data.unreadCount > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--color-mint)] px-1 text-center text-[10px] font-bold leading-5 text-[var(--color-ink)]">{data.unreadCount}</span>}
            </button>
            <span role="status" className="sr-only">{loading ? "Loading notifications" : `${data.unreadCount} unread notifications`}</span>
            {open && <section id={panelId} aria-labelledby={titleId} aria-busy={loading}
                className="fixed left-4 right-4 top-18 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-[var(--color-sand)] bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-[min(32rem,calc(100dvh-7rem))] sm:w-96">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--color-sand)] p-4">
                    <h2 ref={heading} id={titleId} tabIndex={-1} className="rounded text-base font-semibold focus:outline-none">Notifications</h2>
                    <button type="button" disabled={pending || loading || !data.unreadCount} onClick={() => void mutate({ type: "read-all" })}
                        className={`inline-flex items-center gap-1 rounded px-1 py-2 text-xs font-medium text-[var(--color-ink)] disabled:opacity-40 ${FOCUS}`}>
                        <CheckCheck aria-hidden="true" className="h-4 w-4" />Mark all as read
                    </button>
                </div>
                {error && <p role="alert" className="px-4 py-3 text-sm text-[var(--color-coral)]">{error}</p>}
                {loading ? <p className="px-5 py-10 text-center text-sm text-slate-400">Loading notifications…</p>
                    : !data.notifications.length && !error ? <div className="px-5 py-10 text-center"><Bell aria-hidden="true" className="mx-auto mb-3 h-7 w-7 text-[var(--color-mint)]" /><p className="font-medium">You’re all caught up</p><p className="mt-1 text-sm text-slate-400">New notifications will appear here.</p></div>
                    : data.notifications.length > 0 && <ul className="divide-y divide-[var(--color-sand)]">
                        {data.notifications.map((item) => <li key={item.id} className={`flex items-start gap-1 p-3 ${item.read ? "" : "bg-[var(--color-sand)]/35"}`}>
                            <button type="button" disabled={pending} onClick={() => showMessage(item)} className={`min-w-0 flex-1 rounded-lg p-1 text-left disabled:cursor-wait ${FOCUS}`}>
                                <span className="flex items-start gap-2">
                                    {!item.read && <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-mint)]" />}
                                    <span className="min-w-0 flex-1">
                                        <span className={`block break-words text-sm ${item.read ? "font-medium text-slate-600" : "font-semibold text-[var(--color-ink)]"}`}>{item.content.title}<span className="sr-only">{item.read ? ", read" : ", unread"}</span></span>
                                        <span className="mt-1 line-clamp-2 break-words text-xs leading-5 text-slate-500"><NotificationPreview body={item.content.body} /></span>
                                        <time dateTime={item.createdAt} className="mt-2 block text-[11px] text-slate-400">{notificationAge(item.createdAt)}</time>
                                    </span>
                                </span>
                            </button>
                            <button type="button" disabled={pending} onClick={() => { heading.current?.focus(); void mutate({ type: "dismiss", id: item.id }); }}
                                aria-label={`Dismiss ${item.content.title}`} className={`shrink-0 rounded-lg p-2 text-slate-400 hover:bg-[var(--color-sand)] hover:text-slate-600 disabled:opacity-40 ${FOCUS}`}><X aria-hidden="true" className="h-4 w-4" /></button>
                        </li>)}
                    </ul>}
            </section>}
            {selected && <NotificationMessage notification={selected} error={error} trigger={bell} onClose={() => setSelectedId(null)} />}
        </div>
    );
}
