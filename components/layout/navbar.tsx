"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavModeToggle } from "@/components/layout/nav-mode-toggle";
import { NavLinkStrip } from "@/components/layout/nav-link-strip";
import type { Section } from "@/types";

export function Navbar({ sections = [] }: { sections?: Section[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 60], ["0 0 0 0 transparent", "0 1px 0 0 hsl(var(--border))"]);

  return (
      <motion.header className="fixed top-0 left-0 right-0 z-50" style={{ boxShadow: shadow }}>
        <div className="absolute inset-0 bg-[hsl(var(--background)/0.88)] backdrop-blur-md" />
        <nav className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="font-bold text-xl shrink-0"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Krish<span className="text-[hsl(var(--accent))]">.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-3 flex-1 min-w-0 justify-center overflow-visible">
            <NavModeToggle className="shrink-0" />
            <NavLinkStrip sections={sections} />
          </div>

          <div className="flex items-center gap-1 ml-auto shrink-0">
            <NavModeToggle className="lg:hidden shrink-0" />
            <Link
              href="/search"
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
          className="lg:hidden overflow-hidden relative bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <NavLinkStrip
              sections={sections}
              orientation="vertical"
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </motion.div>
      </motion.header>
  );
}
