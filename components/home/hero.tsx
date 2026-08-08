"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface HeroProps {
    post: Post;
}

export function Hero({ post }: HeroProps) {
    return (
        <section className="pt-28 pb-6">
            <div className="max-w-6xl mx-auto px-6">
                <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                >
                    <div className="order-2 lg:order-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-[hsl(var(--accent))] text-white">
                                Featured
                            </span>
                            {post.section_slug && (
                                <span className="text-xs font-sans font-medium uppercase tracking-widest text-[hsl(var(--accent))]">
                                    {post.section_slug}
                                </span>
                            )}
                        </div>

                        <Link href={`/post/${post.slug}`} className="block">
                            <h1
                                className="text-3xl md:text-[2.35rem] font-bold leading-[1.15] mb-3 group-hover:text-[hsl(var(--accent))] transition-colors"
                                style={{ fontFamily: '"Playfair Display", serif' }}
                            >
                                {post.title}
                            </h1>
                        </Link>

                        {post.excerpt && (
                            <p className="text-[hsl(var(--muted-foreground))] text-[0.95rem] leading-relaxed mb-5 line-clamp-2 font-sans">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <div className="flex items-center gap-3 text-sm font-sans text-[hsl(var(--muted-foreground))]">
                                {post.published_at && <span>{formatDate(post.published_at)}</span>}
                                <span aria-hidden>·</span>
                                <span>{post.reading_time_min} min read</span>
                            </div>
                            <Link
                                href={`/post/${post.slug}`}
                                className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:gap-2.5 transition-all"
                            >
                                Read article
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    <Link
                        href={`/post/${post.slug}`}
                        className="order-1 lg:order-2 relative aspect-[16/10] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]"
                    >
                        {post.cover_image ? (
                            <Image
                                src={post.cover_image}
                                alt={post.cover_image_alt ?? post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                priority
                                sizes="(max-width: 1024px) 100vw, 560px"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 opacity-[0.07]"
                                style={{
                                    backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
                                    backgroundSize: "32px 32px",
                                }}
                            />
                        )}
                    </Link>
                </motion.article>
            </div>
        </section>
    );
}
