"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/shared/post-card";
import { SectionHeading } from "@/components/portfolio/section-heading";
import type { Post } from "@/types";

export function PortfolioWriting({ posts }: { posts: Post[] }) {
  return (
    <section id="writing" className="scroll-mt-28 py-20 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1">
              <SectionHeading
                eyebrow="Writing"
                title="Latest from the blog"
                description="Essays on code, systems, and whatever else I'm thinking about."
              />
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:gap-2.5 transition-all shrink-0 sm:mb-2"
            >
              View all posts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-[hsl(var(--muted-foreground))] font-sans">
            <p className="text-4xl mb-4">✦</p>
            <p>No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.slice(0, 6).map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
