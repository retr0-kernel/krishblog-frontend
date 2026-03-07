"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, TrendingUp, Clock, Hash } from "lucide-react";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/shared/post-card";
import type { Post } from "@/types";

const SUGGESTIONS = ["design", "technology", "travel", "code", "ideas"];
const STORAGE_KEY = "recent_searches";

export default function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQ = searchParams.get("q") ?? "";

    const [query, setQuery] = useState(initialQ);
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
            setRecentSearches(stored);
        } catch { /* ignore */ }
    }, []);

    const saveRecent = (q: string) => {
        if (!q.trim()) return;
        try {
            const prev: string[] = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
            const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setRecentSearches(next);
        } catch { /* ignore */ }
    };

    const removeRecent = (term: string) => {
        try {
            const prev: string[] = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
            const next = prev.filter((s) => s !== term);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setRecentSearches(next);
        } catch { /* ignore */ }
    };

    const clearAllRecent = () => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
            setRecentSearches([]);
        } catch { /* ignore */ }
    };

    const doSearch = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); setSearched(false); return; }
        setLoading(true);
        setSearched(true);
        try {
            const data = await getPosts({ q, per_page: 20 });
            setResults(data.posts);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialQ) doSearch(initialQ);
    }, []); // eslint-disable-line

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        saveRecent(query.trim());
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        doSearch(query);
    };

    const runQuery = (q: string) => {
        setQuery(q);
        saveRecent(q);
        router.replace(`/search?q=${encodeURIComponent(q)}`);
        doSearch(q);
    };

    const clear = () => {
        setQuery("");
        setResults([]);
        setSearched(false);
        router.replace("/search");
    };

    return (
        <div className="pt-24 min-h-dvh">
            <div className="max-w-4xl mx-auto px-6 py-16">

                <div className="mb-10">
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-3">Search</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Find something to read
                    </h1>

                    <form onSubmit={handleSubmit} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--accent))] transition-colors pointer-events-none" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search posts…"
                            className="w-full h-14 pl-11 pr-12 text-base font-sans bg-[hsl(var(--background))] border-2 border-[hsl(var(--border))] rounded-xl focus:outline-none focus:border-[hsl(var(--accent))] transition-all"
                        />
                        {query && (
                            <button type="button" onClick={clear}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--muted-foreground))]">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </form>
                </div>

                <AnimatePresence mode="wait">
                    {!searched && !loading && (
                        <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="space-y-8">

                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                                            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                                                Recent
                                            </p>
                                        </div>
                                        <button onClick={clearAllRecent}
                                                className="text-xs font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors">
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((s) => (
                                            <div key={s}
                                                 className="flex items-center bg-[hsl(var(--secondary))] rounded-full overflow-hidden border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.4)] transition-colors group/chip">
                                                <button onClick={() => runQuery(s)}
                                                        className="flex items-center gap-1.5 h-8 pl-3 pr-2 text-sm font-sans text-[hsl(var(--foreground))]">
                                                    <Clock className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                                                    {s}
                                                </button>
                                                <button onClick={() => removeRecent(s)} title="Remove"
                                                        className="h-8 w-7 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] opacity-0 group-hover/chip:opacity-100 transition-all">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                                        Try searching for
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button key={s} onClick={() => runQuery(s)}
                                                className="flex items-center gap-1.5 h-8 px-3 text-sm font-sans border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] rounded-full transition-colors">
                                            <Hash className="h-3 w-3" />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-32 gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--accent))]" />
                            <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">Searching…</p>
                        </motion.div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="text-center py-32">
                            <p className="text-5xl mb-5">✦</p>
                            <p className="text-lg font-sans font-medium mb-2">No results for &ldquo;{query}&rdquo;</p>
                            <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] mb-8">Try a different term or browse by topic.</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button key={s} onClick={() => runQuery(s)}
                                            className="h-8 px-3 text-sm font-sans border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] rounded-full transition-colors">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!loading && results.length > 0 && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">
                                    <span className="font-semibold text-[hsl(var(--foreground))]">{results.length}</span>
                                    {" "}result{results.length !== 1 ? "s" : ""} for{" "}
                                    <span className="font-medium text-[hsl(var(--foreground))]">&ldquo;{query}&rdquo;</span>
                                </p>
                                <button onClick={clear}
                                        className="text-xs font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors">
                                    Clear
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {results.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
