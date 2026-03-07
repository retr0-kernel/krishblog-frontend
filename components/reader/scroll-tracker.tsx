"use client";
import { useScrollAnalytics } from "@/hooks/use-scroll-analytics";

export function ScrollTracker({ postId }: { postId?: string }) {
  useScrollAnalytics(postId);
  return null;
}
