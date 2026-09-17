import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the Express API right after an admin write to marketing content
// (testimonials, formats, pricing, faq, social-links) actually succeeds.
export async function POST(req: NextRequest) {
    const secret = req.headers.get("x-revalidate-secret");
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const tag = typeof body.tag === "string" ? body.tag : "marketing-landing";

    revalidateTag(tag, { expire: 0 });
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}