import type { Metadata } from "next";
import Link from "next/link";
import { Rss, Copy } from "lucide-react";

export const metadata: Metadata = {
    title: "RSS Feed",
    description: "Subscribe to the RSS feed to get new posts in your reader.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FEED_URL = `${SITE_URL}/rss.xml`;

export default function RSSPage() {
    return (
        <div className="pt-24 min-h-dvh">
            <div className="max-w-xl mx-auto px-6 py-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--accent)/0.12)] flex items-center justify-center">
                        <Rss className="h-5 w-5 text-[hsl(var(--accent))]" />
                    </div>
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
                        RSS Feed
                    </p>
                </div>

                <h1 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Read in your<br />favourite reader
                </h1>

                <p className="text-[hsl(var(--muted-foreground))] font-sans text-lg leading-relaxed mb-10">
                    Every new post is published to an RSS feed. Paste the URL below into
                    any feed reader — Reeder, NetNewsWire, Feedly, or any RSS app — and
                    new articles will appear automatically.
                </p>

                <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden mb-10">
                    <div className="px-4 py-2 bg-[hsl(var(--secondary))] border-b border-[hsl(var(--border))]">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Feed URL
            </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3">
                        <code className="flex-1 text-sm font-mono text-[hsl(var(--foreground))] truncate">
                            {FEED_URL}
                        </code>

                        <a
                            href={FEED_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open feed"
                            className="shrink-0 h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </a>
                </div>
            </div>

            <div className="flex flex-col gap-3 font-sans text-sm">
                <a href={FEED_URL} className="inline-flex items-center gap-2 text-[hsl(var(--accent))] hover:underline underline-offset-4">
                    <Rss className="h-4 w-4" />
                    Open feed directly
                </a>
                <Link href="/about" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                    Prefer email? Subscribe on the About page →
                </Link>
            </div>

            <div className="flex items-center gap-4 my-12">
                <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                <span className="text-[hsl(var(--accent))] text-lg">✦</span>
                <div className="flex-1 h-px bg-[hsl(var(--border))]" />
            </div>

            <div className="space-y-3 font-sans text-sm text-[hsl(var(--muted-foreground))]">
                <p className="font-medium text-[hsl(var(--foreground))]">Reader recommendations</p>
                {[
                    { name: "NetNewsWire", url: "https://netnewswire.com", note: "Free, Mac & iOS" },
                    { name: "Reeder 5",    url: "https://reeder.app",      note: "Mac & iOS" },
                    { name: "Feedly",      url: "https://feedly.com",      note: "Web, iOS, Android" },
                    { name: "Miniflux",    url: "https://miniflux.app",    note: "Self-hosted" },
                ].map(({ name, url, note }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] hover:text-[hsl(var(--foreground))] transition-colors">
                        <span>{name}</span>
                        <span className="text-xs">{note} ↗</span>
                    </a>
                ))}
            </div>
        </div>
</div>
);
}