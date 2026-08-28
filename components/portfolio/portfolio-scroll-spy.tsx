"use client";

import { useEffect } from "react";
import { portfolioNavLinks } from "@/content/portfolio";
import { useSiteMode } from "@/components/layout/site-mode-context";

export function PortfolioScrollSpy() {
  const { setActiveSection } = useSiteMode();

  useEffect(() => {
    const sectionIds = portfolioNavLinks.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
