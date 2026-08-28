"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { portfolioNavLinks } from "@/content/portfolio";
import { useSiteMode } from "@/components/layout/site-mode-context";
import type { Section } from "@/types";

type NavLinkStripProps = {
  sections: Section[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

export function NavLinkStrip({
  sections,
  orientation = "horizontal",
  onNavigate,
}: NavLinkStripProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { mode, direction, activeSection } = useSiteMode();
  const isVertical = orientation === "vertical";
  const onHome = pathname === "/";

  const linkClass = (active: boolean) =>
    cn(
      "font-sans transition-colors whitespace-nowrap",
      isVertical ? "text-sm py-1" : "px-2.5 py-1.5 text-sm",
      active
        ? "text-[hsl(var(--accent))] font-medium"
        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
    );

  const links =
    mode === "portfolio"
      ? portfolioNavLinks.map((link) => {
          const active = onHome && activeSection === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={linkClass(active)}
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          );
        })
      : sections.length > 0
        ? sections.map((s) => (
            <Link
              key={s.id}
              href={`/section/${s.slug}`}
              className={linkClass(pathname === `/section/${s.slug}`)}
              onClick={onNavigate}
            >
              {s.name}
            </Link>
          ))
        : [
            <Link key="search" href="/search" className={linkClass(false)} onClick={onNavigate}>
              All posts
            </Link>,
          ];

  return (
    <div className={cn(isVertical ? "w-full" : "flex-1 min-w-0 overflow-x-auto no-scrollbar")}>
      <motion.div
        key={mode}
        initial={reduced ? { opacity: 0.6 } : { x: direction * 32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 420, damping: 36 }
        }
        className={cn(
          isVertical ? "flex flex-col gap-2" : "flex items-center gap-0.5 justify-center min-w-max mx-auto",
        )}
      >
        {links}
      </motion.div>
    </div>
  );
}
