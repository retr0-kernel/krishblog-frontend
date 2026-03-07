"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sun, Moon, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/types";

interface NavbarProps {
  sections?: Section[];
}

export function Navbar({ sections = [] }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ borderBottomWidth: 1, borderBottomColor: `hsl(var(--border) / ${borderOpacity.get()})` }}
    >
      <div
        className="absolute inset-0 bg-[hsl(var(--background)/0.85)]"
        style={{ backdropFilter: "blur(12px)" }}
      />
      <nav className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl font-bold tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            Krish<span className="text-[hsl(var(--accent))]">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {sections.slice(0, 5).map((s) => (
            <Link
              key={s.id}
              href={`/section/${s.slug}`}
              className="px-3 py-1.5 text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              {s.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden relative bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]"
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`/section/${s.slug}`}
              className="text-sm font-sans py-1"
              onClick={() => setMobileOpen(false)}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}
