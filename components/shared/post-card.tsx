"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";
import { PostCover } from "@/components/shared/post-cover";

interface PostCardProps {
  post: Post;
  index?: number;
  featured?: boolean;
}

export function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  return (
      <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={featured ? "group" : "group border-b border-[hsl(var(--border))] pb-8"}
      >
        <Link href={`/post/${post.slug}`} className="block">
          <div className="relative mb-4">
            <PostCover
              src={post.cover_image}
              alt={post.cover_image_alt ?? post.title}
              title={post.title}
              aspect={featured ? "aspect-[16/9]" : "aspect-[3/2]"}
              imageClassName="transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            {post.is_featured && (
              <span className="absolute top-3 left-3 bg-[hsl(var(--accent))] text-white text-xs font-sans font-medium px-2 py-0.5">
                Featured
              </span>
            )}
          </div>

          <div className="space-y-2">
            {post.section_slug && (
                <p className="text-xs font-sans font-medium uppercase tracking-widest text-[hsl(var(--accent))]">
                  {post.section_slug}
                </p>
            )}

            <h2
                className={`font-display font-bold leading-tight group-hover:text-[hsl(var(--accent))] transition-colors ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
                style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {post.title}
            </h2>

            {post.excerpt && (
                <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed line-clamp-2 font-sans">
                  {post.excerpt}
                </p>
            )}

            <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))] font-sans pt-1">
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              <span>·</span>
              <span>{post.reading_time_min} min read</span>
            </div>
          </div>
        </Link>
      </motion.article>
  );
}
