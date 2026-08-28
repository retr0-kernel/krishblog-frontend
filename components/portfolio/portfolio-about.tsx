"use client";

import { motion } from "framer-motion";
import { portfolio } from "@/content/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function PortfolioAbout() {
  const { about, education } = portfolio;

  return (
    <section id="about" className="scroll-mt-28 py-20 border-t border-[hsl(var(--border))]">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-6">
        <SectionHeading eyebrow="About" title="Hi, I'm Krish." />
        <div className="space-y-5 font-sans text-base leading-relaxed -mt-4">
          {about.paragraphs.map((p) => (
            <motion.p
              key={p.slice(0, 40)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-2">
              Education
            </p>
            {education.map((edu) => (
              <div key={edu.school}>
                <p className="font-sans font-medium">{edu.degree}</p>
                <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">
                  {edu.school} · {edu.period}
                  {edu.detail ? ` · ${edu.detail}` : ""}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
