"use client";

import React from "react";
import { CodeBlock } from "@/components/reader/code-block";

interface PostContentProps {
  content: string;
}

function formatInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4" />')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="font-mono text-sm bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
      return `<a href="${url}" class="text-[hsl(var(--accent))] underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
}

export function PostContent({ content }: PostContentProps) {
  const lines = content.split("\n");
  const result: React.ReactElement[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = "";

  const flushList = (index: number) => {
    if (inList && listItems.length > 0) {
      const ListTag = listType;
      result.push(
        <ListTag
          key={`list-${index}`}
          className={`font-sans leading-relaxed my-4 pl-6 space-y-1 ${listType === "ul" ? "list-disc" : "list-decimal"}`}
        >
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ListTag>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = (index: number) => {
    if (inCodeBlock) {
      result.push(
        <CodeBlock key={`code-${index}`} code={codeBlockLines.join("\n")} language={codeBlockLang || undefined} />
      );
      codeBlockLines = [];
      codeBlockLang = "";
      inCodeBlock = false;
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(i);
      } else {
        flushList(i);
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    if (line.match(/^[-*]\s+(.+)/)) {
      const match = line.match(/^[-*]\s+(.+)/);
      if (!inList) { inList = true; listType = "ul"; }
      if (match) listItems.push(match[1]);
      return;
    }

    if (line.match(/^\d+\.\s+(.+)/)) {
      const match = line.match(/^\d+\.\s+(.+)/);
      if (!inList) { inList = true; listType = "ol"; }
      if (match) listItems.push(match[1]);
      return;
    }

    flushList(i);

    if (line.startsWith("# ")) {
      result.push(<h1 key={i} className="text-3xl font-bold mt-10 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      result.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      result.push(<h3 key={i} className="text-xl font-semibold mt-6 mb-3 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("#### ")) {
      result.push(<h4 key={i} className="text-lg font-semibold mt-5 mb-2 scroll-mt-24">{line.slice(5)}</h4>);
    } else if (line.startsWith("> ")) {
      result.push(
        <blockquote key={i} className="border-l-4 border-[hsl(var(--accent))] pl-5 italic my-6 text-[hsl(var(--muted-foreground))] text-lg leading-relaxed">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.startsWith("---")) {
      result.push(<hr key={i} className="my-10 border-[hsl(var(--border))]" />);
    } else if (line === "") {
      result.push(<div key={i} className="h-4" />);
    } else if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        result.push(
          <div key={i} className="my-8">
            <img src={match[2]} alt={match[1]} className="max-w-full h-auto rounded shadow-sm" />
            {match[1] && (
              <p className="text-sm text-center text-[hsl(var(--muted-foreground))] mt-2 italic">{match[1]}</p>
            )}
          </div>
        );
      }
    } else {
      result.push(
        <p key={i} className="font-sans leading-relaxed text-[hsl(var(--foreground))] my-3" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  });

  flushList(lines.length);
  flushCodeBlock(lines.length);

  return <div className="prose-editorial">{result}</div>;
}

