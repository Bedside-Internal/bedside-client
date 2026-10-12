"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityInit() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;
        const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
        if (id) Clarity.init(id);
    }, []);

    return null;
}