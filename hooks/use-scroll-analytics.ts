"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/utils";

export function useScrollAnalytics(postId?: string) {
  const milestones = useRef(new Set<number>());
  const startTime = useRef(Date.now());

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    const path = window.location.pathname;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      [25, 50, 75, 100].forEach((milestone) => {
        if (pct >= milestone && !milestones.current.has(milestone)) {
          milestones.current.add(milestone);
          trackEvent({ type: "scroll_depth", session_id: sessionId, post_id: postId, path, scroll_pct: milestone });
          if (milestone === 100) {
            trackEvent({ type: "read_complete", session_id: sessionId, post_id: postId, path });
          }
        }
      });
    };

    const handleUnload = () => {
      const duration = Date.now() - startTime.current;
      trackEvent({ type: "session_end", session_id: sessionId, post_id: postId, path, duration_ms: duration });
    };

    trackEvent({ type: postId ? "post_view" : "page_view", session_id: sessionId, post_id: postId, path, referrer: document.referrer });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [postId]);
}
