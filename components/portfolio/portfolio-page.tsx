"use client";

import type { Post } from "@/types";
import { PortfolioScrollSpy } from "@/components/portfolio/portfolio-scroll-spy";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import { PortfolioProjects } from "@/components/portfolio/portfolio-projects";
import { PortfolioOSS } from "@/components/portfolio/portfolio-oss";
import { PortfolioSkills } from "@/components/portfolio/portfolio-skills";
import { PortfolioWriting } from "@/components/portfolio/portfolio-writing";

type PortfolioPageProps = {
  posts: Post[];
  latestPost?: Post | null;
};

export function PortfolioPage({ posts, latestPost }: PortfolioPageProps) {
  return (
    <>
      <PortfolioScrollSpy />
      <PortfolioHero latestPost={latestPost} />
      <PortfolioAbout />
      <div className="flex items-center gap-4 max-w-6xl mx-auto px-6">
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
        <span className="text-[hsl(var(--accent))] text-lg">✦</span>
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
      </div>
      <PortfolioExperience />
      <PortfolioProjects />
      <PortfolioOSS />
      <PortfolioSkills />
      <PortfolioWriting posts={posts} />
    </>
  );
}
