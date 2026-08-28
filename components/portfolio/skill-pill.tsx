import { cn } from "@/lib/utils";
import { getSkillIcon } from "@/lib/skill-icons";

export function SkillPill({
  label,
  className,
  showIcon = true,
}: {
  label: string;
  className?: string;
  showIcon?: boolean;
}) {
  const icon = showIcon ? getSkillIcon(label) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[hsl(var(--border))]",
        "bg-[hsl(var(--card))] text-sm font-sans text-[hsl(var(--foreground))]",
        "hover:border-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent))] transition-colors",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 text-[hsl(var(--accent))]" aria-hidden>
          {icon}
        </span>
      )}
      {label}
    </span>
  );
}
