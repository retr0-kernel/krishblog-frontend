"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface HeroProps {
    post: Post;
}

export function Hero({ post }: HeroProps) {
    return (
        <section className="relative min-h-[80vh] flex items-end pt-24 pb-16 overflow-hidden">
            {post.cover_image && (
                <>
                    <div className="absolute inset-0">
                        <Image src={post.cover_image} alt={post.cover_image_alt ?? post.title} fill className="object-cover" priority />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20_14%_4%)] via-[hsl(20_14%_4%/0.6)] to-transparent" />
                </>
            )}
            {!post.cover_image && (
                <div className="absolute inset-0 bg-[hsl(20_14%_8%)]">
                    <div className="absolute inset-0 opacity-5"
                         style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(42 30% 96%) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                </div>
            )}
            <div className="relative max-w-4xl mx-auto px-6 w-full">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    {post.section_slug && (
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                  className="text-[hsl(var(--accent))] text-xs font-sans font-semibold uppercase tracking-widest mb-4">
                            {post.section_slug}
                        </motion.p>
                    )}
                    <Link href={`/post/${post.slug}`}>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
                                   className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6 hover:text-[hsl(42_20%_88%)] transition-colors"
                                   style={{ fontFamily: '"Playfair Display", serif' }}>
                            {post.title}
                        </motion.h1>
                    </Link>
                    {post.excerpt && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                  className="text-[hsl(42_20%_75%)] text-lg font-sans max-w-2xl mb-6 leading-relaxed">
                            {post.excerpt}
                        </motion.p>
                    )}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="flex items-center gap-4 text-sm font-sans text-[hsl(42_20%_60%)]">
                        {post.published_at && <span>{formatDate(post.published_at)}</span>}
                        <span>·</span>
                        <span>{post.reading_time_min} min read</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
