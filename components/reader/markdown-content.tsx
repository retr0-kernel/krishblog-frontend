"use client";

import React from "react";
import { CodeBlock } from "@/components/reader/code-block";
import { formatInline } from "@/lib/markdown/inline";
import { isTableRow, parseTableCells, isTableSeparator } from "@/lib/markdown/table";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "prose-editorial" }: MarkdownContentProps) {
  const lines = content.split("\n");
  const result: React.ReactElement[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = "";
  let inTable = false;
  let tableRows: string[][] = [];

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

  const flushTable = (index: number) => {
    if (!inTable || tableRows.length === 0) return;

    const [header, ...body] = tableRows;
    result.push(
      <div key={`table-${index}`} className="my-8 overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
        <table className="w-full min-w-[320px] border-collapse text-sm font-sans">
          <thead>
            <tr className="bg-[hsl(var(--muted))]">
              {header.map((cell, ci) => (
                <th
                  key={ci}
                  className="px-4 py-3 text-left font-semibold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))]"
                  dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="border-b border-[hsl(var(--border))] last:border-b-0">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 align-top text-[hsl(var(--foreground))] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(i);
      } else {
        flushTable(i);
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

    if (isTableRow(line)) {
      flushList(i);
      const cells = parseTableCells(line);
      if (isTableSeparator(cells)) return;

      if (!inTable) inTable = true;
      tableRows.push(cells);
      return;
    }

    flushTable(i);

    if (line.match(/^[-*]\s+(.+)/)) {
      const match = line.match(/^[-*]\s+(.+)/);
      if (!inList) {
        inList = true;
        listType = "ul";
      }
      if (match) listItems.push(match[1]);
      return;
    }

    if (line.match(/^\d+\.\s+(.+)/)) {
      const match = line.match(/^\d+\.\s+(.+)/);
      if (!inList) {
        inList = true;
        listType = "ol";
      }
      if (match) listItems.push(match[1]);
      return;
    }

    flushList(i);

    if (line.startsWith("# ")) {
      result.push(
        <h1 key={i} className="text-3xl font-bold mt-10 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      result.push(
        <h2 key={i} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      result.push(
        <h3 key={i} className="text-xl font-semibold mt-6 mb-3 scroll-mt-24" style={{ fontFamily: '"Playfair Display", serif' }}>
          {line.slice(4)}
        </h3>
      );
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
        <p
          key={i}
          className="font-sans leading-relaxed text-[hsl(var(--foreground))] my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
  });

  flushList(lines.length);
  flushTable(lines.length);
  flushCodeBlock(lines.length);

  return <div className={className}>{result}</div>;
}
