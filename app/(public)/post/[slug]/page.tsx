import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
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
      description: post.meta_desc ?? post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.published_at,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
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
          <div className="max-w-4xl mx-auto px-6 pt-12 pb-10">
            {post.section_slug && (
                <Link href={`/section/${post.section_slug}`}
                      className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] hover:opacity-80 transition-opacity">
                  {post.section_slug}
                </Link>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-4 mb-6"
                style={{ fontFamily: '"Playfair Display", serif' }}>
              {post.title}
            </h1>

            {post.excerpt && (
                <p className="text-xl text-[hsl(var(--muted-foreground))] font-sans leading-relaxed mb-8 max-w-2xl">
                  {post.excerpt}
                </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-4 text-sm font-sans text-[hsl(var(--muted-foreground))]">
                {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
                <span>·</span>
                <span>{post.reading_time_min} min read</span>
                <span>·</span>
                <span>{post.word_count.toLocaleString()} words</span>
              </div>
              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>

          {post.cover_image && (
              <div className="max-w-5xl mx-auto px-6 mb-12">
                <div className="relative aspect-[21/9] overflow-hidden rounded-sm">
                  <Image src={post.cover_image} alt={post.cover_image_alt ?? post.title} fill className="object-cover" priority />
                </div>
              </div>
          )}

          <div className="max-w-2xl mx-auto px-6 pb-16">
            {post.content ? (
                <div className="prose-editorial">
                  {(() => {
                    const lines = post.content.split("\n");
                    const result: React.ReactElement[] = [];
                    let inList = false;
                    let listItems: string[] = [];
                    let listType: "ul" | "ol" = "ul";
                    let inCodeBlock = false;
                    let codeBlockLines: string[] = [];
                    let codeBlockLang = "";

                    const formatInline = (text: string) => {
                      return text
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.+?)\*/g, "<em>$1</em>")
                          .replace(/`(.+?)`/g, '<code class="font-mono text-sm bg-[hsl(var(--muted))] px-1 py-0.5 rounded">$1</code>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
                            return `<a href="${url}" class="text-[hsl(var(--accent))] underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer">${label}</a>`;
                          });
                    };

                    const flushList = (index: number) => {
                      if (inList && listItems.length > 0) {
                        const ListTag = listType;
                        result.push(
                            <ListTag key={`list-${index}`} className={listType === "ul" ? "list-disc list-inside" : "list-decimal list-inside"}>
                              {listItems.map((item, i) => (
                                  <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                              ))}
                            </ListTag>
                        );
                        listItems = [];
                        inList = false;
                      }
                    };

                    const flushCodeBlock = (index: number) => {
                      if (inCodeBlock && codeBlockLines.length > 0) {
                        result.push(
                            <div key={`code-${index}`} className="my-4">
                              {codeBlockLang && (
                                  <div className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-3 py-1 rounded-t border border-b-0 border-[hsl(var(--border))]">
                                    {codeBlockLang}
                                  </div>
                              )}
                              <pre className={`bg-[hsl(var(--muted))] border border-[hsl(var(--border))] p-4 overflow-x-auto font-mono text-sm text-[hsl(var(--foreground))] ${codeBlockLang ? "rounded-b" : "rounded"}`}>
                              <code className="text-[hsl(var(--foreground))]">{codeBlockLines.join("\n")}</code>
                            </pre>
                            </div>
                        );
                        codeBlockLines = [];
                        codeBlockLang = "";
                        inCodeBlock = false;
                      }
                    };

                    lines.forEach((line, i) => {
                      const trimmed = line.trim();

                      if (line.startsWith("```") || trimmed === "`") {
                        if (inCodeBlock) {
                          flushCodeBlock(i);
                        } else {
                          flushList(i);
                          inCodeBlock = true;
                          codeBlockLang = line.startsWith("```") ? line.slice(3).trim() : "";
                        }
                        return;
                      }

                      if (inCodeBlock) {
                        codeBlockLines.push(line);
                        return;
                      }

                      if (line.match(/^[-*]\s+(.+)/)) {
                        const match = line.match(/^[-*]\s+(.+)/);
                        if (!inList) {
                          inList = true;
                          listType = "ul";
                        }
                        if (match) listItems.push(match[1]);
                        return;
                      }

                      if (line.match(/^\d+\.\s+(.+)/)) {
                        const match = line.match(/^\d+\.\s+(.+)/);
                        if (!inList) {
                          inList = true;
                          listType = "ol";
                        }
                        if (match) listItems.push(match[1]);
                        return;
                      }

                      flushList(i);

                      if (line.startsWith("# ")) {
                        result.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(2)}</h2>);
                      } else if (line.startsWith("## ")) {
                        result.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(3)}</h2>);
                      } else if (line.startsWith("### ")) {
                        result.push(<h3 key={i} className="text-xl font-bold mt-6 mb-3 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(4)}</h3>);
                      } else if (line.startsWith("> ")) {
                        result.push(<blockquote key={i} className="border-l-4 border-[hsl(var(--accent))] pl-4 italic my-4 text-[hsl(var(--muted-foreground))]">{line.slice(2)}</blockquote>);
                      } else if (line.startsWith("---")) {
                        result.push(<hr key={i} className="my-8 border-[hsl(var(--border))]" />);
                      } else if (line === "") {
                        result.push(<br key={i} />);
                      } else {
                        result.push(<p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />);
                      }
                    });

                    flushList(lines.length);
                    flushCodeBlock(lines.length);

                    return result;
                  })()}
                </div>
            ) : (
                <div className="prose-editorial text-[hsl(var(--muted-foreground))] italic">
                  This post has no content yet.
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-[hsl(var(--border))] flex items-center justify-between">
              <ShareButtons title={post.title} url={postUrl} />
              {post.section_slug && (
                  <Link href={`/section/${post.section_slug}`}
                        className="text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors">
                    More in {post.section_slug} →
                  </Link>
              )}
            </div>
          </div>
        </article>
      </>
  );
}
