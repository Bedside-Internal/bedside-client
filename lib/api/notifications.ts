"use client";

import { useMemo } from "react";
import { useApiFetch } from "./use-api-fetch";
import type { MarkAllReadResponse, NotificationReceiptResponse, NotificationsResponse } from "@/types/notifications";

export function useNotificationsApi() {
    const apiFetch = useApiFetch();
    return useMemo(() => ({
        list: (signal: AbortSignal) => apiFetch<NotificationsResponse>("/api/notifications", { signal }),
        read: (id: string) => apiFetch<NotificationReceiptResponse>(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "POST" }),
        dismiss: (id: string) => apiFetch<NotificationReceiptResponse>(`/api/notifications/${encodeURIComponent(id)}/dismiss`, { method: "POST" }),
        readAll: () => apiFetch<MarkAllReadResponse>("/api/notifications/read-all", { method: "POST" }),
    }), [apiFetch]);
}
