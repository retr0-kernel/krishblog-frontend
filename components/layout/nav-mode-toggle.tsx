"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSiteMode, type SiteMode } from "@/components/layout/site-mode-context";

const modes: { value: SiteMode; label: string }[] = [
  { value: "portfolio", label: "Portfolio" },
  { value: "blog", label: "Blog" },
];

export function NavModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useSiteMode();

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/0.5)] p-0.5",
        className,
      )}
      role="tablist"
      aria-label="Navigation mode"
    >
      {modes.map(({ value, label }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setMode(value)}
            className={cn(
              "relative z-10 px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-colors min-w-[4.5rem]",
              active
                ? "text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-mode-thumb"
                className="absolute inset-0 rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
