import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { PostBody } from "@/components/reader/post-body";
import { ReadingProgress } from "@/components/reader/reading-progress";
import { TableOfContents } from "@/components/reader/table-of-contents";
import { ShareButtons } from "@/components/reader/share-buttons";
import { ScrollTracker } from "@/components/reader/scroll-tracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);
    return {
      title: post.meta_title ?? post.title,
      description: post.meta_desc ?? post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        type: "article",
        publishedTime: post.published_at,
        images: post.og_image ? [{ url: post.og_image }] : post.cover_image ? [{ url: post.cover_image }] : [],
      },
    };
  } catch {
    return { title: "Post" };
  }
}

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const postUrl = `${siteUrl}/post/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <ScrollTracker postId={post.id} />
      <TableOfContents />

      <article className="pt-24">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-10">
          {post.section_slug && (
            <Link
              href={`/section/${post.section_slug}`}
              className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] hover:opacity-80 transition-opacity"
            >
              {post.section_slug}
            </Link>
          )}

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-4 mb-6"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-xl text-[hsl(var(--muted-foreground))] font-sans leading-relaxed mb-8 max-w-2xl">
              {post.summary}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-4 text-sm font-sans text-[hsl(var(--muted-foreground))]">
              {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
              <span>·</span>
              <span>{post.read_time} min read</span>
              <span>·</span>
              <span>{post.word_count.toLocaleString()} words</span>
            </div>
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-6 mb-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-sm">
              <Image
                src={post.cover_image}
                alt={post.cover_image_alt ?? post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="max-w-2xl mx-auto px-6 pb-16">
          {post.blocks && post.blocks.length > 0 ? (
            <PostBody blocks={post.blocks} />
          ) : (
            <div className="prose-editorial text-[hsl(var(--muted-foreground))] italic">
              This post has no content yet.
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-16 pt-8 border-t border-[hsl(var(--border))] flex items-center justify-between">
            <ShareButtons title={post.title} url={postUrl} />
            {post.section_slug && (
              <Link
                href={`/section/${post.section_slug}`}
                className="text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                More in {post.section_slug} →
              </Link>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
