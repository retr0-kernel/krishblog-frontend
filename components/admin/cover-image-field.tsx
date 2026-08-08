"use client";

import Image from "next/image";
import { ExternalLink, Trash2 } from "lucide-react";
import {
    IMAGES_REPO_GITHUB,
    imageRepoPath,
    resolveImageUrl,
} from "@/lib/images-repo";
import { cn } from "@/lib/utils";

interface CoverImageFieldProps {
    value: string;
    alt: string;
    onChange: (url: string) => void;
    onAltChange: (alt: string) => void;
}

export function CoverImageField({ value, alt, onChange, onAltChange }: CoverImageFieldProps) {
    const displayPath = imageRepoPath(value);
    const resolved = value ? resolveImageUrl(value) : "";

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    "relative rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] overflow-hidden",
                    resolved ? "aspect-[16/10]" : "p-4"
                )}
            >
                {resolved ? (
                    <>
                        <Image src={resolved} alt={alt || "Cover preview"} fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => onChange("")}
                                    className="h-8 w-8 flex items-center justify-center rounded bg-white/90 text-red-600 hover:bg-white"
                                    aria-label="Remove cover image"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 px-2">
                        <p className="text-xs font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
                            Add an image to{" "}
                            <a
                                href={IMAGES_REPO_GITHUB}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[hsl(var(--accent))] hover:underline inline-flex items-center gap-0.5"
                            >
                                krishblog-images
                                <ExternalLink className="h-3 w-3" />
                            </a>
                            , then paste the path below.
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-[10px] font-sans text-[hsl(var(--muted-foreground))] mb-1">
                    Image path or URL
                </label>
                <input
                    value={displayPath}
                    onChange={(e) => onChange(resolveImageUrl(e.target.value))}
                    placeholder="covers/my-post.png"
                    className="w-full h-8 px-2 text-xs font-mono bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
                />
                <p className="mt-1 text-[10px] font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Relative path from repo root, e.g. <code className="font-mono">diagrams/arch.png</code>
                </p>
            </div>

            <input
                value={alt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Alt text (accessibility)"
                className="w-full h-8 px-2 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
            />

            <a
                href={IMAGES_REPO_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-sans text-[hsl(var(--accent))] hover:underline"
            >
                Open images repo <ExternalLink className="h-3 w-3" />
            </a>
        </div>
    );
}
