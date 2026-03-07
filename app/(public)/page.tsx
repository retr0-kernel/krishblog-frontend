import type { Metadata } from "next";
import type { Post } from "@/types";
import { getPosts } from "@/lib/api";
import { Hero } from "@/components/home/hero";
import { PostCard } from "@/components/shared/post-card";

export const metadata: Metadata = {
  title: "Home",
  description: "A personal chronicle of ideas, code, and stories.",
};

export const revalidate = 60;

export default async function HomePage() {
  let allPosts: Post[] = [];
  try {
    const data = await getPosts({ per_page: 12 });
    allPosts = data.posts;
  } catch {
    // show empty state
  }

  const featured = allPosts.find((p) => p.is_featured) ?? allPosts[0];
  const rest = allPosts.filter((p) => p.id !== featured?.id);

  return (
    <>
      {featured && <Hero post={featured} />}

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Latest
          </span>
          <div className="flex-1 h-px bg-[hsl(var(--border))]" />
        </div>

        {rest.length === 0 && (
          <div className="text-center py-24 text-[hsl(var(--muted-foreground))] font-sans">
            <p className="text-4xl mb-4">✦</p>
            <p>No posts yet. Check back soon.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
