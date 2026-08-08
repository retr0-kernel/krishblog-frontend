"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save, Eye, EyeOff, Globe, FileText, Archive,
    ChevronDown, AlertCircle, CheckCircle2, Loader2, Bell,
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
    Heading4, List, ListOrdered, Quote, Code, Code2, Link as LinkIcon, Image as ImageIcon,
    Minus, ExternalLink, RotateCcw
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminCreatePost, adminUpdatePost, adminUpdatePostStatus, adminGetSections, adminGetPosts, adminNotifySubscribers } from "@/lib/api";
import type { Post, Section } from "@/types";
import { cn } from "@/lib/utils";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { imagesRepoMarkdown } from "@/lib/images-repo";

function MarkdownPreview({ content }: { content: string }) {
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
                <ListTag key={`list-${index}`} className={listType === "ul" ? "list-disc list-inside" : "list-decimal list-inside"}>
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
        if (inCodeBlock && codeBlockLines.length > 0) {
            result.push(
                <div key={`code-${index}`} className="my-4">
                    {codeBlockLang && (
                        <div className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-3 py-1 rounded-t border border-b-0 border-[hsl(var(--border))]">
                            {codeBlockLang}
                        </div>
                    )}
                    <pre className={cn(
                        "bg-[hsl(var(--muted))] border border-[hsl(var(--border))] p-4 overflow-x-auto font-mono text-sm text-[hsl(var(--foreground))]",
                        codeBlockLang ? "rounded-b" : "rounded"
                    )}>
                        <code className="text-[hsl(var(--foreground))]">{codeBlockLines.join("\n")}</code>
                    </pre>
                </div>
            );
            codeBlockLines = [];
            codeBlockLang = "";
            inCodeBlock = false;
        }
    };

    const formatInline = (text: string) => {
        return text
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4" />')
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/__(.+?)__/g, "<u>$1</u>")
            .replace(/`(.+?)`/g, '<code class="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-1 py-0.5 rounded text-sm font-mono">$1</code>')
            .replace(/\[(.+?)]\((.+?)\)/g, '<a href="$2" class="text-[hsl(var(--accent))] hover:underline">$1</a>');
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
        } else if (line.match(/^\d+\.\s+(.+)/)) {
            const match = line.match(/^\d+\.\s+(.+)/);
            if (!inList) { inList = true; listType = "ol"; }
            if (match) listItems.push(match[1]);
            return;
        } else {
            flushList(i);
        }

        if (line.startsWith("# ")) {
            result.push(<h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>);
        } else if (line.startsWith("## ")) {
            result.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>);
        } else if (line.startsWith("### ")) {
            result.push(<h3 key={i} className="text-xl font-bold mt-5 mb-2">{line.slice(4)}</h3>);
        } else if (line.startsWith("#### ")) {
            result.push(<h4 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(5)}</h4>);
        } else if (line.startsWith("> ")) {
            result.push(<blockquote key={i} className="border-l-4 border-[hsl(var(--accent))] pl-4 italic">{line.slice(2)}</blockquote>);
        } else if (line.startsWith("---")) {
            result.push(<hr key={i} className="my-6 border-[hsl(var(--border))]" />);
        } else if (line === "") {
            result.push(<br key={i} />);
        } else if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
            const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (match) {
                result.push(
                    <div key={i} className="my-6">
                        <img src={match[2]} alt={match[1]} className="max-w-full h-auto rounded" />
                    </div>
                );
            }
        } else {
            result.push(<p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />);
        }
    });

    flushList(lines.length);
    flushCodeBlock(lines.length);

    return <div className="prose-editorial max-w-none">{result}</div>;
}

interface PostEditorProps {
    post?: Post;
}

interface FormState {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    section_id: string;
    status: "draft" | "published" | "archived";
    is_featured: boolean;
    cover_image: string;
    cover_image_alt: string;
    meta_title: string;
    meta_desc: string;
}

