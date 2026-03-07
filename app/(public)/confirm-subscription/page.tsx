import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ConfirmContent from "./confirm-content";

export default function ConfirmSubscriptionPage() {
    return (
        <Suspense fallback={
            <div className="pt-24 min-h-dvh flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[hsl(var(--muted-foreground))]" />
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    );
}
