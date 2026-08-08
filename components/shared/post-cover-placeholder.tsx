import { cn } from "@/lib/utils";

interface PostCoverPlaceholderProps {
  title: string;
  className?: string;
}

export function PostCoverPlaceholder({ title, className }: PostCoverPlaceholderProps) {
  const initial = title.trim().charAt(0).toUpperCase() || "K";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-[hsl(var(--muted))] via-[hsl(var(--secondary))] to-[hsl(var(--muted))]",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-6xl md:text-7xl font-bold text-[hsl(var(--accent)/0.18)] select-none"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {initial}
        </span>
      </div>
    </div>
  );
}
