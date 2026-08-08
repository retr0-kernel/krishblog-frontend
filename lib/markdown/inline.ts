/** Inline markdown: bold, italic, code, links, images. */
export function formatInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4" />')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`(.+?)`/g,
      '<code class="font-mono text-sm bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">$1</code>'
    )
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
      return `<a href="${url}" class="text-[hsl(var(--accent))] underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
}
