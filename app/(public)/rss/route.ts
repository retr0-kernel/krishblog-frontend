import { getPosts } from "@/lib/api";
import type { Post } from "@/types";

export const revalidate = 3600;

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Krish Blog";

    let posts: Post[] = [];
    try {
        const data = await getPosts({ per_page: 20 });
        posts = data.posts;
    } catch {
        posts = [];
    }

    const items = posts
        .map((post) => {
            const url = `${siteUrl}/post/${post.slug}`;
            const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString();
            const description = escapeXml(post.excerpt ?? "");
            const title = escapeXml(post.title);
            return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>A personal chronicle of ideas, code, and stories.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

function escapeXml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
