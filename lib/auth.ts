"use client";

export interface AuthState {
    token: string | null;
    user: import("@/types").User | null;
}

const KEY = "kb_auth";

export function getAuth(): AuthState {
    if (typeof window === "undefined") return { token: null, user: null };
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { token: null, user: null };
        return JSON.parse(raw) as AuthState;
    } catch {
        return { token: null, user: null };
    }
}

export function setAuth(state: AuthState): void {
    localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearAuth(): void {
    localStorage.removeItem(KEY);
}

export function getToken(): string | null {
    return getAuth().token;
}
