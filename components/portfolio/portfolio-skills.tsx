"use client";

import { portfolio } from "@/content/portfolio";
import { getCategoryIcon } from "@/lib/skill-icons";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { SkillPill } from "@/components/portfolio/skill-pill";

function MarqueeRow({ skills, reverse }: { skills: string[]; reverse?: boolean }) {
  const renderSegment = (id: "a" | "b") => (
    <div
      className="flex items-center gap-3 pr-3 shrink-0"
      aria-hidden={id === "b" ? true : undefined}
    >
      {skills.map((skill) => (
        <SkillPill key={`${id}-${skill}`} label={skill} className="shrink-0" />
      ))}
    </div>
  );

  return (
    <div className="skill-marquee-row group/marquee">
      <div className={`skill-marquee-track ${reverse ? "skill-marquee-reverse" : ""}`}>
        {renderSegment("a")}
        {renderSegment("b")}
      </div>
    </div>
  );
}

export function PortfolioSkills() {
  const { skills } = portfolio;
  const allSkills = skills.flatMap((g) => g.skills);
  const midpoint = Math.ceil(allSkills.length / 2);
  const rowA = allSkills.slice(0, midpoint);
  const rowB = allSkills.slice(midpoint);

  return (
    <section id="skills" className="scroll-mt-28 py-20 border-t border-[hsl(var(--border))] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <SectionHeading
          eyebrow="Skills"
          title="Tech stack"
          description="Languages, platforms, and tooling I work with day to day."
          align="center"
        />
      </div>

      <div className="hidden md:block space-y-3 mb-12">
        <MarqueeRow skills={rowA} />
        <MarqueeRow skills={rowB.length ? rowB : rowA} reverse />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((group) => {
            const CategoryIcon = getCategoryIcon(group.category);
            return (
              <div
                key={group.category}
                className="flex flex-col min-h-[220px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--accent)/0.3)] transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[hsl(var(--border))]">
                  <span className="h-8 w-8 rounded-lg bg-[hsl(var(--accent)/0.1)] flex items-center justify-center">
                    <CategoryIcon className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden />
                  </span>
                  <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--foreground))]">
                    {group.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 content-start flex-1">
                  {group.skills.map((s) => (
                    <SkillPill key={s} label={s} className="text-xs px-2.5 py-1.5" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
