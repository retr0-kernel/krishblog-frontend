"use client";

import { portfolio } from "@/content/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ProjectCard } from "@/components/portfolio/project-card";

export function PortfolioProjects() {
  const { projects } = portfolio;

  return (
    <section id="projects" className="scroll-mt-28 py-20 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work"
          description="Systems I've designed and shipped — from distributed storage to full-stack products."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
