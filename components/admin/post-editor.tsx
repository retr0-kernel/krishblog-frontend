"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Eye, EyeOff, Globe, FileText, Archive, ChevronDown, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminCreatePost, adminUpdatePost, adminGetSections } from "@/lib/api";
import type { Post, Section } from "@/types";
import { cn } from "@/lib/utils";

function MarkdownPreview({ content }: { content: string }) {
    const lines = content.split("\n");
    return (
        <div className="prose-editorial max-w-none">
            {lines.map((line, i) => {
                if (line.startsWith("# ")) return <h2 key={i}>{line.slice(2)}</h2>;
                if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
                if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
                if (line.startsWith("> ")) return <blockquote key={i}>{line.slice(2)}</blockquote>;
                if (line.startsWith("---")) return <hr key={i} className="my-6 border-[hsl(var(--border))]" />;
                if (line === "") return <br key={i} />;
                const html = line
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.+?)\*/g, "<em>$1</em>")
                    .replace(/`(.+?)`/g, "<code>$1</code>");
                return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
            })}
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

export function PostEditor({ post }: { post?: Post }) {
    const router = useRouter();
    const { token } = useAuth();
    const [sections, setSections] = useState<Section[]>([]);
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
    const [seoOpen, setSeoOpen] = useState(false);

    const [form, setForm] = useState({
        title: post?.title ?? "",
        slug: post?.slug ?? "",
        summary: post?.summary ?? "",
        content: post?.blocks?.map((b) => {
            if (b.type === "heading") return `${"#".repeat((b.attrs?.level as number) ?? 2)} ${b.content}`;
            if (b.type === "quote") return `> ${b.content}`;
            if (b.type === "code") return `\`\`\`\n${b.content}\n\`\`\``;
            return b.content;
        }).join("\n\n") ?? "",
        section_id: post?.section_id ?? "",
        status: (post?.status ?? "draft") as "draft" | "published" | "archived",
        is_featured: post?.is_featured ?? false,
        cover_image: post?.cover_image ?? "",
        cover_image_alt: post?.cover_image_alt ?? "",
        meta_title: post?.meta_title ?? "",
        meta_desc: post?.meta_desc ?? "",
    });

    useEffect(() => {
        if (token) adminGetSections(token).then(setSections).catch(() => {});
    }, [token]);

    const handleTitleChange = (title: string) => {
        setForm((f) => ({
            ...f, title,
            slug: post ? f.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        }));
    };

    const save = useCallback(async (statusOverride?: string) => {
        if (!token || !form.title) return;
        setSaving(true); setSaveState("idle");
        const payload = { ...form, status: (statusOverride as "draft" | "published" | "archived") ?? form.status };
        try {
            if (post) {
                await adminUpdatePost(token, post.id, payload);
            } else {
                const created = await adminCreatePost(token, payload);
                router.replace(`/admin/posts/${created.id}`);
                return;
            }
            setSaveState("saved");
            if (statusOverride) setForm((f) => ({ ...f, status: statusOverride as "draft" | "published" | "archived" }));
            setTimeout(() => setSaveState("idle"), 3000);
        } catch (err) { setSaveState("error"); console.error(err); }
        finally { setSaving(false); }
    }, [token, form, post, router]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [save]);

    const inputCls = "w-full h-8 px-2 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors";

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <h1 className="text-sm font-sans font-semibold flex-1 truncate">{form.title || "Untitled post"}</h1>
                <AnimatePresence>
                    {saveState === "saved" && (
                        <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                     className="flex items-center gap-1 text-xs font-sans text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                        </motion.span>
                    )}
                    {saveState === "error" && (
                        <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                     className="flex items-center gap-1 text-xs font-sans text-[hsl(var(--destructive))]">
                            <AlertCircle className="h-3.5 w-3.5" /> Save failed
                        </motion.span>
                    )}
                </AnimatePresence>
                <button onClick={() => setPreview(!preview)}
                        className={cn("flex items-center gap-1.5 h-8 px-3 text-xs font-sans rounded border transition-colors",
                            preview ? "border-[hsl(var(--accent))] text-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.08)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]")}>
                    {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {preview ? "Edit" : "Preview"}
                </button>
                <div className="flex items-stretch">
                    <button onClick={() => save()} disabled={saving}
                            className="flex items-center gap-1.5 h-8 px-3 text-xs font-sans bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-l hover:opacity-90 transition-opacity disabled:opacity-50">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save draft
                    </button>
                    <div className="relative group">
                        <button className="h-8 px-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-r border-l border-[hsl(var(--primary-foreground)/0.2)] hover:opacity-90 transition-opacity">
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded shadow-lg z-50 overflow-hidden opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                            <button onClick={() => save("published")} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                <Globe className="h-3.5 w-3.5 text-green-500" /> Publish now
                            </button>
                            <button onClick={() => save("draft")} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                <FileText className="h-3.5 w-3.5" /> Save as draft
                            </button>
                            <button onClick={() => save("archived")} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-sans hover:bg-[hsl(var(--secondary))] text-left transition-colors">
                                <Archive className="h-3.5 w-3.5" /> Archive
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-8 py-8">
                        <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title"
                               className="w-full text-3xl font-bold bg-transparent outline-none mb-2 placeholder:text-[hsl(var(--muted-foreground)/0.4)]"
                               style={{ fontFamily: '"Playfair Display", serif' }} />
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-sans text-[hsl(var(--muted-foreground))]">slug:</span>
                            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="post-slug"
                                   className="text-xs font-mono bg-transparent outline-none text-[hsl(var(--muted-foreground))] border-b border-transparent hover:border-[hsl(var(--border))] focus:border-[hsl(var(--accent))] transition-colors" />
                        </div>
                        <textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                                  placeholder="Brief summary…" rows={2}
                                  className="editor-textarea text-[hsl(var(--muted-foreground))] text-base mb-6 border-b border-[hsl(var(--border))] pb-4 resize-none" />
                        <AnimatePresence mode="wait">
                            {preview ? (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <MarkdownPreview content={form.content} />
                                </motion.div>
                            ) : (
                                <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="relative">
                                        <div className="absolute top-0 right-0 text-[10px] font-sans text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded-bl">Markdown</div>
                                        <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                                  placeholder={"# Start writing...\n\n**bold**, *italic*, `code`, > quotes"}
                                                  rows={28} className="editor-textarea" spellCheck />
                                    </div>
                                    <p className="text-[10px] font-sans text-[hsl(var(--muted-foreground))] mt-2">
                                        {form.content.split(/\s+/).filter(Boolean).length} words · ⌘S to save
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right sidebar */}
                <aside className="w-64 flex-shrink-0 border-l border-[hsl(var(--border))] overflow-y-auto bg-[hsl(var(--card))]">
                    <div className="p-4 space-y-5">
                        <SidebarSection label="Status">
                            <div className="grid grid-cols-3 gap-1">
                                {(["draft", "published", "archived"] as const).map((s) => (
                                    <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))}
                                            className={cn("py-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider rounded transition-colors capitalize",
                                                form.status === s ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]")}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>
                        <SidebarSection label="Section">
                            <select value={form.section_id} onChange={(e) => setForm((f) => ({ ...f, section_id: e.target.value }))} className={inputCls}>
                                <option value="">— No section —</option>
                                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </SidebarSection>
                        <SidebarSection label="Featured">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                                       className="accent-[hsl(var(--accent))] h-4 w-4" />
                                <span className="text-xs font-sans">Feature this post</span>
                            </label>
                        </SidebarSection>
                        <SidebarSection label="Cover image">
                            <input value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
                                   placeholder="https://…" className={`${inputCls} mb-1.5`} />
                            <input value={form.cover_image_alt} onChange={(e) => setForm((f) => ({ ...f, cover_image_alt: e.target.value }))}
                                   placeholder="Alt text" className={inputCls} />
                        </SidebarSection>
                        <div>
                            <button onClick={() => setSeoOpen(!seoOpen)}
                                    className="flex items-center justify-between w-full text-xs font-sans font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                SEO & Meta <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", seoOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {seoOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pt-3 space-y-2">
                                            <input value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                                                   placeholder="Meta title" className={inputCls} />
                                            <textarea value={form.meta_desc} onChange={(e) => setForm((f) => ({ ...f, meta_desc: e.target.value }))}
                                                      placeholder="Meta description" rows={3}
                                                      className="w-full px-2 py-1.5 text-xs font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] resize-none transition-colors" />
                                            <p className="text-[10px] font-sans text-[hsl(var(--muted-foreground))]">{form.meta_desc.length}/160 chars</p>
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
