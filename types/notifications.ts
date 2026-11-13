export interface Notification {
    id: string;
    category: "announcement" | "promo" | "message" | "nudge";
    content: { title: string; body: string; cta?: { label: string; href: string } };
    startsAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    read: boolean;
    readAt: string | null;
}

export interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
}

export interface NotificationReceiptResponse {
    id: string;
    readAt: string | null;
    dismissedAt: string | null;
}

export interface MarkAllReadResponse { markedRead: number }
