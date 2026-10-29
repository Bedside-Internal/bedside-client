import type { NotificationsResponse } from "../../types/notifications.ts";

export type NotificationAction = { type: "read" | "dismiss"; id: string } | { type: "read-all" };

export function updateNotifications(state: NotificationsResponse, action: NotificationAction, now = new Date().toISOString()): NotificationsResponse {
    const notifications = action.type === "dismiss"
        ? state.notifications.filter((item) => item.id !== action.id)
        : state.notifications.map((item) => action.type === "read-all" || item.id === action.id
            ? { ...item, read: true, readAt: item.readAt ?? now } : item);
    return { notifications, unreadCount: notifications.filter((item) => !item.read).length };
}

export function newestFirst(state: NotificationsResponse): NotificationsResponse {
    return { ...state, notifications: [...state.notifications].sort((a, b) =>
        Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id)) };
}

export function safeNotificationHref(href: string | undefined): string | undefined {
    if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return undefined;
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
        const url = new URL(href);
        if (/^https:\/\//i.test(href) && url.protocol === "https:" && !url.username && !url.password) return href;
    } catch { /* Unsafe or malformed URLs are rendered as text. */ }
    return undefined;
}

export function notificationAge(createdAt: string, now = Date.now()): string {
    const minutes = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 60_000));
    if (minutes < 1) return "Just now";
    const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (minutes < 60) return format.format(-minutes, "minute");
    const hours = Math.floor(minutes / 60);
    return hours < 24 ? format.format(-hours, "hour") : format.format(-Math.floor(hours / 24), "day");
}
