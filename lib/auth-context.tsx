"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { login as apiLogin, logout as apiLogout, getMe } from "@/lib/api";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth() {
    if (typeof window === "undefined") {
        return { token: null as string | null, user: null as User | null };
    }
    const { token, user } = getAuth();
    return { token, user };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(() => readStoredAuth().user);
    const [token, setToken] = useState<string | null>(() => readStoredAuth().token);
    const [loading, setLoading] = useState(() => {
        if (typeof window === "undefined") return false;
        return !!readStoredAuth().token;
    });

    useEffect(() => {
        const { token: t } = readStoredAuth();
        if (!t) return;

        let cancelled = false;
        getMe(t)
            .then((freshUser) => {
                if (cancelled) return;
                setUser(freshUser);
                setAuth({ token: t, user: freshUser });
            })
            .catch(() => {
                if (cancelled) return;
                clearAuth();
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await apiLogin({ email, password });
        setToken(res.access_token);
        setUser(res.user);
        setAuth({ token: res.access_token, user: res.user });
    }, []);

    const logout = useCallback(async () => {
        if (token) {
            try { await apiLogout(token); } catch { /* ignore */ }
        }
        clearAuth();
        setToken(null);
        setUser(null);
        router.push("/admin/login");
    }, [token, router]);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
