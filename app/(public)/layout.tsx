import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSections } from "@/lib/api";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    let sections: import("@/types").Section[] = [];
    try { sections = await getSections(); } catch { /* optional */ }
    return (
        <>
            <Navbar sections={sections} />
            <main>{children}</main>
            <Footer />
        </>
    );
}
