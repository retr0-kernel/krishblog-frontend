"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/admin");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-[hsl(var(--background))] flex items-center justify-center px-4">
            <div className="absolute top-4 right-4"><ThemeToggle /></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Krish<span className="text-[hsl(var(--accent))]">.</span>
                    </h1>
                    <p className="text-sm font-sans text-[hsl(var(--muted-foreground))]">Admin dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
                               className="w-full h-10 px-3 text-sm font-sans bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
                               placeholder="admin@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                               className="w-full h-10 px-3 text-sm font-sans bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
                               placeholder="••••••••" />
                    </div>
                    {error && (
                        <p className="text-xs font-sans text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.08)] px-3 py-2 rounded">{error}</p>
                    )}
                    <button type="submit" disabled={loading}
                            className="w-full h-10 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50">
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
