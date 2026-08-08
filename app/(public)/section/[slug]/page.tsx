import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection, getPosts } from "@/lib/api";
import { PostCard } from "@/components/shared/post-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const section = await getSection(slug);
    return { title: section.name, description: section.description };
  } catch {
    return { title: "Section" };
  }
}

export const revalidate = 60;

export default async function SectionPage({ params }: Props) {
  const { slug } = await params;

  let section;
  try {
    section = await getSection(slug);
  } catch {
    notFound();
  }

  const data = await getPosts({ section: slug, per_page: 20 }).catch(() => ({
    posts: [],
    meta: { page: 1, per_page: 20, total: 0, total_pages: 0 },
  }));

  return (
    <div className="pt-24">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-b border-[hsl(var(--border))]">
        <div className="max-w-2xl">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-3">
            Section
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            {section.name}
          </h1>
          {section.description && (
            <p className="text-[hsl(var(--muted-foreground))] font-sans text-lg leading-relaxed">
              {section.description}
            </p>
          )}
          <p className="text-sm font-sans text-[hsl(var(--muted-foreground))] mt-4">
            {data.meta.total} {data.meta.total === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {data.posts.length === 0 ? (
          <div className="text-center py-24 text-[hsl(var(--muted-foreground))] font-sans">
            <p>No posts in this section yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
