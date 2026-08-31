"use client";

type Status = "private" | "pending" | "approved" | "rejected";

interface StatusBadgeProps {
    status: Status;
    variant?: "client" | "admin";
    className?: string;
}

const CLIENT_STYLES: Record<Status, string> = {
    private: "text-sand bg-sand/20",
    pending: "text-amber bg-amber/20",
    approved: "text-mint bg-mint/20",
    rejected: "text-coral bg-coral/20",
};

const ADMIN_STYLES: Record<Status, string> = {
    private: "text-sand bg-sand/20",
    pending: "text-amber bg-amber/20",
    approved: "text-mint bg-mint/20",
    rejected: "text-coral bg-coral/20",
};

const LABELS: Record<Status, string> = {
    private: "Private",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
};

export function StatusBadge({ status, variant = "client", className = "" }: StatusBadgeProps) {
    const styles = variant === "admin" ? ADMIN_STYLES : CLIENT_STYLES;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${styles[status]} ${className}`}>
            {LABELS[status]}
        </span>
    );
}