"use client";

import React from "react";
import { MarkdownContent } from "@/components/reader/markdown-content";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return <MarkdownContent content={content} />;
}
