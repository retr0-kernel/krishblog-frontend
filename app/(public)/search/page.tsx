import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchContent from "./search-content";

export const metadata = {
    title: "Search",
    description: "Search all posts on Krish Blog.",
};

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="pt-24 min-h-dvh flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
