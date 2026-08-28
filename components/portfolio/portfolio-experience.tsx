"use client";

import { portfolio } from "@/content/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { TimelineItem } from "@/components/portfolio/timeline-item";

export function PortfolioExperience() {
  const { experience } = portfolio;

  return (
    <section id="experience" className="scroll-mt-28 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've built"
          description="Platform engineering, reliability, and developer experience at scale."
        />
        <div className="max-w-3xl">
          {experience.map((entry, i) => (
            <TimelineItem
              key={entry.company}
              entry={entry}
              index={i}
              isLast={i === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
