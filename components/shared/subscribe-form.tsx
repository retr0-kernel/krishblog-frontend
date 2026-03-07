"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

interface SubscribeFormProps {
    compact?: boolean;
    className?: string;
}

export function SubscribeForm({ compact = false, className = "" }: SubscribeFormProps) {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setState("loading");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) {
                setState("error");
                setMessage(data.error ?? "Something went wrong. Try again.");
            } else {
                setState("success");
                setMessage(data.message ?? "Check your inbox to confirm.");
                setEmail("");
            }
        } catch {
            setState("error");
            setMessage("Network error. Please try again.");
        }
    };

    if (state === "success") {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 ${compact ? "text-sm" : ""} ${className}`}
                >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="font-sans text-[hsl(var(--foreground))]">{message}</p>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`w-full ${className}`}>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    {!compact && (
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className={`w-full ${compact ? "h-9 px-3 text-sm" : "h-11 text-sm"} ${!compact ? "pl-9 pr-3" : "px-3"} font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:outline-none focus:border-[hsl(var(--accent))] transition-colors`}
                    />
                </div>
                <button
                    type="submit"
                    disabled={state === "loading" || !email.trim()}
                    className={`flex items-center justify-center gap-2 ${compact ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm"} font-sans font-medium bg-[hsl(var(--accent))] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0`}
                >
                    {state === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </div>
            {state === "error" && (
                <p className="text-xs font-sans text-[hsl(var(--destructive))] mt-2">{message}</p>
            )}
        </form>
    );
}
