"use client";

import { useEffect } from "react";

export default function AboutRedirect() {
  useEffect(() => {
    window.location.replace("/#about");
  }, []);

  return (
    <div className="pt-28 max-w-6xl mx-auto px-6 py-20 font-sans text-[hsl(var(--muted-foreground))]">
      Redirecting…
    </div>
  );
}
