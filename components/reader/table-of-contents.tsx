"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TocItem { id: string; text: string; level: number; }

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);
  const ignoreScrollUntilRef = useRef(0);
  const pinnedActiveRef = useRef<string | null>(null);
  const headingsRef = useRef<HTMLElement[]>([]);
  const tocRef = useRef<TocItem[]>([]);
  const headerOffsetRef = useRef(120);

  const updateActiveFromScroll = useCallback(() => {
    if (Date.now() < ignoreScrollUntilRef.current) {
      const pinned = pinnedActiveRef.current;
      if (pinned) setActive((prev) => (prev === pinned ? prev : pinned));
      return;
    }
    const headings = headingsRef.current;
    const toc = tocRef.current;
    if (headings.length === 0 || toc.length === 0) return;
    const targetY = window.scrollY + headerOffsetRef.current;
    let current = toc[0]?.id ?? "";
    for (let i = 0; i < headings.length; i += 1) {
      const top = headings[i].getBoundingClientRect().top + window.scrollY;
      if (top <= targetY) current = headings[i].id;
      else break;
    }
    if (current) setActive((prev) => (prev === current ? prev : current));
  }, []);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".prose-editorial h2, .prose-editorial h3"));
    const toc: TocItem[] = [];
    headings.forEach((el, i) => {
      const id = el.id || `heading-${i}`;
      el.id = id;
      toc.push({ id, text: el.textContent ?? "", level: el.tagName === "H2" ? 2 : 3 });
    });
    headingsRef.current = headings;
    tocRef.current = toc;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(toc);

    const updateVisibleFromScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(pct > 0.05 && toc.length > 1);
    };

    const handleScroll = () => {
      updateVisibleFromScroll();
      updateActiveFromScroll();
    };

    const handleHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (id) setActive((prev) => (prev === id ? prev : id));
    };

    updateVisibleFromScroll();
    updateActiveFromScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [updateActiveFromScroll]);

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
                         onClick={(event) => {
                           event.preventDefault();
                           pinnedActiveRef.current = item.id;
                           ignoreScrollUntilRef.current = Date.now() + 700;
                           setActive((prev) => (prev === item.id ? prev : item.id));
                           history.replaceState(null, "", `#${item.id}`);
                           const target = document.getElementById(item.id);
                           if (target) {
                             target.scrollIntoView({ behavior: "smooth", block: "start" });
                           }
                           window.setTimeout(() => {
                             pinnedActiveRef.current = null;
                             updateActiveFromScroll();
                           }, 700);
                         }}
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
