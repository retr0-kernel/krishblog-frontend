"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminGetSections, adminCreateSection, adminUpdateSection, adminDeleteSection } from "@/lib/api";
import type { Section } from "@/types";

const LAYOUTS = ["feed", "grid", "featured", "minimal", "magazine"] as const;
const blank = (): Partial<Section> => ({ name: "", slug: "", description: "", layout: "feed", is_active: true, sort_order: 0 });

export default function AdminSectionsPage() {
    const { token } = useAuth();
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Section | null>(null);
    const [form, setForm] = useState<Partial<Section>>(blank());
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const load = () => {
        if (!token) return;
        adminGetSections(token).then(setSections).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [token]);

    const openNew = () => { setEditing(null); setForm(blank()); setShowForm(true); setError(""); };
    const openEdit = (s: Section) => { setEditing(s); setForm({ ...s }); setShowForm(true); setError(""); };

    const handleSave = async () => {
        if (!token || !form.name) { setError("Name is required"); return; }
        setSaving(true); setError("");
        try {
            if (editing) { await adminUpdateSection(token, editing.id, form); }
            else { await adminCreateSection(token, form); }
            setShowForm(false); load();
        } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!token || !confirm(`Delete section "${name}"?`)) return;
        setDeletingId(id);
        try { await adminDeleteSection(token, id); load(); }
        catch { alert("Delete failed"); }
        finally { setDeletingId(null); }
    };

    const handleNameChange = (name: string) => {
        setForm((f) => ({
            ...f, name,
            slug: editing ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        }));
    };

    const inputCls = "w-full h-9 px-3 text-sm font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors";
    const labelCls = "block text-[10px] font-sans font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1";

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Sections</h1>
                    <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">{sections.length} sections</p>
                </div>
                <button onClick={openNew}
                        className="flex items-center gap-2 h-9 px-4 bg-[hsl(var(--accent))] text-white text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" /> New section
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-5 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-sans font-semibold">{editing ? "Edit section" : "New section"}</h2>
                            <button onClick={() => setShowForm(false)} className="h-7 w-7 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className={labelCls}>Name *</label>
                                <input value={form.name ?? ""} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Slug</label>
                                <input value={form.slug ?? ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                       className={inputCls.replace("font-sans", "font-mono")} />
                            </div>
                            <div>
                                <label className={labelCls}>Layout</label>
                                <select value={form.layout ?? "feed"} onChange={(e) => setForm((f) => ({ ...f, layout: e.target.value as Section["layout"] }))}
                                        className={inputCls}>
                                    {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Sort order</label>
                                <input type="number" value={form.sort_order ?? 0}
                                       onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className={inputCls} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className={labelCls}>Description</label>
                            <textarea value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                      rows={2} className="w-full px-3 py-2 text-sm font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] resize-none transition-colors" />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm font-sans cursor-pointer">
                                <input type="checkbox" checked={form.is_active ?? true}
                                       onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                                       className="accent-[hsl(var(--accent))] h-4 w-4" />
                                Active
                            </label>
                            {error && <p className="text-xs font-sans text-[hsl(var(--destructive))]">{error}</p>}
                            <div className="ml-auto flex gap-2">
                                <button onClick={() => setShowForm(false)}
                                        className="h-8 px-3 text-xs font-sans border border-[hsl(var(--border))] rounded hover:bg-[hsl(var(--secondary))] transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                        className="flex items-center gap-1.5 h-8 px-3 text-xs font-sans bg-[hsl(var(--accent))] text-white rounded hover:opacity-90 disabled:opacity-50 transition-opacity">
                                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                    {editing ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg overflow-hidden">
                {loading && <div className="px-5 py-10 text-center text-sm font-sans text-[hsl(var(--muted-foreground))]">Loading…</div>}
                {!loading && sections.length === 0 && (
                    <div className="px-5 py-10 text-center text-sm font-sans text-[hsl(var(--muted-foreground))]">No sections yet</div>
                )}
                <div className="divide-y divide-[hsl(var(--border))]">
                    {sections.map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 px-5 py-3.5">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-sans font-medium">{s.name}</span>
                                    {!s.is_active && <span className="text-[10px] font-sans bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-1.5 py-0.5 rounded">inactive</span>}
                                </div>
                                <div className="text-xs font-mono text-[hsl(var(--muted-foreground))] mt-0.5">/{s.slug} · {s.layout}</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(s)}
                                        className="h-7 w-7 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(s.id, s.name)} disabled={deletingId === s.id}
                                        className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-500/10 text-[hsl(var(--muted-foreground))] hover:text-red-500 disabled:opacity-40 transition-colors">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
