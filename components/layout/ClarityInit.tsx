"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Clarity from "@microsoft/clarity";

let started = false;

export default function ClarityInit() {
    const { isLoaded, user } = useUser();

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;
        if (!isLoaded || started) return;

        const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
        if (!id) return;

        const optedOut =
            user?.publicMetadata?.analyticsOptOut === true ||
            user?.unsafeMetadata?.analyticsOptOut === true;
        if (optedOut) return;

        started = true;
        Clarity.init(id);
    }, [isLoaded, user]);

    return null;
}