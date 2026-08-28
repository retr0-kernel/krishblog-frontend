"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectEntry } from "@/content/portfolio";

export function ProjectCard({ project, index }: { project: ProjectEntry; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-[300px] perspective-1000"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-expanded={flipped}
        aria-label={`${flipped ? "Hide" : "Show"} details for ${project.name}`}
        className="relative w-full h-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden flex flex-col rounded-xl border border-[hsl(var(--border))]",
              "bg-[hsl(var(--card))] p-6 hover:border-[hsl(var(--accent)/0.35)] transition-colors",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {project.name}
                </h3>
                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">
                  {project.subtitle}
                </p>
              </div>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors"
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-auto">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-sans font-medium uppercase tracking-wide px-2 py-0.5 rounded bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] mt-4">
              Tap to flip →
            </p>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180 flex flex-col rounded-xl border border-[hsl(var(--accent)/0.35)]",
              "bg-[hsl(var(--card))] p-6 shadow-[0_8px_30px_hsl(var(--accent)/0.08)]",
            )}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))]">
                Overview
              </p>
              <RotateCcw className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" aria-hidden />
            </div>
            <p className="font-sans text-sm leading-relaxed text-[hsl(var(--foreground)/0.9)] flex-1 overflow-y-auto">
              {project.description}
            </p>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-sans font-medium text-[hsl(var(--accent))] mt-4 hover:gap-2 transition-all"
              >
                View repository
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </button>
    </motion.article>
  );
}
