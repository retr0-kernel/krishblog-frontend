"use client";
import { useState } from "react";
import { Twitter, Link2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 font-sans">
      <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Share</span>
      <button
        onClick={shareTwitter}
        className="h-9 w-9 flex items-center justify-center border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={copyLink}
        className="h-9 w-9 flex items-center justify-center border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
        aria-label="Copy link"
      >
        <motion.span
          key={copied ? "check" : "link"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
        </motion.span>
      </button>
    </div>
  );
}
