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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { token: t, user: u } = getAuth();
        if (t && u) {
            setToken(t);
            setUser(u);
            getMe(t)
                .then((freshUser) => { setUser(freshUser); setAuth({ token: t, user: freshUser }); })
                .catch(() => { clearAuth(); setToken(null); setUser(null); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
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
