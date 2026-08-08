"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Eye, Users, TrendingUp, Clock, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminGetOverview, adminGetSubscriberStats } from "@/lib/api";
import type { OverviewStats, SubscriberStats } from "@/types";
import { formatDate } from "@/lib/utils";

const DAYS_OPTIONS = [7, 14, 30, 90];
const COLORS = ["hsl(14 80% 52%)", "hsl(220 80% 55%)", "hsl(142 71% 45%)", "hsl(260 60% 55%)", "hsl(40 80% 50%)"];

const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export default function AdminAnalyticsPage() {
    const { token } = useAuth();
    const [days, setDays] = useState(30);
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [subStats, setSubStats] = useState<SubscriberStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        Promise.all([
            adminGetOverview(token, days),
            adminGetSubscriberStats(token),
        ])
            .then(([overview, subs]) => {
                if (cancelled) return;
                setStats(overview);
                setSubStats(subs);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [token, days]);

    // Safely coerce all nullable arrays
    const dailyViews      = stats?.daily_views      ?? [];
    const topPosts        = stats?.top_posts        ?? [];
    const deviceBreakdown = stats?.device_breakdown ?? [];
    const topReferrers    = stats?.top_referrers    ?? [];
    const countryBreakdown= stats?.country_breakdown?? [];

    const metrics = [
        { label: "Page Views",     value: stats?.total_page_views ?? 0,                                         icon: Eye,       color: "text-blue-500" },
        { label: "Unique Visitors",value: stats?.unique_visitors  ?? 0,                                         icon: Users,     color: "text-green-500" },
        { label: "Avg Scroll %",   value: stats ? `${(stats.avg_scroll_pct  ?? 0).toFixed(0)}%` : "0%",         icon: TrendingUp,color: "text-[hsl(var(--accent))]" },
        { label: "Avg Read Time",  value: stats ? `${(stats.avg_read_time_sec ?? 0).toFixed(0)}s` : "0s",        icon: Clock,     color: "text-purple-500" },
        { label: "Subscribers",    value: subStats?.confirmed ?? 0,                                              icon: Mail,      color: "text-pink-500", sub: subStats ? `${subStats.pending} pending` : undefined },
    ];

    const notifications = subStats?.recent_notifications ?? [];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Analytics</h1>
                    <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">{stats?.period?.replace("_", " ")}</p>
                </div>
                <div className="flex gap-1">
                    {DAYS_OPTIONS.map((d) => (
                        <button key={d} onClick={() => setDays(d)}
                                className={`h-8 px-3 text-xs font-sans rounded transition-colors ${days === d ? "bg-[hsl(var(--accent))] text-white" : "border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]"}`}>
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="h-6 w-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Metric cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        {metrics.map((m, i) => (
                            <motion.div key={m.label}
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <m.icon className={`h-4 w-4 ${m.color}`} />
                                    <p className="text-xs font-sans text-[hsl(var(--muted-foreground))]">{m.label}</p>
                                </div>
                                <p className="text-2xl font-bold font-sans">{typeof m.value === "number" ? fmtNum(m.value) : m.value}</p>
                                {"sub" in m && m.sub && (
                                    <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] mt-0.5">{m.sub}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Daily views chart */}
                    {dailyViews.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5 mb-6">
                            <h2 className="text-sm font-sans font-semibold mb-4">Daily Traffic</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={dailyViews} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "DM Sans, sans-serif", fill: "hsl(var(--muted-foreground))" }}
                                           tickFormatter={(v: string) => v.slice(5)} />
                                    <YAxis tick={{ fontSize: 10, fontFamily: "DM Sans, sans-serif", fill: "hsl(var(--muted-foreground))" }} />
                                    <Tooltip
                                        contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12, fontFamily: "DM Sans" }}
                                        labelStyle={{ color: "hsl(var(--foreground))" }}
                                    />
                                    <Line type="monotone" dataKey="page_views" stroke="hsl(14 80% 52%)" strokeWidth={2} dot={false} name="Page Views" />
                                    <Line type="monotone" dataKey="unique_visitors" stroke="hsl(220 80% 55%)" strokeWidth={2} dot={false} name="Unique Visitors" />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        {/* Top posts */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                    className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5">
                            <h2 className="text-sm font-sans font-semibold mb-4">Top Posts</h2>
                            {topPosts.length === 0 ? (
                                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] text-center py-8">No data</p>
                            ) : (
                                <div className="space-y-3">
                                    {topPosts.map((p, i) => (
                                        <div key={p.post_id} className="flex items-center gap-3">
                                            <span className="text-xs font-sans font-bold text-[hsl(var(--muted-foreground))] w-5">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-sans font-medium truncate">{p.post_title}</p>
                                                <div className="mt-1 bg-[hsl(var(--muted))] rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full bg-[hsl(var(--accent))] rounded-full"
                                                         style={{ width: `${(p.views / (topPosts[0]?.views || 1)) * 100}%` }} />
                                                </div>
                                            </div>
                                            <span className="text-sm font-sans font-semibold flex-shrink-0">{fmtNum(p.views)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Device breakdown */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5">
                            <h2 className="text-sm font-sans font-semibold mb-4">Devices</h2>
                            {deviceBreakdown.length === 0 ? (
                                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] text-center py-8">No data</p>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={140}>
                                        <PieChart>
                                            <Pie data={deviceBreakdown} dataKey="count" nameKey="device"
                                                 cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                                                {deviceBreakdown.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-1.5 mt-2">
                                        {deviceBreakdown.map((d, i) => (
                                            <div key={d.device} className="flex items-center justify-between text-xs font-sans">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                                    <span className="capitalize">{d.device}</span>
                                                </div>
                                                <span className="text-[hsl(var(--muted-foreground))]">{(d.pct ?? 0).toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5 mb-6">
                        <h2 className="text-sm font-sans font-semibold mb-1">Email reach (per publish)</h2>
                        <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] mb-4">
                            When a post is published, confirmed subscribers are emailed automatically.
                        </p>
                        {notifications.length === 0 ? (
                            <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] text-center py-6">No posts emailed yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm font-sans">
                                    <thead>
                                        <tr className="text-left text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
                                            <th className="pb-2 pr-4 font-medium">Post</th>
                                            <th className="pb-2 pr-4 font-medium">Date</th>
                                            <th className="pb-2 pr-4 font-medium text-right">Reached</th>
                                            <th className="pb-2 font-medium text-right">Failed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notifications.map((n) => (
                                            <tr key={n.id} className="border-b border-[hsl(var(--border))] last:border-0">
                                                <td className="py-2.5 pr-4 max-w-[200px] truncate">{n.post_title}</td>
                                                <td className="py-2.5 pr-4 text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                                                    {formatDate(n.notified_at)}
                                                </td>
                                                <td className="py-2.5 pr-4 text-right font-semibold text-green-600 dark:text-green-400">
                                                    {n.sent_count}/{n.total_confirmed}
                                                </td>
                                                <td className="py-2.5 text-right text-[hsl(var(--muted-foreground))]">
                                                    {n.failed_count > 0 ? n.failed_count : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Top referrers */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5">
                            <h2 className="text-sm font-sans font-semibold mb-4">Top Referrers</h2>
                            {topReferrers.length === 0 ? (
                                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] text-center py-6">No data</p>
                            ) : (
                                <div className="space-y-2">
                                    {topReferrers.slice(0, 6).map((r) => (
                                        <div key={r.referrer} className="flex items-center justify-between text-sm font-sans">
                                            <span className="truncate max-w-[200px] text-[hsl(var(--muted-foreground))]">{r.referrer}</span>
                                            <span className="font-semibold">{fmtNum(r.count)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Country breakdown */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5">
                            <h2 className="text-sm font-sans font-semibold mb-4">Countries</h2>
                            {countryBreakdown.length === 0 ? (
                                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] text-center py-6">No data</p>
                            ) : (
                                <div className="space-y-2">
                                    {countryBreakdown.slice(0, 6).map((c, i) => (
                                        <div key={c.country} className="flex items-center gap-3 text-sm font-sans">
                                            <div className="w-24 bg-[hsl(var(--muted))] rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${c.pct ?? 0}%`, background: COLORS[i % COLORS.length] }} />
                                            </div>
                                            <span className="text-[hsl(var(--muted-foreground))]">{c.country}</span>
                                            <span className="ml-auto font-semibold">{(c.pct ?? 0).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
}
