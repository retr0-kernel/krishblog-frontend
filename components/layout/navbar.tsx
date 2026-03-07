"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { Section } from "@/types";

export function Navbar({ sections = [] }: { sections?: Section[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 60], ["0 0 0 0 transparent", "0 1px 0 0 hsl(var(--border))"]);

  return (
      <motion.header className="fixed top-0 left-0 right-0 z-50" style={{ boxShadow: shadow }}>
        <div className="absolute inset-0 bg-[hsl(var(--background)/0.88)] backdrop-blur-md" />
        <nav className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
            Krish<span className="text-[hsl(var(--accent))]">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {sections.slice(0, 5).map((s) => (
                <Link key={s.id} href={`/section/${s.slug}`}
                      className="px-3 py-1.5 text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                  {s.name}
                </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Link href="/search" className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors">
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
        <motion.div initial={false} animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
                    className="md:hidden overflow-hidden relative bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
          <div className="px-6 py-4 flex flex-col gap-3">
            {sections.map((s) => (
                <Link key={s.id} href={`/section/${s.slug}`} className="text-sm font-sans py-1" onClick={() => setMobileOpen(false)}>
                  {s.name}
                </Link>
            ))}
          </div>
        </motion.div>
      </motion.header>
  );
}
