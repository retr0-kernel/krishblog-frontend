import type { Metadata } from "next";
import type { Post } from "@/types";
import { getPosts } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { portfolio } from "@/content/portfolio";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.krishsrivastava.com";

export const metadata: Metadata = {
  title: "Krish Srivastava — Software Engineer",
  description: portfolio.hero.tagline,
  openGraph: {
    title: "Krish Srivastava — Software Engineer",
    description: portfolio.hero.tagline,
    url: siteUrl,
    type: "profile",
  },
};

export const revalidate = 60;

function portfolioJsonLd() {
  const { hero } = portfolio;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: hero.name,
      jobTitle: hero.title,
      email: hero.email,
      url: siteUrl,
      sameAs: [hero.socials.github, hero.socials.linkedin, hero.socials.twitter],
    },
  };
}

export default async function HomePage() {
  let allPosts: Post[] = [];
  try {
    const data = await getPosts({ per_page: 12 });
    allPosts = data?.posts ?? [];
  } catch { /* show empty state */ }

  const latestPost = allPosts.length > 0 ? allPosts[0] : null;

  return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioJsonLd()) }}
        />
        <PortfolioPage posts={allPosts} latestPost={latestPost} />
      </>
  );
}
