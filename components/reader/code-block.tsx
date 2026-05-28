"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Copy, Check } from "lucide-react";

const SyntaxHighlighter = dynamic(
  () => import("./_syntax-highlighter"),
  { ssr: false, loading: () => null }
);

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = resolvedTheme === "dark";
  const displayLang = language || "text";
  const lineCount = code.split("\n").length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [code]);

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-[hsl(var(--border))]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
        <span className="text-[11px] font-mono font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors px-2 py-1 rounded hover:bg-[hsl(var(--secondary))]"
          aria-label="Copy code"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-green-500" /><span className="text-green-500">Copied!</span></>
          ) : (
            <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>
          )}
        </button>
      </div>

      {/* Code — SyntaxHighlighter loads async; plain <pre> shown on SSR/loading */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          code={code}
          language={displayLang}
          isDark={isDark}
          showLineNumbers={lineCount > 5}
        />
      </div>
    </div>
  );
}