function formFromPost(post?: Post): FormState {
    return {
        title: post?.title ?? "",
        slug: post?.slug ?? "",
        excerpt: post?.excerpt ?? "",
        content: post?.content ?? "",
        section_id: post?.section_id ?? "",
        status: (post?.status ?? "draft") as "draft" | "published" | "archived",
        is_featured: post?.is_featured ?? false,
        cover_image: post?.cover_image ?? "",
        cover_image_alt: post?.cover_image_alt ?? "",
        meta_title: post?.meta_title ?? "",
        meta_desc: post?.meta_desc ?? "",
    };
}

export function PostEditor({ post: initialPost }: PostEditorProps) {
    const { token } = useAuth();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const selectionRef = useRef({ start: 0, end: 0 });

    const [currentPost, setCurrentPost] = useState<Post | undefined>(initialPost);
    const [sections, setSections] = useState<Section[]>([]);
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
    const [seoOpen, setSeoOpen] = useState(false);
    const [notifying, setNotifying] = useState(false);
    const [notifyState, setNotifyState] = useState<"idle" | "sent" | "error">("idle");
    const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
    const [hasDraftRecovery, setHasDraftRecovery] = useState(false);

    const draftKey = `post-draft-${currentPost?.id ?? "new"}`;

    const [form, setForm] = useState<FormState>(() => {
        // New post: restore from localStorage if available
        if (!initialPost) {
            if (typeof window !== "undefined") {
                const savedDraft = localStorage.getItem("post-draft-new");
                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        if (parsed.form) return parsed.form;
                    } catch { /* ignore */ }
                }
            }
            return formFromPost(undefined);
        }
        // Existing post: ALWAYS load from DB
        return formFromPost(initialPost);
    });

    // For existing posts: check if there's a newer localStorage draft and surface it as a banner
    useEffect(() => {
        if (!initialPost) return;
        const key = `post-draft-${initialPost.id}`;
        if (typeof window === "undefined") return;
        const savedDraft = localStorage.getItem(key);
        if (!savedDraft) return;
        try {
            const parsed = JSON.parse(savedDraft);
            const isNewer = parsed.savedAt > (initialPost.updated_at || initialPost.created_at);
            const hasChanges =
                parsed.form?.content !== initialPost.content ||
                parsed.form?.title !== initialPost.title ||
                parsed.form?.excerpt !== initialPost.excerpt;
            if (isNewer && hasChanges) {
                setHasDraftRecovery(true);
            } else {
                localStorage.removeItem(key);
            }
        } catch {
            localStorage.removeItem(key);
        }
    }, [initialPost]);

    // When initialPost arrives from API, sync form from DB
    useEffect(() => {
        if (!initialPost) return;
        setCurrentPost(initialPost);
        if (!hasDraftRecovery) {
            setForm(formFromPost(initialPost));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPost]); // intentionally exclude hasDraftRecovery

    const restoreDraft = useCallback(() => {
        if (typeof window === "undefined") return;
        const savedDraft = localStorage.getItem(draftKey);
        if (!savedDraft) return;
        try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.form) {
                setForm(parsed.form);
                setHasDraftRecovery(false);
            }
        } catch { /* ignore */ }
    }, [draftKey]);

    const discardDraft = useCallback(() => {
        if (typeof window !== "undefined") localStorage.removeItem(draftKey);
        setHasDraftRecovery(false);
        if (currentPost) setForm(formFromPost(currentPost));
    }, [draftKey, currentPost]);

    // Auto-save to localStorage on every form change
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(draftKey, JSON.stringify({ form, savedAt: new Date().toISOString() }));
    }, [form, draftKey]);

    useEffect(() => {
        if (token) adminGetSections(token).then(setSections).catch(() => {});
    }, [token]);

    const handleTitleChange = (title: string) => {
        setForm((f) => ({
            ...f,
            title,
            slug: currentPost ? f.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        }));
    };

    const save = useCallback(async (statusOverride?: "draft" | "published" | "archived") => {
        if (!token || !form.title) return;
        setSaving(true);
        setSaveState("idle");

        const effectiveStatus = (statusOverride ?? form.status) as "draft" | "published" | "archived";

        const payload = {
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt,
            content: form.content,
            section_id: form.section_id || undefined,
            is_featured: form.is_featured,
            cover_image: form.cover_image || undefined,
            cover_image_alt: form.cover_image_alt || undefined,
            meta_title: form.meta_title || undefined,
            meta_desc: form.meta_desc || undefined,
        };

        try {
            let savedPost: Post;
            if (currentPost) {
                savedPost = await adminUpdatePost(token, currentPost.id, payload);
                if (effectiveStatus !== savedPost.status) {
                    savedPost = await adminUpdatePostStatus(token, currentPost.id, effectiveStatus);
                }
            } else {
                savedPost = await adminCreatePost(token, { ...payload, status: effectiveStatus });
                setCurrentPost(savedPost);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("post-draft-new");
                }
                window.history.replaceState({}, '', `/admin/posts/${savedPost.slug}`);
            }

            setCurrentPost(savedPost);
            setForm(formFromPost(savedPost));

            if (typeof window !== "undefined") {
                localStorage.removeItem(draftKey);
            }
            setHasDraftRecovery(false);
            setSaveState("saved");

            if (savedPost.status === "published" && savedPost.slug) {
                setPublishedSlug(savedPost.slug);
            } else {
                setPublishedSlug(null);
            }

            setTimeout(() => setSaveState("idle"), 3000);
        } catch (err) {
            console.error("Save error:", err);

            if (!currentPost) {
                try {
                    const { posts } = await adminGetPosts(token, { q: form.slug, per_page: 1 });
                    const createdPost = posts.find(p => p.slug === form.slug);
                    if (createdPost) {
                        setCurrentPost(createdPost);
                        if (typeof window !== "undefined") {
                            localStorage.removeItem(draftKey);
                            localStorage.removeItem("post-draft-new");
                        }
                        window.history.replaceState({}, '', `/admin/posts/${createdPost.slug}`);
                        setSaveState("saved");
                        alert("⚠️ Post was created but the server encountered an issue during post-processing. The post is saved.");
                        setTimeout(() => setSaveState("idle"), 5000);
                        return;
                    }
                } catch (verifyErr) {
                    console.error("Failed to verify post creation:", verifyErr);
                }
            }

            setSaveState("error");
        } finally {
            setSaving(false);
        }
    }, [token, form, currentPost, draftKey]);

    const updateSelectionFromTextarea = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        selectionRef.current = {
            start: textarea.selectionStart,
            end: textarea.selectionEnd,
        };
    }, []);

    const restoreSelection = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return null;
        const { start, end } = selectionRef.current;
        if (document.activeElement !== textarea) {
            textarea.focus();
            textarea.setSelectionRange(start, end);
        }
        return { start: textarea.selectionStart, end: textarea.selectionEnd };
    }, []);

    const wrapSelection = useCallback((before: string, after: string = before) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selection = restoreSelection();
        if (!selection) return;
        const { start, end } = selection;
        const selectedText = form.content.substring(start, end);
        const beforeText = form.content.substring(0, start);
        const afterText = form.content.substring(end);
        if (selectedText) {
            const newContent = beforeText + before + selectedText + after + afterText;
            setForm((f) => ({ ...f, content: newContent }));
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + before.length, end + before.length);
            }, 0);
        } else {
            const newContent = beforeText + before + after + afterText;
            setForm((f) => ({ ...f, content: newContent }));
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + before.length, start + before.length);
            }, 0);
        }
    }, [form.content, restoreSelection]);

    const insertAtCursor = useCallback((text: string, offsetCursor: number = 0) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selection = restoreSelection();
        if (!selection) return;
        const { start } = selection;
        const beforeText = form.content.substring(0, start);
        const afterText = form.content.substring(start);
        const newContent = beforeText + text + afterText;
        setForm((f) => ({ ...f, content: newContent }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length + offsetCursor, start + text.length + offsetCursor);
        }, 0);
    }, [form.content, restoreSelection]);

    const insertHeading = useCallback((level: number) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selection = restoreSelection();
        if (!selection) return;
        const { start } = selection;
        const lines = form.content.split("\n");
        let currentLine = 0;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
            if (charCount + lines[i].length >= start) { currentLine = i; break; }
            charCount += lines[i].length + 1;
        }
        const prefix = "#".repeat(level) + " ";
        const cleanLine = lines[currentLine].replace(/^#{1,6}\s+/, "");
        lines[currentLine] = prefix + cleanLine;
        setForm((f) => ({ ...f, content: lines.join("\n") }));
        setTimeout(() => textarea.focus(), 0);
    }, [form.content, restoreSelection]);

    const insertList = useCallback((ordered: boolean) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selection = restoreSelection();
        if (!selection) return;
        const { start, end } = selection;
        const selectedText = form.content.substring(start, end);
        if (selectedText && selectedText.includes("\n")) {
            const lines = selectedText.split("\n");
            const listItems = lines.map((line, i) => ordered ? `${i + 1}. ${line}` : `- ${line}`).join("\n");
            const beforeText = form.content.substring(0, start);
            const afterText = form.content.substring(end);
            setForm((f) => ({ ...f, content: beforeText + listItems + afterText }));
            setTimeout(() => textarea.focus(), 0);
        } else {
            insertAtCursor(ordered ? "1. " : "- ", 0);
        }
    }, [form.content, insertAtCursor, restoreSelection]);

    const insertCodeBlock = useCallback((language: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selection = restoreSelection();
        if (!selection) return;
        const { start, end } = selection;
        const selectedText = form.content.substring(start, end);
        const beforeText = form.content.substring(0, start);
        const afterText = form.content.substring(end);
        if (selectedText) {
            const codeBlock = `\`\`\`${language}\n${selectedText}\n\`\`\`\n`;
            setForm((f) => ({ ...f, content: beforeText + codeBlock + afterText }));
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 3 + language.length + 1, start + 3 + language.length + 1 + selectedText.length);
            }, 0);
        } else {
            const codeBlock = `\`\`\`${language}\n\n\`\`\`\n`;
            setForm((f) => ({ ...f, content: beforeText + codeBlock + afterText }));
            setTimeout(() => {
                textarea.focus();
                const newPos = start + 3 + language.length + 1;
                textarea.setSelectionRange(newPos, newPos);
            }, 0);
        }
    }, [form.content, restoreSelection]);

    const handleImagePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                e.preventDefault();
                insertAtCursor(
                    "\n<!-- Add image to krishblog-images repo, then use: -->\n" + imagesRepoMarkdown("path/to/image.png", "description") + "\n",
                    0
                );
                break;
            }
        }
    }, [insertAtCursor]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.addEventListener("paste", handleImagePaste);
        return () => textarea.removeEventListener("paste", handleImagePaste);
    }, [handleImagePaste]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (document.activeElement !== textareaRef.current) {
                if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
                return;
            }
            const isMod = e.metaKey || e.ctrlKey;
            if (isMod && e.key === "s") { e.preventDefault(); save(); }
            else if (isMod && e.key === "b") { e.preventDefault(); wrapSelection("**"); }
            else if (isMod && e.key === "i") { e.preventDefault(); wrapSelection("*"); }
            else if (isMod && e.key === "u") { e.preventDefault(); wrapSelection("__"); }
            else if (isMod && e.key === "k") { e.preventDefault(); wrapSelection("[", "](url)"); }
            else if (isMod && e.key === "`") { e.preventDefault(); wrapSelection("`"); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [save, wrapSelection]);

    const notifySubscribers = useCallback(async () => {
        if (!token || !form.title || !form.slug) return;
        setNotifying(true);
        setNotifyState("idle");
        try {
            await adminNotifySubscribers(token, {
                post_title: form.title,
                post_slug: form.slug,
                post_summary: form.excerpt,
            });
            setNotifyState("sent");
            setTimeout(() => setNotifyState("idle"), 5000);
        } catch {
            setNotifyState("error");
            setTimeout(() => setNotifyState("idle"), 4000);
        } finally {
            setNotifying(false);
        }
    }, [token, form.title, form.slug, form.excerpt]);

    return (
        <div className="flex flex-col h-full">
            {/* Draft recovery banner */}
            <AnimatePresence>
                {hasDraftRecovery && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-sm font-sans">
                            <span className="text-amber-700 dark:text-amber-400">
                                You have unsaved changes from a previous session.
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={restoreDraft}
                                    className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Restore draft
                                </button>
                                <button
                                    onClick={discardDraft}
                                    className="text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:underline"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <h1 className="text-sm font-sans font-semibold flex-1 truncate flex items-center gap-2 min-w-0">
                    <span className="truncate">{form.title || "Untitled post"}</span>
                    <span className={cn(
                        "flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                        form.status === "published" ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : form.status === "archived" ? "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    )}>
                        {form.status}
                    </span>
                </h1>

                <AnimatePresence>
                    {saveState === "saved" && (
                        <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-sans text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                            </span>
                            {publishedSlug && (
                                <a href={`/post/${publishedSlug}`} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-1 text-xs font-sans text-blue-600 dark:text-blue-400 hover:underline">
                                    <ExternalLink className="h-3.5 w-3.5" /> View post
                                </a>
                            )}
                        </motion.div>
                    )}
                    {saveState === "error" && (
                        <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                     className="flex items-center gap-1 text-xs font-sans text-[hsl(var(--destructive))]">
                            <AlertCircle className="h-3.5 w-3.5" /> Save failed
                        </motion.span>
                    )}
                </AnimatePresence>

                <button onClick={() => setPreview(!preview)}
                        className={cn(
                            "flex items-center gap-1.5 h-8 px-3 text-xs font-sans rounded border transition-colors",
                            preview
                                ? "border-[hsl(var(--accent))] text-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.08)]"
                                : "border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]"
                        )}>
                    {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {preview ? "Edit" : "Preview"}
                </button>

                <div className="flex items-stretch">
                    {form.status !== "published" ? (
                        <button onClick={() => save("published")} disabled={saving}
                                className="flex items-center gap-1.5 h-8 px-3 text-xs font-sans bg-[hsl(var(--accent))] text-white rounded-l hover:opacity-90 transition-opacity disabled:opacity-50">
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                            Publish
                        </button>
                    ) : (
                        <button onClick={() => save()} disabled={saving}
                                className="flex items-center gap-1.5 h-8 px-3 text-xs font-sans bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-l hover:opacity-90 transition-opacity disabled:opacity-50">
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            Save
                        </button>
                    )}
                    <div className="relative group">
                        <button className="h-8 px-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-r border-l border-[hsl(var(--primary-foreground)/0.2)] hover:opacity-90 transition-opacity"
                                aria-label="More publishing options">
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-44 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded shadow-lg z-50 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                            <button onClick={() => save("draft")}
                                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                <FileText className="h-3.5 w-3.5" /> Save as draft
                            </button>
                            {form.status !== "published" && (
                                <button onClick={() => save("published")}
                                        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                    <Globe className="h-3.5 w-3.5 text-green-500" /> Publish now
                                </button>
                            )}
                            <button onClick={() => save("archived")}
                                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                <Archive className="h-3.5 w-3.5" /> Archive
                            </button>
                        </div>
                    </div>
                </div>

                {(currentPost?.status === "published" || form.status === "published") && (
                    <button onClick={notifySubscribers} disabled={notifying}
                            title="Send email notification to all subscribers"
                            className={cn(
                                "flex items-center gap-1.5 h-8 px-3 text-xs font-sans rounded border transition-colors disabled:opacity-50",
                                notifyState === "sent" ? "border-green-500/40 bg-green-500/10 text-green-600"
                                    : notifyState === "error" ? "border-red-500/40 bg-red-500/10 text-red-600"
                                        : "border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]"
                            )}>
                        {notifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : notifyState === "sent" ? <CheckCircle2 className="h-3.5 w-3.5" />
                                : <Bell className="h-3.5 w-3.5" />}
                        {notifyState === "sent" ? "Sent!" : notifyState === "error" ? "Failed" : "Notify subscribers"}
                    </button>
                )}
            </div>

            {/* Main */}
            <div className="flex-1 overflow-hidden flex">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-8 py-8">
                        <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                               placeholder="Post title"
                               className="w-full text-3xl font-bold bg-transparent outline-none mb-2 placeholder:text-[hsl(var(--muted-foreground)/0.4)]"
                               style={{ fontFamily: '"Playfair Display", serif' }} />

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-sans text-[hsl(var(--muted-foreground))]">slug:</span>
                            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                   placeholder="post-slug"
                                   className="text-xs font-mono bg-transparent outline-none text-[hsl(var(--muted-foreground))] border-b border-transparent hover:border-[hsl(var(--border))] focus:border-[hsl(var(--accent))] transition-colors" />
                        </div>

                        <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                                  placeholder="Brief excerpt (shown in cards and meta description)…"
                                  rows={2}
                                  className="editor-textarea text-[hsl(var(--muted-foreground))] text-base mb-6 border-b border-[hsl(var(--border))] pb-4 resize-none" />

                        <AnimatePresence mode="wait">
                            {preview ? (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <MarkdownPreview content={form.content} />
                                </motion.div>
                            ) : (
                                <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="flex flex-wrap items-center gap-1 mb-3 pb-3 border-b border-[hsl(var(--border))]"
                                         onMouseDown={(e) => {
                                             if ((e.target as HTMLElement).closest("button")) e.preventDefault();
                                         }}>
                                        <button type="button" onClick={() => wrapSelection("**")} title="Bold (⌘B)"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Bold className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => wrapSelection("*")} title="Italic (⌘I)"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Italic className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => wrapSelection("__")} title="Underline (⌘U)"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <UnderlineIcon className="h-4 w-4" />
                                        </button>

                                        <div className="w-px h-5 bg-[hsl(var(--border))] mx-1" />

                                        <button type="button" onClick={() => insertHeading(1)} title="Heading 1"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Heading1 className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertHeading(2)} title="Heading 2"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Heading2 className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertHeading(3)} title="Heading 3"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Heading3 className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertHeading(4)} title="Heading 4"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Heading4 className="h-4 w-4" />
                                        </button>

                                        <div className="w-px h-5 bg-[hsl(var(--border))] mx-1" />

                                        <button type="button" onClick={() => insertList(false)} title="Bullet List"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <List className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertList(true)} title="Numbered List"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <ListOrdered className="h-4 w-4" />
                                        </button>

                                        <div className="w-px h-5 bg-[hsl(var(--border))] mx-1" />

                                        <button type="button" onClick={() => insertAtCursor("> ", 0)} title="Quote"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Quote className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => wrapSelection("`")} title="Inline Code (⌘`)"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Code className="h-4 w-4" />
                                        </button>
                                        <div className="relative group">
                                            <button type="button" title="Code Block (```)"
                                                    className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                                <Code2 className="h-4 w-4" />
                                            </button>
                                            <div className="absolute left-0 top-full mt-1 w-32 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded shadow-lg z-50 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity"
                                                 onMouseDown={(e) => {
                                                     if ((e.target as HTMLElement).closest("button")) e.preventDefault();
                                                 }}>
                                                {["", "javascript", "typescript", "python", "go", "rust", "bash", "sql", "json", "html", "css"].map((lang) => (
                                                    <button key={lang} type="button" onClick={() => insertCodeBlock(lang)}
                                                            className="flex items-center w-full px-3 py-1.5 text-xs font-mono hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                                        {lang || "Plain"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => wrapSelection("[", "](url)")} title="Link (⌘K)"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <LinkIcon className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertAtCursor(imagesRepoMarkdown("path/to/image.png", "alt text"), 0)} title="Image from krishblog-images repo"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <ImageIcon className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => insertAtCursor("\n---\n", 0)} title="Horizontal Rule"
                                                className="h-8 w-8 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Minus className="h-4 w-4" />
                                        </button>

                                    </div>

                                    <div className="relative">
                                        <div className="absolute top-0 right-0 text-[10px] font-sans text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded-bl z-10">
                                            Markdown
                                        </div>
                                        <textarea ref={textareaRef}
                                                  value={form.content}
                                                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                                  onSelect={updateSelectionFromTextarea}
                                                  onKeyUp={updateSelectionFromTextarea}
                                                  onMouseUp={updateSelectionFromTextarea}
                                                  onFocus={updateSelectionFromTextarea}
                                                  placeholder={"# Start writing...\n\nUse markdown:\n**bold** (⌘B), *italic* (⌘I), __underline__ (⌘U)\n`code` (⌘`), [link](url) (⌘K)\n\n```language\ncode blocks\n```\n\n- Bullet lists with - or *\n1. Numbered lists with 1.\n\n> Quotes with >\n\n---\n\nImages: add to krishblog-images repo, then ![alt](path/to/image.png)"}
                                                  rows={28} className="editor-textarea" spellCheck />
                                    </div>
                                    <p className="text-[10px] font-sans text-[hsl(var(--muted-foreground))] mt-2">
                                        {form.content.split(/\s+/).filter(Boolean).length} words · ⌘S to save · Images from krishblog-images repo
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 border-l border-[hsl(var(--border))] overflow-y-auto bg-[hsl(var(--card))]">
                    <div className="p-4 space-y-5">
                        <SidebarSection label="Status">
                            <div className="grid grid-cols-3 gap-1">
                                {(["draft", "published", "archived"] as const).map((s) => (
                                    <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))}
                                            className={cn(
                                                "py-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider rounded transition-colors capitalize",
                                                form.status === s ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]"
                                            )}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>

                        <SidebarSection label="Section">
                            <select value={form.section_id} onChange={(e) => setForm((f) => ({ ...f, section_id: e.target.value }))}
                                    className="w-full h-8 px-2 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors">
                                <option value="">— No section —</option>
                                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </SidebarSection>

                        <SidebarSection label="Featured">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_featured}
                                       onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                                       className="accent-[hsl(var(--accent))] h-4 w-4" />
                                <span className="text-xs font-sans">Feature this post</span>
                            </label>
                        </SidebarSection>

                        <SidebarSection label="Cover image">
                            <CoverImageField
                                value={form.cover_image}
                                alt={form.cover_image_alt}
                                onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))}
                                onAltChange={(alt) => setForm((f) => ({ ...f, cover_image_alt: alt }))}
                            />
                        </SidebarSection>

                        <div>
                            <button onClick={() => setSeoOpen(!seoOpen)}
                                    className="flex items-center justify-between w-full text-xs font-sans font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                SEO & Meta
                                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", seoOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {seoOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pt-3 space-y-2">
                                            <input value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                                                   placeholder="Meta title"
                                                   className="w-full h-8 px-2 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors" />
                                            <textarea value={form.meta_desc} onChange={(e) => setForm((f) => ({ ...f, meta_desc: e.target.value }))}
                                                      placeholder="Meta description" rows={3}
                                                      className="w-full px-2 py-1.5 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] resize-none transition-colors" />
                                            <p className="text-[10px] font-sans text-[hsl(var(--muted-foreground))]">
                                                {form.meta_desc.length}/160 chars
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">{label}</p>
            {children}
        </div>
    );
}
