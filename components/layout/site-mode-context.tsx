"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type SiteMode = "portfolio" | "blog";

type SiteModeContextValue = {
  mode: SiteMode;
  direction: number;
  activeSection: string | null;
  setMode: (mode: SiteMode) => void;
  setActiveSection: (id: string | null) => void;
};

const SiteModeContext = createContext<SiteModeContextValue | null>(null);

const STORAGE_KEY = "kb-nav-mode";
const MODE_EVENT = "kb-nav-mode-change";

function routeDefaultMode(pathname: string): SiteMode {
  if (pathname === "/") return "portfolio";
  if (
    pathname.startsWith("/post/") ||
    pathname.startsWith("/section/") ||
    pathname === "/search"
  ) {
    return "blog";
  }
  return "portfolio";
}

function readMode(pathname: string): SiteMode {
  if (pathname === "/") {
    const stored = localStorage.getItem(STORAGE_KEY) as SiteMode | null;
    if (stored === "portfolio" || stored === "blog") return stored;
    return "portfolio";
  }
  return routeDefaultMode(pathname);
}

function subscribeMode(onChange: () => void) {
  window.addEventListener(MODE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(MODE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function SiteModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(1);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const mode = useSyncExternalStore(
    subscribeMode,
    () => readMode(pathname),
    () => routeDefaultMode(pathname),
  );

  const setMode = useCallback(
    (next: SiteMode) => {
      if (next === mode) return;
      setDirection(next === "blog" ? 1 : -1);
      if (pathname === "/") {
        localStorage.setItem(STORAGE_KEY, next);
      }
      window.dispatchEvent(new Event(MODE_EVENT));
    },
    [mode, pathname],
  );

  const value = useMemo(
    () => ({
      mode,
      direction,
      activeSection,
      setMode,
      setActiveSection,
    }),
    [mode, direction, activeSection, setMode],
  );

  return (
    <SiteModeContext.Provider value={value}>{children}</SiteModeContext.Provider>
  );
}

export function useSiteMode() {
  const ctx = useContext(SiteModeContext);
  if (!ctx) {
    throw new Error("useSiteMode must be used within SiteModeProvider");
  }
  return ctx;
}
