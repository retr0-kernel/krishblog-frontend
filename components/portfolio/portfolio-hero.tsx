"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { portfolio } from "@/content/portfolio";
import type { Post } from "@/types";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ScrollExploreCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 60, 120], [1, 0.6, 0]);
  const lift = useTransform(scrollY, [0, 160], [0, 24]);

  return (
    <motion.a
      href="#about"
      style={{ opacity, y: lift, x: "-50%" }}
      className="hidden md:flex absolute bottom-10 left-1/2 flex-col items-center gap-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors z-10"
      aria-label="Scroll to about section"
    >
      <span className="text-[10px] font-sans uppercase tracking-[0.2em]">Explore</span>
      <span className="scroll-cue-arrow inline-flex">
        <ArrowDown className="h-4 w-4" />
      </span>
    </motion.a>
  );
}

export function PortfolioHero({ latestPost }: { latestPost?: Post | null }) {
  const { hero } = portfolio;

  return (
    <section className="relative pt-28 pb-20 md:pb-24 md:min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="max-w-6xl mx-auto px-6 flex-1 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-4">
              Software Engineer
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.08] mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {hero.name}
            </h1>
            <p className="text-lg md:text-xl font-sans text-[hsl(var(--muted-foreground))] mb-2">
              {hero.title} @ {hero.company}
            </p>
            <p className="font-sans text-base leading-relaxed text-[hsl(var(--foreground)/0.85)] max-w-xl mb-8">
              {hero.tagline}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <a
                href={`mailto:${hero.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--accent))] text-white text-sm font-sans font-medium hover:opacity-90 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                Email me
              </a>
              <a
                href={hero.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-sm font-sans font-medium hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
              <a
                href={hero.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-sm font-sans font-medium hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={hero.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-sm font-sans font-medium hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>

            {latestPost && (
              <Link
                href={`/post/${latestPost.slug}`}
                className="inline-flex items-center gap-2 text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors group"
              >
                <span className="px-2 py-0.5 rounded bg-[hsl(var(--secondary))] text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
                  Latest
                </span>
                <span className="line-clamp-1">{latestPost.title}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto lg:mx-0"
          >
            <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px]">
              <div className="w-full h-full rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] overflow-hidden flex items-center justify-center">
                {hero.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero.photo} alt={hero.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[hsl(var(--border))] flex items-center justify-center">
                    <span
                      className="text-5xl font-bold text-[hsl(var(--foreground))]"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      K
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-[hsl(var(--accent)/0.25)] -z-10" />
            </div>

            <div className="flex items-center gap-2 mt-6 justify-center lg:justify-start">
              <a
                href={hero.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors"
                aria-label="X / Twitter"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollExploreCue />

      <a
        href="#about"
        className="md:hidden flex justify-center mt-10 flex-col items-center gap-1 text-[hsl(var(--muted-foreground))]"
        aria-label="Scroll to about section"
      >
        <span className="text-[10px] font-sans uppercase tracking-widest">Explore</span>
        <ArrowDown className="h-4 w-4 scroll-cue-arrow" />
      </a>
    </section>
  );
}
