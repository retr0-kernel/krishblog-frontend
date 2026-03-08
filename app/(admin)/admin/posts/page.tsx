"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminGetPosts, adminDeletePost } from "@/lib/api";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        published: "bg-green-500/10 text-green-600 dark:text-green-400",
        draft: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
        archived: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] opacity-60",
        scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
    return (
        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${styles[status] ?? styles.draft}`}>
      {status}
    </span>
    );
}

export default function AdminPostsPage() {
    const { token } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await adminGetPosts(token, { page, q: q || undefined, status: status || undefined });
            setPosts(data.posts);
            setTotal(data.meta.total);
        } catch { setPosts([]); }
        finally { setLoading(false); }
    }, [token, page, q, status]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleDelete = async (id: string, title: string) => {
        if (!token || !confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try { await adminDeletePost(token, id); fetchPosts(); }
        finally { setDeletingId(null); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Posts</h1>
                    <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">{total} total</p>
                </div>
                <Link href="/admin/posts/new"
                      className="flex items-center gap-2 h-9 px-4 bg-[hsl(var(--accent))] text-white text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> New post
                </Link>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                    <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search posts…"
                           className="w-full h-9 pl-9 pr-3 text-sm font-sans bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors" />
                </div>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="h-9 px-3 text-sm font-sans bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors">
                    <option value="">All status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg overflow-hidden">
                <table className="w-full text-sm font-sans">
                    <thead>
                    <tr className="border-b border-[hsl(var(--border))]">
                        <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Title</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hidden md:table-cell">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hidden lg:table-cell">Date</th>
                        <th className="px-4 py-3 w-24" />
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                    {loading && <tr><td colSpan={4} className="px-5 py-10 text-center text-[hsl(var(--muted-foreground))]">Loading…</td></tr>}
                    {!loading && posts.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-[hsl(var(--muted-foreground))]">No posts found</td></tr>}
                    {posts.map((post, i) => (
                        <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                   className="hover:bg-[hsl(var(--secondary)/0.5)] transition-colors">
                            <td className="px-5 py-3.5">
                                <div className="font-medium truncate max-w-xs">{post.title}</div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{post.slug}</div>
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell"><StatusBadge status={post.status} /></td>
                            <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))] hidden lg:table-cell text-xs">
                                {post.published_at ? formatDate(post.published_at) : "—"}
                            </td>
                            <td className="px-4 py-3.5">
                                <div className="flex items-center justify-end gap-1">
                                    <Link href={`/post/${post.slug}`} target="_blank"
                                          className="h-7 w-7 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                        <Eye className="h-3.5 w-3.5" />
                                    </Link>
                                    <Link href={`/admin/posts/${post.slug}`}
                                          className="h-7 w-7 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                        <Edit className="h-3.5 w-3.5" />
                                    </Link>
                                    <button onClick={() => handleDelete(post.id, post.title)} disabled={deletingId === post.id}
                                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-500/10 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors disabled:opacity-40">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {total > 10 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                            className="h-8 px-3 text-sm font-sans border border-[hsl(var(--border))] rounded hover:bg-[hsl(var(--secondary))] disabled:opacity-40 transition-colors">Prev</button>
                    <span className="text-sm font-sans text-[hsl(var(--muted-foreground))]">Page {page}</span>
                    <button onClick={() => setPage((p) => p + 1)} disabled={page * 10 >= total}
                            className="h-8 px-3 text-sm font-sans border border-[hsl(var(--border))] rounded hover:bg-[hsl(var(--secondary))] disabled:opacity-40 transition-colors">Next</button>
                </div>
            )}
        </div>
    );
}
