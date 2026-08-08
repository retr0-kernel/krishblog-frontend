"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { adminGetPostBySlug } from "@/lib/api";
import { PostEditor } from "@/components/admin/post-editor";
import type { Post } from "@/types";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = use(params); // id param is actually the slug now
    const { token } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;

        adminGetPostBySlug(token, slug)
            .then(setPost)
            .catch((e) => {
                console.error("Failed to fetch post by slug:", e.message);
                setError(`Post not found with slug: "${slug}"`);
            })
            .finally(() => setLoading(false));
    }, [token, slug]);

    if (loading) return (
        <div className="h-dvh flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (error) return (
        <div className="p-8 text-center">
            <div className="text-[hsl(var(--destructive))] font-sans mb-4">{error}</div>
            <Link href="/admin/posts" className="text-sm text-[hsl(var(--accent))] hover:underline">
                ← Back to posts
            </Link>
        </div>
    );
    if (!post) return null;

    return (
        <div className="h-dvh flex flex-col">
            <PostEditor post={post} />
        </div>
    );
}
