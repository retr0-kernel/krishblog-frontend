"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/admin/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-[hsl(var(--background))]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-sans text-[hsl(var(--muted-foreground))]">Loading…</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
