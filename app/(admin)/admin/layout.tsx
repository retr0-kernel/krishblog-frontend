import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex h-dvh overflow-hidden bg-[hsl(var(--background))]">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </AuthGuard>
    );
}
