"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TocItem { id: string; text: string; level: number; }

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const headings = document.querySelectorAll(".prose-editorial h2, .prose-editorial h3");
    const toc: TocItem[] = [];
    headings.forEach((el, i) => {
      const id = el.id || `heading-${i}`;
      el.id = id;
      toc.push({ id, text: el.textContent ?? "", level: el.tagName === "H2" ? 2 : 3 });
    });
    setItems(toc);

    const observer = new IntersectionObserver(
        (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
        { rootMargin: "-20% 0% -60% 0%" }
    );
    headings.forEach((h) => observer.observe(h));

    const handleScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(pct > 0.05 && toc.length > 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  if (items.length < 2) return null;

  return (
      <AnimatePresence>
        {visible && (
            <motion.nav initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-56 z-40" aria-label="Table of contents">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Contents</p>
              <ol className="space-y-1.5">
                {items.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}
                         className={cn("block text-xs font-sans leading-tight transition-colors duration-150 truncate",
                             item.level === 3 && "pl-3",
                             active === item.id ? "text-[hsl(var(--accent))] font-medium" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
                        {active === item.id && <span className="inline-block w-1 h-1 rounded-full bg-[hsl(var(--accent))] mr-1.5 mb-0.5" />}
                        {item.text}
                      </a>
                    </li>
                ))}
              </ol>
            </motion.nav>
        )}
      </AnimatePresence>
  );
}
