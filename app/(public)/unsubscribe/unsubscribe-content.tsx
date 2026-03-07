"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(token ? "loading" : "idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) return;
        fetch(`${API_URL}/v1/subscribe/unsubscribe?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setStatus("success");
                    setMessage(data.message ?? "You've been unsubscribed.");
                } else {
                    setStatus("error");
                    setMessage(data.error?.message ?? "This unsubscribe link is invalid or has already been used.");
                }
            })
            .catch(() => { setStatus("error"); setMessage("Network error. Please try again."); });
    }, [token]);

    return (
        <div className="pt-24 min-h-dvh flex items-start justify-center">
            <div className="max-w-md mx-auto px-6 py-20 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    {status === "loading" && (
                        <div className="space-y-4">
                            <div className="h-16 w-16 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center mx-auto">
                                <Loader2 className="h-7 w-7 text-[hsl(var(--muted-foreground))] animate-spin" />
                            </div>
                            <p className="font-sans text-[hsl(var(--muted-foreground))]">Processing…</p>
                        </div>
                    )}
                    {status === "success" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Unsubscribed</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
                                    {message} You won&apos;t receive any more emails from this blog.
                                </p>
                            </div>
                            <p className="text-xs font-sans text-[hsl(var(--muted-foreground))]">
                                Changed your mind?{" "}
                                <Link href="/about" className="text-[hsl(var(--accent))] hover:underline underline-offset-4">Subscribe again</Link>
                            </p>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Link not found</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">{message}</p>
                            </div>
                        </div>
                    )}
                    {status === "idle" && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Unsubscribe</h1>
                            <p className="font-sans text-[hsl(var(--muted-foreground))]">
                                Use the unsubscribe link from any email to remove yourself from the list.
                            </p>
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:underline underline-offset-4">
                                Back to blog →
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
