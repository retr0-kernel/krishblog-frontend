"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function ConfirmContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "already" | "expired" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                setStatus("error");
                setMessage("No confirmation token found in the URL.");
            }, 0);
            return;
        }
        fetch(`${API_URL}/v1/subscribe/confirm?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    const msg = data.data?.message ?? "";
                    if (msg.toLowerCase().includes("already")) {
                        setStatus("already");
                        setMessage("You're already subscribed — no action needed.");
                    } else {
                        setStatus("success");
                        setMessage("Your subscription is confirmed. You'll hear from me when something new is published.");
                    }
                } else if (data.error?.code === "TOKEN_EXPIRED") {
                    setStatus("expired");
                    setMessage("This confirmation link has expired. Please subscribe again to get a fresh link.");
                } else {
                    setStatus("error");
                    setMessage(data.error?.message ?? "This confirmation link is invalid or has already been used.");
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
                            <p className="font-sans text-[hsl(var(--muted-foreground))]">Confirming…</p>
                        </div>
                    )}
                    {status === "success" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>You&apos;re subscribed</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">{message}</p>
                            </div>
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:underline underline-offset-4">
                                Back to the blog →
                            </Link>
                        </div>
                    )}
                    {status === "already" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Already subscribed</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">{message}</p>
                            </div>
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:underline underline-offset-4">
                                Back to the blog →
                            </Link>
                        </div>
                    )}
                    {status === "expired" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                                <XCircle className="h-8 w-8 text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Link expired</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">{message}</p>
                            </div>
                            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:underline underline-offset-4">
                                Subscribe again →
                            </Link>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="space-y-6">
                            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>Something went wrong</h1>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">{message}</p>
                            </div>
                            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:underline underline-offset-4">
                                Try subscribing again →
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default ConfirmContent;

