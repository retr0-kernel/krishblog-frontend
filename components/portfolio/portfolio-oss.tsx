"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitPullRequest } from "lucide-react";
import { portfolio } from "@/content/portfolio";
import { SectionHeading } from "@/components/portfolio/section-heading";

export function PortfolioOSS() {
  const { openSource } = portfolio;

  return (
    <section id="oss" className="scroll-mt-28 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Open Source"
          title="Contributions"
          description="Patches and improvements upstream in the Go ecosystem."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {openSource.map((item, i) => (
            <motion.article
              key={item.repo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 hover:border-[hsl(var(--accent)/0.35)] transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <GitPullRequest className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]">
                  {item.repo}
                </span>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {item.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[hsl(var(--muted-foreground))] mb-4">
                {item.description}
              </p>
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:gap-2 transition-all"
                >
                  View Pull Request
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
