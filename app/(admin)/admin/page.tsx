"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Eye, Users, TrendingUp, Plus, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminGetPosts, adminGetOverview, adminGetSubscriberStats } from "@/lib/api";
import type { OverviewStats, Post, SubscriberStats } from "@/types";
import { formatDate } from "@/lib/utils";

const card = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.07, duration: 0.4 },
});

export default function AdminDashboard() {
    const { token, loading } = useAuth(); //auth
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [subStats, setSubStats] = useState<SubscriberStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        setLoadError(null);
        try {
            const [overviewResult, postsResult, subsResult] = await Promise.allSettled([
                adminGetOverview(token, 7),
                adminGetPosts(token, { per_page: 5 }),
                adminGetSubscriberStats(token),
            ]);
            if (overviewResult.status === "fulfilled") setStats(overviewResult.value);
            if (subsResult.status === "fulfilled") setSubStats(subsResult.value);
            if (postsResult.status === "fulfilled") {
                setRecentPosts(postsResult.value.posts ?? []);
            } else {
                setRecentPosts([]);
                setLoadError("Failed to load recent posts.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (loading || !token) return;
        fetchDashboard();
    }, [loading, token, fetchDashboard]);

    const topPosts = stats?.top_posts ?? [];

    const metrics = [
        { label: "Page Views (7d)", value: stats?.total_page_views ?? "—", icon: Eye, color: "text-blue-500" },
        { label: "Unique Visitors", value: stats?.unique_visitors ?? "—", icon: Users, color: "text-green-500" },
        { label: "Avg Scroll %", value: stats ? `${(stats.avg_scroll_pct ?? 0).toFixed(0)}%` : "—", icon: TrendingUp, color: "text-[hsl(var(--accent))]" },
        {
            label: "Subscribers",
            value: subStats != null ? `${subStats.confirmed}` : "—",
            icon: Mail,
            color: "text-purple-500",
            sub: subStats != null
                ? `${subStats.pending} pending · ${subStats.total} total`
                : undefined,
        },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Dashboard</h1>
                    <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] mt-0.5">Last 7 days overview</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 h-9 px-4 bg-[hsl(var(--accent))] text-white text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity"
                >
                    <Plus className="h-4 w-4" />
                    New post
                </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((m, i) => (
                    <motion.div key={m.label} {...card(i)}
                                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                        <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] mb-1">{m.label}</p>
                        <p className="text-2xl font-bold font-sans">{String(m.value)}</p>
                        {"sub" in m && m.sub && (
                            <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] mt-0.5">{m.sub}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent posts */}
                <motion.div {...card(4)} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
                        <h2 className="text-sm font-sans font-semibold">Recent Posts</h2>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/posts" className="text-xs font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] flex items-center gap-1 transition-colors">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-[hsl(var(--border))]">
                        {isLoading && recentPosts.length === 0 && (
                            <p className="px-5 py-6 text-sm font-sans text-[hsl(var(--muted-foreground))] text-center">Loading posts…</p>
                        )}
                        {loadError && recentPosts.length === 0 && (
                            <p className="px-5 py-6 text-sm font-sans text-[hsl(var(--muted-foreground))] text-center">{loadError}</p>
                        )}
                        {!isLoading && !loadError && recentPosts.length === 0 && (
                            <p className="px-5 py-6 text-sm font-sans text-[hsl(var(--muted-foreground))] text-center">No posts yet</p>
                        )}
                        {recentPosts.map((post) => (
                            <Link key={post.id} href={`/admin/posts/${post.slug}`}
                                  className="flex items-center gap-3 px-5 py-3 hover:bg-[hsl(var(--secondary))] transition-colors">
                                <FileText className="h-4 w-4 flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-sans font-medium truncate">{post.title}</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {post.published_at ? formatDate(post.published_at) : "Draft"}
                                    </p>
                                </div>
                                <StatusBadge status={post.status} />
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Top posts */}
                <motion.div {...card(5)} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
                        <h2 className="text-sm font-sans font-semibold">Top Posts (7d)</h2>
                        <Link href="/admin/analytics" className="text-xs font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] flex items-center gap-1 transition-colors">
                            Analytics <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-[hsl(var(--border))]">
                        {topPosts.length === 0 && (
                            <p className="px-5 py-6 text-sm font-sans text-[hsl(var(--muted-foreground))] text-center">No data yet</p>
                        )}
                        {topPosts.slice(0, 5).map((p) => (
                            <div key={p.post_id} className="flex items-center gap-3 px-5 py-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-sans font-medium truncate">{p.post_title}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-sans font-semibold">{(p.views ?? 0).toLocaleString()}</p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        published: "bg-green-500/10 text-green-600 dark:text-green-400",
        draft: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
        archived: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] opacity-60",
        scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return (
        <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${styles[status] ?? styles.draft}`}>
      {status}
    </span>
    );
}
