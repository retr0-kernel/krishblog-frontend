"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminGetPost } from "@/lib/api";
import { PostEditor } from "@/components/admin/post-editor";
import type { Post } from "@/types";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        adminGetPost(token, id)
            .then(setPost)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [token, id]);

    if (loading) return (
        <div className="h-dvh flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (error) return <div className="p-8 text-center text-[hsl(var(--destructive))] font-sans">{error}</div>;
    if (!post) return null;

    return (
        <div className="h-dvh flex flex-col">
            <PostEditor post={post} />
        </div>
    );
}
