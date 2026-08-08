"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

interface SubscribeFormProps {
    compact?: boolean;
    className?: string;
}

export function SubscribeForm({ compact = false, className = "" }: SubscribeFormProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const inputClass =
        "w-full font-sans bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent)/0.35)] focus:border-[hsl(var(--accent))] transition-colors";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;

        if (!isValidEmail(trimmedEmail)) {
            setState("error");
            setMessage("Please enter a valid email address (e.g. you@gmail.com).");
            return;
        }

        setState("loading");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/v1/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail, name: name.trim() }),
            });
            const data = await res.json();

            if (!res.ok) {
                setState("error");
                setMessage(data.error?.message ?? "Something went wrong. Try again.");
            } else {
                setState("success");
                setMessage(data.data?.message ?? "Check your inbox to confirm your subscription.");
                setEmail("");
                setName("");
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
                    className={`flex items-start gap-3 ${compact ? "text-sm" : ""} ${className}`}
                >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-[hsl(var(--foreground))] leading-relaxed">{message}</p>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`w-full space-y-3 ${className}`} noValidate>
            {!compact && (
                <div className="space-y-1.5">
                    <label htmlFor="subscribe-name" className="text-sm font-sans font-medium text-[hsl(var(--foreground))]">
                        Name <span className="text-[hsl(var(--muted-foreground))] font-normal">(optional)</span>
                    </label>
                    <input
                        id="subscribe-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={`${inputClass} h-11 px-3 text-sm`}
                    />
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="subscribe-email" className="text-sm font-sans font-medium text-[hsl(var(--foreground))]">
                    Email
                </label>
                <div className={compact ? "space-y-2" : "flex flex-col sm:flex-row gap-2"}>
                    <div className="relative min-w-0 flex-1">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                        <input
                            id="subscribe-email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (state === "error") setState("idle");
                            }}
                            placeholder="you@example.com"
                            required
                            className={`${inputClass} ${compact ? "h-10 pl-9 pr-3 text-sm" : "h-11 pl-9 pr-3 text-sm"}`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={state === "loading" || !email.trim()}
                        className={`inline-flex items-center justify-center gap-2 font-sans font-medium bg-[hsl(var(--accent))] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 ${
                            compact ? "h-10 w-full px-4 text-sm" : "h-11 px-6 text-sm sm:flex-shrink-0"
                        }`}
                    >
                        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                    </button>
                </div>
                <p className="text-xs font-sans text-[hsl(var(--muted-foreground))]">
                    We&apos;ll send a confirmation link. Unsubscribe anytime.
                </p>
            </div>

            {state === "error" && (
                <p className="text-sm font-sans text-[hsl(var(--destructive))]" role="alert">
                    {message}
                </p>
            )}
        </form>
    );
}
