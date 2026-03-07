"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps { post: Post; index?: number; featured?: boolean; }

export function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  return (
      <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={featured ? "group" : "group border-b border-[hsl(var(--border))] pb-8"}
      >
        <Link href={`/post/${post.slug}`} className="block">
          {post.cover_image && (
              <div className={`relative overflow-hidden mb-4 ${featured ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
                <Image src={post.cover_image} alt={post.cover_image_alt ?? post.title} fill
                       className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {post.is_featured && (
                    <span className="absolute top-3 left-3 bg-[hsl(var(--accent))] text-white text-xs font-sans font-medium px-2 py-0.5">Featured</span>
                )}
              </div>
          )}
          <div className="space-y-2">
            {post.section_slug && (
                <p className="text-xs font-sans font-medium uppercase tracking-widest text-[hsl(var(--accent))]">{post.section_slug}</p>
            )}
            <h2 className={`font-bold leading-tight group-hover:text-[hsl(var(--accent))] transition-colors ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
                style={{ fontFamily: '"Playfair Display", serif' }}>
              {post.title}
            </h2>
            {post.summary && (
                <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed line-clamp-2 font-sans">{post.summary}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))] font-sans pt-1">
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              <span>·</span><span>{post.read_time} min read</span>
            </div>
          </div>
        </Link>
      </motion.article>
  );
}
