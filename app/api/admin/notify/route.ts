import { NextRequest, NextResponse } from "next/server";
import { sendNewPostEmail } from "@/app/api/subscribe/route";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, summary, slug, secret } = body;

        const expectedSecret = process.env.NOTIFY_SECRET;
        if (expectedSecret && secret !== expectedSecret) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!title || !slug) {
            return NextResponse.json(
                { error: "title and slug are required" },
                { status: 400 }
            );
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Krish Blog";
        const postUrl = `${siteUrl}/post/${slug}`;

        const result = await sendNewPostEmail({
            subject: `New post: ${title} — ${siteName}`,
            title,
            summary: summary ?? "",
            url: postUrl,
        });

        return NextResponse.json({ success: true, ...result });
    } catch (err) {
        console.error("[notify] error:", err);
        return NextResponse.json({ error: "Failed to send notifications." }, { status: 500 });
    }
}
