"use client";
import { useReadingProgress } from "@/hooks/use-reading-progress";

export function ReadingProgress() {
  const progress = useReadingProgress();
  return <div id="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}
