"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Layers, BarChart2, LogOut, ExternalLink, ChevronRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/sections", label: "Sections", icon: Layers },
    { href: "/admin/comments", label: "Comments", icon: MessageSquare },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="w-56 flex-shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col h-dvh sticky top-0">
            <div className="px-5 h-14 flex items-center border-b border-[hsl(var(--border))]">
        <span className="font-bold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
          Krish<span className="text-[hsl(var(--accent))]">.</span>
        </span>
                <span className="ml-2 text-[10px] font-sans font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Admin</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {nav.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link key={href} href={href}
                              className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-sans transition-colors relative",
                                  active ? "text-[hsl(var(--foreground))] font-medium" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
                              )}>
                            {active && (
                                <motion.div layoutId="sidebar-active"
                                            className="absolute inset-0 bg-[hsl(var(--secondary))] rounded"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }} />
                            )}
                            <Icon className="h-4 w-4 relative z-10 flex-shrink-0" />
                            <span className="relative z-10">{label}</span>
                            {active && <ChevronRight className="h-3 w-3 ml-auto relative z-10 text-[hsl(var(--accent))]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-[hsl(var(--border))] p-3 space-y-1">
                <Link href="/" target="_blank"
                      className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-sans text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors">
                    <ExternalLink className="h-4 w-4" /> View site
                </Link>
                <div className="flex items-center gap-2.5 px-3 py-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-sans font-medium truncate">{user?.full_name ?? user?.email}</p>
                        <p className="text-[10px] font-sans text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <ThemeToggle className="flex-shrink-0" />
                    <button onClick={logout}
                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors"
                            aria-label="Sign out">
                        <LogOut className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
