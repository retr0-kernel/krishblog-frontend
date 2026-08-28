"use client";

import { motion } from "framer-motion";
import type { ExperienceEntry } from "@/content/portfolio";

export function TimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: ExperienceEntry;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {!isLast && (
        <span
          className="absolute left-[7px] top-3 bottom-0 w-px bg-[hsl(var(--border))]"
          aria-hidden
        />
      )}
      <span
        className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[hsl(var(--accent))] bg-[hsl(var(--background))]"
        aria-hidden
      />
      <div className="space-y-3">
        <div>
          <p className="text-xs font-sans font-medium uppercase tracking-widest text-[hsl(var(--accent))]">
            {entry.period}
          </p>
          <h3
            className="text-xl font-bold mt-1"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {entry.role}
          </h3>
          <p className="font-sans text-[hsl(var(--muted-foreground))]">
            {entry.company}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
        </div>
        <ul className="space-y-2 font-sans text-sm leading-relaxed text-[hsl(var(--foreground)/0.9)]">
          {entry.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[hsl(var(--accent))] shrink-0 mt-1">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
