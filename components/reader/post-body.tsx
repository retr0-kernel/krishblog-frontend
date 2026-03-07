"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import type { PostBlock } from "@/types";

function CodeBlock({ content, attrs }: { content: string; attrs?: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const lang = (attrs?.language as string) ?? "code";
  return (
      <div className="relative group my-6">
        <div className="flex items-center justify-between bg-[hsl(20_14%_12%)] px-4 py-2 rounded-t-lg">
          <span className="text-xs font-mono text-[hsl(42_20%_50%)]">{lang}</span>
          <button onClick={async () => { await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-[hsl(42_20%_50%)] hover:text-white transition-colors" aria-label="Copy code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <pre className="bg-[hsl(20_14%_8%)] text-[hsl(42_20%_88%)] p-5 rounded-b-lg overflow-x-auto font-mono text-sm leading-relaxed m-0">
        <code>{content}</code>
      </pre>
      </div>
  );
}

function renderBlock(block: PostBlock) {
  switch (block.type) {
    case "heading": {
      const level = (block.attrs?.level as number) ?? 2;
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return <Tag key={block.id}>{block.content}</Tag>;
    }
    case "paragraph": return <p key={block.id}>{block.content}</p>;
    case "quote": return <blockquote key={block.id}>{block.content}</blockquote>;
    case "code": return <CodeBlock key={block.id} content={block.content} attrs={block.attrs} />;
    case "image": return (
        <figure key={block.id} className="my-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
            <Image src={block.content} alt={(block.attrs?.alt as string) ?? ""} fill className="object-cover" />
          </div>
          {typeof block.attrs?.caption === "string" && (
              <figcaption className="text-center text-xs font-sans text-[hsl(var(--muted-foreground))] mt-2">{block.attrs.caption}</figcaption>
          )}
        </figure>
    );
    case "divider": return (
        <div key={block.id} className="my-10 flex items-center justify-center gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="w-1 h-1 rounded-full bg-[hsl(var(--accent))]" />)}
        </div>
    );
    case "callout": return (
        <div key={block.id} className="my-6 border-l-4 border-[hsl(var(--accent))] bg-[hsl(var(--secondary))] px-5 py-4 rounded-r-sm">
          <p className="m-0 font-sans">{block.content}</p>
        </div>
    );
    case "list": return (
        <ul key={block.id} className="my-4 pl-6 space-y-2">
          {block.content.split("\n").filter(Boolean).map((item, i) => <li key={i} className="list-disc">{item}</li>)}
        </ul>
    );
    default: return <p key={block.id}>{block.content}</p>;
  }
}

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="prose-editorial">
        {sorted.map((block, i) => (
            <motion.div key={block.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.03 }}>
              {renderBlock(block)}
            </motion.div>
        ))}
      </motion.div>
  );
}
