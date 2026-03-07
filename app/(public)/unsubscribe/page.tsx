import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import UnsubscribeContent from "./unsubscribe-content";

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="pt-24 min-h-dvh flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[hsl(var(--muted-foreground))]" />
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    );
}
