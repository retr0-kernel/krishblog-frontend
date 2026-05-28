"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const MAX_CLAPS = 50;

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("blog_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("blog_session_id", id);
  }
  return id;
}

interface ClapsProps {
  postId: string;
}

export function Claps({ postId }: ClapsProps) {
  const [totalClaps, setTotalClaps] = useState(0);
  const [userClaps, setUserClaps] = useState(0);
  const [pending, setPending] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [floatKey, setFloatKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`${API_URL}/v1/public/posts/${postId}/claps?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTotalClaps(d.data.total_claps ?? 0);
          setUserClaps(d.data.user_claps ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [postId]);

  // Debounce: flush pending claps
  useEffect(() => {
    if (pending === 0) return;
    const timer = setTimeout(async () => {
      const sessionId = getSessionId();
      try {
        const res = await fetch(`${API_URL}/v1/public/posts/${postId}/claps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, count: pending }),
        });
        const d = await res.json();
        if (d.success) {
          setTotalClaps(d.data.total_claps ?? 0);
          setUserClaps(d.data.user_claps ?? 0);
        }
      } catch {}
      setPending(0);
    }, 600);
    return () => clearTimeout(timer);
  }, [pending, postId]);

  const handleClap = useCallback(() => {
    if (userClaps + pending >= MAX_CLAPS) return;
    setPending(p => p + 1);
    setTotalClaps(t => t + 1);
    setFloatKey(k => k + 1);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 300);
  }, [userClaps, pending]);

  const clapped = userClaps + pending > 0;
  const canClap = userClaps + pending < MAX_CLAPS;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Floating +1 animation */}
        <AnimatePresence>
          {pending > 0 && (
            <motion.div
              key={floatKey}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-[hsl(var(--accent))] pointer-events-none"
            >
              +{pending}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleClap}
          disabled={!canClap || isLoading}
          aria-label="Clap for this post"
          className={`relative w-14 h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center
            ${clapped
              ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/10]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))/50]"
            }
            ${canClap ? "cursor-pointer hover:scale-105 active:scale-95" : "opacity-50 cursor-default"}
            ${showPulse ? "scale-110" : ""}
          `}
        >
          <Heart
            className={`h-6 w-6 transition-colors ${clapped ? "fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]"}`}
          />
        </button>
      </div>

      <span className="text-sm font-sans text-[hsl(var(--muted-foreground))]">
        {isLoading ? "—" : totalClaps > 0 ? `${totalClaps.toLocaleString()} clap${totalClaps === 1 ? "" : "s"}` : "Be the first to clap"}
      </span>

      {userClaps + pending > 0 && (
        <span className="text-xs font-sans text-[hsl(var(--accent))]">
          You clapped {userClaps + pending} time{userClaps + pending === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}

