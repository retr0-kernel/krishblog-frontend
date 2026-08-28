"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={centered ? "text-center max-w-2xl mx-auto mb-12" : "mb-10"}
    >
      <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-3">
        {eyebrow}
      </p>
      <h2
        className="text-3xl md:text-4xl font-bold leading-tight"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
