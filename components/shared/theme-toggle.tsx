"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function useIsMounted() {
    return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const mounted = useIsMounted();

    if (!mounted) return <div className={cn("h-9 w-9", className)} />;

    const options = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ] as const;

    const current = options.find((o) => o.value === theme) ?? options[2];
    const Icon = current.icon;

    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => {
                    const idx = options.findIndex((o) => o.value === theme);
                    setTheme(options[(idx + 1) % options.length].value);
                }}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[hsl(var(--secondary))] transition-colors relative overflow-hidden"
                aria-label={`Theme: ${current.label}`}
                title={`Switch theme (current: ${current.label})`}
            >
                <AnimatePresence mode="wait">
                    <motion.div key={theme}
                                initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}>
                        <Icon className="h-4 w-4" />
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
}

export function ThemePicker() {
    const { theme, setTheme } = useTheme();
    const mounted = useIsMounted();
    if (!mounted) return null;

    const options = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ] as const;

    return (
        <div className="flex gap-2">
            {options.map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => setTheme(value)}
                        className={cn(
                            "flex flex-col items-center gap-2 px-4 py-3 rounded-lg border text-xs font-sans font-medium transition-all",
                            theme === value
                                ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.08)] text-[hsl(var(--accent))]"
                                : "border-[hsl(var(--border))] hover:border-[hsl(var(--foreground)/0.3)]"
                        )}>
                    <Icon className="h-4 w-4" />
                    {label}
                </button>
            ))}
        </div>
    );
}
